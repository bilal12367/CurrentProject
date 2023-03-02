import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/system';
import React, { useEffect, useState, ReactNode } from 'react'
import { useDispatch } from 'react-redux';
import { actions } from '../store/index'
import { useParams } from 'react-router-dom'
import { ChatItem, useAppSelector } from '../store';
interface PropType {
  children: ReactNode
}
const ChatIdProtectedRoute = ({ children }: PropType) => {
  const theme = useTheme();
  const userChatList = useAppSelector((state) => state.slice.userChatList)
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const selectedChat: (ChatItem | null) = useAppSelector((state) => state.slice.selectedChat)
  const [status, setStatus] = useState<string>('loading')
  useEffect(() => {
    if (selectedChat == null || selectedChat.chat_id != chatId) {
      var chatItem: ChatItem = userChatList.filter((item) => {
        if (item.chat_id === chatId) {
          return item;
        }
      })[0]
      if (chatItem == undefined && userChatList.length != 0) {
        setStatus('failed')
      } else {
        dispatch(actions.slice1.setSelectedChat(chatItem))
      }
    } else if (selectedChat.chat_id === chatId) {
      setStatus('success')
    }
  }, [userChatList, selectedChat])
  if (status == 'success') {
    return (<React.Fragment>
      {children}
    </React.Fragment>)

  } else if (status == 'loading') {
    return (<Grid container direction='column' height='100%' bgcolor='aliceblue' justifyContent='center' alignItems='center'>
      <CircularProgress size={70} />
      <Typography marginTop={5} variant='h4' color={theme.palette.grey[700]} fontWeight='bold'>Loading</Typography>
      <Typography variant='caption' color={theme.palette.grey[500]}>Please wait ...</Typography>
    </Grid>)
  } else if (status == 'failed') {
    return (<Grid container direction='column' height='100%' bgcolor='aliceblue' justifyContent='center' alignItems='center'>
      <Typography variant='h4'>Chat Not Found.</Typography>
    </Grid>)
  } else {
    return <></>
  }
}

export default ChatIdProtectedRoute