import { Card, CircularProgress, Collapse, IconButton, TextField } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { deepPurple, grey } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React, {ChangeEvent, Key, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { actions, useAppDispatch, useAppSelector } from '../../../store'
import { useGetChatQuery, useSendMessageMutation } from '../../../store/RTKQuery'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import FilledInput from '@mui/material/FilledInput'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/system'
import { useSocketContext } from '../../../store/SocketContext'
import MessageItem from '../../../components/MessageItem'
import MessageSender from '../../../components/MessageSender'

const ChatSection = () => {
    const { getSocket } = useSocketContext();
    const socket = getSocket();
    const { selectedChat, selectedChatData, user } = useAppSelector((state) => state.slice)
    const getChatStatus = useAppSelector((state) => state.slice.endpointStatus.getChat)
    let messageEnd: any;
    const fileRef = useRef<HTMLInputElement | null>(null);
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [sendMessageReq, sendMessageResp] = useSendMessageMutation();
    const [message, setMessage] = useState('')
    const getChatQuery = useGetChatQuery(selectedChat?.chat_id)

    // if (selectedChatData) {
    //     // console.log("SelectedChatData: ", selectedChatData)
    //     // console.log("SelectedChatDataMessages: ", selectedChatData.messages)
    // }
    useEffect(() => {
        if (selectedChat != null) {
            if (selectedChatData == null || selectedChat.chat_id != selectedChatData.chat_id) {
                console.log('selectedChat', selectedChat)
                console.log('selectedChatData', selectedChatData)
                console.log("Get Chat Query: Refetch")
                getChatQuery.refetch()
            }
            // console.log("Chat Section Entered invoked.")
            socket.emit("join_room", { user: user?._id, roomId: selectedChat._id })
            socket.on('update', (data: any) => {
                // console.log('data', data)
            })
            socket.on("message_update", (data: any) => {
                // messageEnd.scrollIntoView({ behavior: "smooth" });
                // console.log('message update data: ', data)
                if (!selectedChatData?.messages.includes(data.message)) {
                    dispatch(actions.slice1.pushChatMessage(data.message))
                }
            })
        }
        return () => {
            // console.log("Chat section exit invoked.")
            socket.emit("leave_room", { user: user?._id, roomId: selectedChat?._id })
            socket.off("message_update")
        }
    }, [selectedChat])

    useEffect(() => {
        console.table(sendMessageResp)
        if (sendMessageResp.isLoading == false && sendMessageResp.isSuccess == true && sendMessageResp.status == 'fulfilled') {
            // console.log("Send Message event triggered.")
            socket.emit("send_message", { message: sendMessageResp.data.message })
        }
    }, [sendMessageResp])


    const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setMessage(value);
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            // console.log(e.target.files)
            // setFiles(e.target.files)
        }
    }

    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message != '') {
            sendMessageReq({ chatId: selectedChat?._id, message, files: [] })
            // socket.to(selectedChat?.chat_id).emit({ chatId: selectedChat?._id, message, files: [] })
            // socket.emit("send_message",{chatId: selectedChat?.chat_id, message,files: []})
            setMessage('')
        }
    }
    return (
        <React.Fragment>
            <Grid flexDirection='column' height='100%' display='flex' position='relative'>
                <Grid item flexDirection='column'>
                    <Paper sx={{ position: 'relative', zIndex: 2 }}>
                        <Grid container bgcolor='InfoBackground' direction='row' padding={2}>
                            <Grid container direction='row' justifyContent='flex-start'>
                                {/* {getChatQuery.isLoading == true && <CircularProgress />} */}
                                {getChatStatus == 'loading' && <CircularProgress />}
                                {/* {getChatQuery.isLoading == false && getChatQuery.isSuccess == true && */}
                                {getChatStatus == 'success' &&
                                    <React.Fragment>
                                        <Grid item xs={0.5}>
                                            <Avatar sx={{ bgcolor: deepPurple[400] }}>{getChatQuery.data.team_name[0]}</Avatar>
                                        </Grid>
                                        <Grid item container marginLeft={2} direction='column' xs={4}>
                                            <Typography variant='body1'>{getChatQuery.data.team_name}</Typography>
                                            {/* <Typography color='grey' variant='body2'>{selectedUser?.email}</Typography> */}

                                        </Grid>
                                    </React.Fragment>
                                }

                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                {/* {getChatQuery.isLoading == true && */}
                {getChatStatus == 'loading' &&

                    <Grid flexDirection='column' display='flex' bgcolor={grey[200]} justifyContent='center' alignItems='center' ref={(el) => { messageEnd = el; }} position='relative' zIndex={0} className='sc1' sx={{ height: '100%' }} item>
                        <Card sx={{ padding: '25px', borderRadius: '14px' }}>
                            <Grid item flexDirection='column' justifyContent='center' display='flex' alignItems='center'>
                                <CircularProgress size={70} />
                                <Typography marginTop={5} variant='h5' color={theme.palette.grey[700]} fontWeight='bold'>Loading Messages</Typography>
                                <Typography variant='caption' color={theme.palette.grey[500]}>Please wait ...</Typography>
                            </Grid>
                        </Card>

                    </Grid>}
                {/* {getChatQuery.isLoading == false && getChatQuery.isSuccess == true && selectedChatData != null && */}
                {getChatStatus == 'success' && selectedChatData != null &&
                    <Grid flexDirection='column' ref={(el) => { messageEnd = el; }} position='relative' zIndex={0} className='sc1' sx={{ height: '100%', overflowY: 'scroll' }} item bgcolor={grey[200]}>
                        <React.Fragment>
                            {Object.values(selectedChatData?.messages).map((item, index) => {
                                if (index == selectedChatData?.messages.length - 1) {
                                    return <MessageItem key={item._id as Key} messageItem={item} />
                                } else {
                                    return <MessageItem key={item._id as Key} messageItem={item} />
                                }
                            })}
                        </React.Fragment>
                    </Grid>
                }
                
                <MessageSender/>
                {/* <Paper elevation={3}>
                    <form onSubmit={sendMessage}>
                        <Grid display='flex' flexDirection='row' alignItems='center' paddingY={1.5} paddingX={1} position='relative' zIndex={2} bgcolor='white' >
                            <Grid item>
                                <IconButton size='large' onClick={() => { if (fileRef.current != null) { fileRef.current.click() } }}>
                                    <input type='file' multiple={true} style={{ display: 'none' }} onChange={handleFileChange} ref={fileRef} />
                                    <AttachFileIcon sx={{ transform: 'rotate(45deg)' }} />
                                </IconButton>
                            </Grid>
                            <Grid item flexGrow='1' paddingX={2} paddingY={0.4}>
                                <OutlinedInput value={message} onChange={handleMessageInput} sx={{ backgroundColor: theme.palette.grey[200], borderRadius: '205px' }} fullWidth={true} />
                            </Grid>
                            <Grid item>
                                <IconButton type='submit'>
                                    <SendIcon fontSize='medium' />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </form>
                </Paper> */}
            </Grid>

        </React.Fragment>);
}

export default ChatSection