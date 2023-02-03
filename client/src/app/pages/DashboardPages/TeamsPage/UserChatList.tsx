import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import InputAdornment from '@mui/material/InputAdornment'
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { MenuItem, useTheme } from '@mui/material'
import { useSocketContext } from '../../../store/SocketContext'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import { blue, deepPurple } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import { useGetUserChatListQuery } from '../../../store/RTKQuery'
import { actions, ChatItem, useAppDispatch, useAppSelector } from '../../../store'
import { useNavigate } from 'react-router-dom'



const UserChatList = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    // const [chatList, setChatList] = useState<ChatItem[]>([]);
    const { userChatList, user } = useAppSelector((state) => state.slice)
    var chatList = [...userChatList];
    useGetUserChatListQuery('');
    const { getSocket } = useSocketContext();
    const socket = getSocket();
    const dispatch = useAppDispatch();
    useEffect(() => {
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
        socket.on("message_update",(data: any)=>{
            dispatch(actions.slice1.messageUpdate(data.message))
        })
        return () => {
            console.log("Socket cut off")
            socket.off("chatUpdate")
            socket.off("message_update")
        }
    }, [])
    useEffect(() => {
        if (userChatList.length != 0) {
            console.log("---------------------------------------")
            console.log('Here is chatList', chatList)
            for (let chatItem of userChatList) {
                console.log("Joining room: ",chatItem._id)
                socket.emit("join_room", {user: user?._id, roomId:  chatItem._id})
            }
            console.log("---------------------------------------")
        }
        return()=>{
            for (let chatItem of userChatList) {
                console.log("Leaving room: ",chatItem._id)
                socket.emit("leave_room", {user: user?._id, roomId:  chatItem._id})
            }
        }
    }, [userChatList])
    if (userChatList.length != 0) {
        console.log('Chat List array: ', userChatList)
    }
    return (
        <Grid>
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
                        <Paper key={item._id} sx={{ marginTop: '14px' }} >
                            <MenuItem sx={{ padding: '0px' }} onClick={() => {
                                console.log('selected chat item: ', item)
                                dispatch(actions.slice1.setSelectedChat(item))
                                dispatch(actions.slice1.clearUnReadMessage(item))
                                navigate('/dashboard/teams/' + item.chat_id)
                            }}>
                                <Grid container direction='row' justifyContent='space-between' padding={2} >
                                    <Grid item flexDirection='row' display='flex'>
                                        <Avatar sx={{ bgcolor: deepPurple[400] }}>
                                            {team_name[0]}
                                        </Avatar>
                                        <Grid marginLeft={2} flexDirection='column'>
                                            <Typography variant='body1'>
                                                {team_name}
                                            </Typography>
                                            <Typography variant='caption'>
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