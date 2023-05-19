import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, MenuItem, useTheme } from '@mui/material'
import { useSocketContext } from '../store/SocketContext'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import { blue, deepPurple } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import { useGetUserChatListQuery } from '../store/RTKQuery'
import { actions, ChatItem, useAppDispatch, useAppSelector } from '../store'
import { useNavigate } from 'react-router-dom'



const UserChatList = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // const [chatList, setChatList] = useState<ChatItem[]>([]);
    const { userChatList, selectedChat, user, selectedChatData } = useAppSelector((state) => state.slice)
    // const getChatStatus = useAppSelector((state)=> state.slice.endpointStatus.getChat)
    var chatList = [...userChatList];
    const getChatListObj = useGetUserChatListQuery('');

    const { getSocket } = useSocketContext();
    const socket = getSocket();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (getChatListObj.isLoading == false &&  userChatList == null) {
            console.log("Refetching get chat")
            console.log("selectedChat: ",selectedChat)
            console.log("selectedChatData: ",selectedChatData)
            console.log("Userchatlist: ",userChatList)
            getChatListObj.refetch()
        }
        socket.on("chatUpdate", (chatItem: ChatItem) => {
            if (chatItem.chat_type == 'duo' && user != undefined) {
                var team_name = ''
                for (let participant of chatItem.participants) {
                    if (user._id != participant._id) {
                        team_name = participant.name.toString();
                    }
                }
                chatItem.team_name = team_name;
            }
            dispatch(actions.slice1.addChatListItem(chatItem))
        })
        socket.on("message_update", (data: any) => {
            console.log("Message Update: ", data.message)
            console.log("Selected Chat Data: ", selectedChatData)

            dispatch(actions.slice1.messageUpdate(data.message))
            dispatch(actions.slice1.pushChatMessage(data.message))
        })
        return () => {
            socket.off("chatUpdate")
            for (let chatItem of userChatList) {
                // // console.log("Leaving room: ", chatItem._id)
                console.log("Leave room invoked in userchatlist")
                socket.emit("leave_room", { user: user?._id, roomId: chatItem._id, updateDbFlag: false })
            }
            socket.off("message_update")
        }
    }, [selectedChat])
    useEffect(() => {
        if (userChatList.length != 0) {
            // console.log("---------------------------------------")
            // console.log('Here is chatList', chatList)
            for (let chatItem of userChatList) {
                // console.log("Joining room: ", chatItem._id)
                socket.emit("join_room", { user: user?._id, roomId: chatItem._id })
            }
            // console.log("---------------------------------------")
        }
        return () => {

        }
    }, [userChatList])
    if (userChatList.length != 0) {
        // console.log('Chat List array: ', userChatList)
    }
    return (
        <Grid height='100%' width='100%'>
            <FormControl sx={{ width: '100%', backgroundColor: theme.palette.grey[200], borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderRadius: '4px', marginTop: '14px' }} variant="standard">
                <Input
                    sx={{ padding: '10px' }}
                    id="input-for-search"
                    startAdornment={
                        <SearchIcon />
                        // <InputAdornment id="input-for-search" position="start">
                        // </InputAdornment>
                    }
                />
            </FormControl>
            <h3>{socket.id}</h3>
            {getChatListObj.isLoading == true && <Grid container height='100%' width='100%' justifyContent='center'><CircularProgress size={80} /></Grid>}
            {
                // User Chat List DIsplay
                chatList.length != 0 && Object.values(chatList).map((item: ChatItem) => {
                    var team_name: any = item.team_name;
                    // if(item.chat_type === 'duo') {
                    //     for(var participant of item.participants){
                    //         if(participant._id != user?._id){
                    //             // Object.assign(item.team_name, participant.name)
                    //             team_name = participant.name
                    //         }
                    //     }
                    // }
                    return (
                        <Paper key={item._id} sx={{ marginTop: '14px', width: '100%' }} >
                            <MenuItem sx={{ padding: '0px' }} onClick={() => {
                                // console.log('selected chat item: ', item)
                                dispatch(actions.slice1.setSelectedChat(item))
                                dispatch(actions.slice1.clearUnReadMessage(item))
                                navigate('/dashboard/teams/' + item.chat_id)

                            }}>
                                <Grid container display='flex' justifyContent='space-between' padding={2} >
                                    <Grid item flexDirection='row' display='flex' overflow='hidden' >
                                        <Grid item >
                                            <Avatar sx={{ bgcolor: deepPurple[400] }}>
                                                {team_name[0]}
                                            </Avatar>
                                        </Grid>
                                        <Grid item container flexDirection='column' width='100%' overflow='clip' display='flex' paddingX='6px'>
                                            <Typography variant='body1' component={'span'}>
                                                {team_name}
                                            </Typography>
                                            <Typography variant='caption' component={'span'} sx={{ width: '100%', overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto' }} overflow='hidden' textOverflow='ellipsis'>
                                                {/* {item.urMessages.length != 0 && Object.values(item.urMessages).map((urmsg) => {
                                                return (<p>{urmsg}</p>)
                                            })} */}
                                                {/* {item.urMessages.length == 0 && <Typography variant='caption'>No New Messages</Typography>} */}
                                                {Object.hasOwn(item, 'lastMessage') ? item.lastMessage.message : "No Messages"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        {item.urMessages.length != 0 && <Avatar sx={{ bgcolor: blue[500], width: 25, height: 25, fontSize: '12px' }}>{item.urMessages.length}</Avatar>}
                                    </Grid>
                                </Grid>
                            </MenuItem>
                        </Paper>)
                })
            }
        </Grid>
    )
}

export default UserChatList