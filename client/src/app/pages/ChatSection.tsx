import { Box, Button, Card, CircularProgress, Collapse, IconButton, TextField } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { deepPurple, grey } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import React, { ChangeEvent, Key, createRef, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { actions, useAppDispatch, useAppSelector } from '../store'
import { useGetChatQuery, useGetPeerAndSocketIdMutation, useSendMessageMutation } from '../store/RTKQuery'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import FilledInput from '@mui/material/FilledInput'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/system'
import { useSocketContext } from '../store/SocketContext'
import MessageItem from '../components/MessageItem'
import MessageSender from '../components/MessageSender'
import MoreVert from '@mui/icons-material/MoreVert'
import { PeerInstance } from '../utils/Peer_Helper'
import { CallState } from '../store/types'
import CallModal from '../Modals/CallModal';
import { BackgroundColors } from '../colors/colors';

const ChatSection = () => {
    const { getSocket, getPeer } = useSocketContext();
    const socket = getSocket();
    // const peer = getPeer();
    const videoRef: any = useRef();
    const [callModal, openCallModal] = useState(false);
    const { selectedChat, selectedChatData, user } = useAppSelector((state) => state.slice)
    const getChatStatus = useAppSelector((state) => state.slice.endpointStatus.getChat)
    let messageEnd: any;
    var temp: any;
    const [getPeerAndSocketId, peerIdToCall] = useGetPeerAndSocketIdMutation();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const [callIncomingState, setCallIncomingState] = useState<CallState>('idle');
    const [incomingCallData, setIncomingCallData] = useState<any>();
    const [sendMessageReq, sendMessageResp] = useSendMessageMutation();
    const [message, setMessage] = useState('')
    const getChatQuery = useGetChatQuery(selectedChat?.chat_id)
    // if (selectedChatData) {
    //     // console.log("SelectedChatData: ", selectedChatData)
    //     // console.log("SelectedChatDataMessages: ", selectedChatData.messages)
    // }
    var peer: any;

    // peer.on('call', async (call: any) => {
    //     const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //     console.log("Stream Ready Answering Call: ")
    //     call.answer(stream)

    //     call.on('stream', (remoteStream: any) => {
    //         console.log("Show Stream2: ")
    //         // setRemoteStream(remoteStream);
    //         if (videoRef.current) {
    //             const video = videoRef.current
    //             video.srcObject = remoteStream
    //             videoRef.current.play().catch((err:any)=> {
    //                 console.log('err', err)
    //             })
    //         }else {
    //             console.log("Video Ref not set")
    //         }

    //     })
    // })

    useEffect(() => {
        peer = new PeerInstance(socket, user, setCallIncomingState);
        if (videoRef.current != null)
            peer.setUpCallListener(videoRef.current);
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
                if (!selectedChatData?.messages.includes(data)) {
                    dispatch(actions.slice1.pushChatMessage(data.message))
                }
            })
            socket.on("call_request", (data: any) => {
                console.log('call_request: ', data)
                setCallIncomingState('call_incoming')
                setIncomingCallData(data)
            })

            socket.on("accept_call", (data: any) => {
                console.log("Accept Call Event received")
                console.log('data', data)
                peer.makeCall(videoRef, data.peerId)
            })
        }
        return () => {
            console.log("Chat section exit invoked.")
            socket.emit("leave_room", { user: user?._id, roomId: selectedChat?._id, updateDbFlag: true })
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
        if (e.target.files) {
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

    const acceptIncomingCall = () => {
        socket.emit("accept_call", incomingCallData)
    }
    return (
        <React.Fragment>
            <Grid flexDirection='column' height='100%' display='flex' position='relative'>
            <CallModal open={callModal} openModal={openCallModal} />
                <Collapse in={callIncomingState == 'call_incoming' ? true : false}>
                    <Grid position='absolute' right={0} bottom={0} zIndex={999} height='300px' width='300px'>
                        <Paper style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', height: '100%', width: '100%' }}>
                            <h1>Call Incoming</h1>
                            <AccountCircleRoundedIcon style={{ fontSize: '100px', color: BackgroundColors.grey2, border: '4px solid '+ BackgroundColors.grey2 , borderRadius: '180px' }} />
                            {incomingCallData ?
                                <Grid display='flex' marginY={1}>
                                    <Typography variant='subtitle1' fontWeight='bold'>{incomingCallData.user.name}</Typography>
                                </Grid> : <CircularProgress />}

                            <Grid display='flex' width='100%' flexDirection='row' justifyContent='center'>
                                <Button variant='contained' color='success' onClick={acceptIncomingCall}>Accept</Button>
                                <Box width='30px'></Box>
                                <Button variant='contained' color='error'>Decline</Button>
                            </Grid>
                        </Paper>
                    </Grid>
                </Collapse>
                <Collapse in={callIncomingState == 'call_accepted' ? true : false}>
                    <Grid position='absolute' right={0} bottom={0} zIndex={999} height='300px' width='300px'>
                        <video ref={videoRef} height='250px' width='250px' />

                    </Grid>
                </Collapse>
                <Grid item flexDirection='column'>
                    <Paper sx={{ position: 'relative', zIndex: 2 }}>
                        <Grid container bgcolor='InfoBackground' width="100%" direction='row' padding={2} >
                            <Grid container direction='row' width="100%" justifyContent='space-between' >
                                {/* {getChatQuery.isLoading == true && <CircularProgress />} */}
                                {getChatStatus == 'loading' && <CircularProgress />}
                                {/* {getChatQuery.isLoading == false && getChatQuery.isSuccess == true && */}
                                {getChatStatus == 'success' &&
                                    <Grid display='flex' justifyContent='flex-start' flexDirection='row'>
                                        <Grid item >
                                            <Avatar sx={{ bgcolor: deepPurple[400] }}>{getChatQuery.data.team_name[0]}</Avatar>
                                        </Grid>
                                        <Grid item direction='column' justifyContent='center' paddingLeft={3} height='100%'>
                                            <Typography fontSize={16} variant='body1'>{getChatQuery.data.team_name}</Typography>
                                            {/* <Typography color='grey' variant='body2'>{selectedUser?.email}</Typography> */}

                                        </Grid>
                                    </Grid>
                                }
                                <Grid display='flex' flexDirection='row'>
                                    <IconButton onClick={async () => {
                                        var partics = selectedChatData?.participants
                                        var userToCall;
                                        partics?.forEach((item: any) => {
                                            if (item._id != user?._id) userToCall = item._id
                                        })
                                        const resp: any = await getPeerAndSocketId({ user: userToCall })
                                        const resp2: any = await getPeerAndSocketId({ user: user?._id })
                                        openCallModal(true);
                                        if (resp.data.status == 'online') {
                                            console.log("Online", resp.data)
                                            // socket.emit('call_request', { user: user, peerId: resp.data.peerId, socketId: resp.data.socketId, callerSocketId: socket.id, callerPeerId: resp2.data.peerId })
                                        } else {
                                            // User Is Offline.   
                                        }
                                        // const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                                        // const call = await peer.call(peerId, stream)

                                        // call.on('stream', (remoteStream: any) => {
                                        //     console.log("Show Stream")
                                        //     // setRemoteStream(remoteStream);
                                        //     if (videoRef.current) {
                                        //         const video = videoRef.current
                                        //         video.srcObject = remoteStream
                                        //         videoRef.current.src = remoteStream;
                                        //         videoRef.current.play().catch((err: any) => {
                                        //             console.log('err', err)
                                        //         })
                                        //     } else {
                                        //         console.log("Video Ref not set")
                                        //     }
                                        // })
                                    }}>
                                        <CallIcon />
                                    </IconButton>
                                    <IconButton>
                                        <VideocamIcon />
                                    </IconButton>
                                    <IconButton>
                                        <MoreVert />
                                    </IconButton>
                                </Grid>
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
                                var showUser = true;
                                var showTime = true;
                                const currentDate = new Date(item.updatedAt as string)
                                var current = '';
                                var prev = '';
                                current = currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear()
                                if (temp) {
                                    if (temp.from == item.from) {
                                        showUser = false;
                                    }
                                    const prevDate = new Date(temp.updatedAt)
                                    prev = prevDate.getDate() + '/' + prevDate.getMonth() + '/' + prevDate.getFullYear()

                                    if (prev != current) {
                                        showTime = true;
                                        console.log("Showtime is true")
                                    } else {
                                        showTime = false;
                                    }
                                    // console.log("Previous Date: ",prevDate.getDate()+ '/' + prevDate.getMonth()+ '/' + prevDate.getFullYear())
                                    // console.log("Current Date: ",currentDate.getDate())
                                }
                                temp = item;
                                if (index == selectedChatData?.messages.length - 1) {
                                    return <>
                                        {showTime &&
                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                <Paper style={{ padding: '8px', marginTop: '8px' }}>{current}</Paper>
                                            </div>}
                                        <MessageItem key={item._id as Key} messageItem={item} showUser={showUser} />
                                    </>
                                } else {
                                    return <>
                                        {showTime &&
                                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                                <Paper style={{ padding: '8px', marginTop: '8px' }}>{current}</Paper>
                                            </div>}
                                        <MessageItem key={item._id as Key} messageItem={item} showUser={showUser} />
                                    </>
                                }
                            })}
                        </React.Fragment>
                    </Grid>
                }

                <MessageSender />
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