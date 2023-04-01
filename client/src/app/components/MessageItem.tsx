import { Grid, Paper, Typography, colors, useTheme } from '@mui/material'
import { deepPurple } from '@mui/material/colors'
import { Box } from '@mui/system'
import React, { Key, useRef, useEffect } from 'react'
import { Message, useAppSelector } from '../store'
import { MessageFileItem } from './MessageFileItem'
import { UserItem } from './UserItem'
import { timeSince } from '../utils/utils'

interface PropType {
    messageItem: Message,
    showUser: boolean
}

const MessageItem = ({ messageItem,showUser }: PropType) => {
    const user = useAppSelector((state) => state.slice.user)
    const theme = useTheme();
    const ref = useRef<any>();
    var setContent = {
        alignment: 'flex-start',
        bgColor: '#817ecf',
        textColor: 'white',
        showFromUser: false
    }
    if (user?._id !== messageItem.from) {
        setContent.alignment = 'flex-start'
        // setContent.bgColor = '#817ecf'
        // setContent.textColor = 'white'
        setContent.textColor = 'black'
        setContent.bgColor = 'white'
        // setContent.bgColor = deepPurple[300]
        setContent.showFromUser = true
    } else {
        setContent.alignment = 'flex-end'
        setContent.textColor = 'black'
        setContent.bgColor = deepPurple[50]
    }
    
    useEffect(()=>{
        if(ref.current){
            const element = ref.current;
            element.scrollIntoView({behaviour: 'smooth'})
        }
    },[ref.current])

    return (
        <React.Fragment key={messageItem._id as (Key | null)}>
            <Grid container direction='row' marginY={2} ref={ref} paddingLeft={2} justifyContent={setContent.alignment}>
                {setContent.showFromUser == true && showUser == true && <UserItem userId={messageItem.from}/>}           
                {showUser == false && <Box height='34px' width='34px'/>}     
                <Paper elevation={2} sx={{position:'relative',marginLeft: '8px',borderRadius: '7px' ,backgroundColor: setContent.bgColor, color: setContent.textColor,paddingY:'6px' }}>
                    <Grid display='flex' flexDirection='column' paddingX={1} minWidth='100px' maxWidth='440px' textOverflow='ellipsis' >
                        {messageItem.message}
                        {messageItem.files && Object.values(messageItem.files).map((fileItem)=> {
                            return <MessageFileItem fileId={fileItem as string} />
                        })}
                    </Grid>
                    <Grid width='100%' display='flex' justifyContent='end' paddingRight='8px'>
                        <Typography variant='subtitle2' color={colors.grey[500]}>{timeSince(new Date(messageItem.updatedAt as string)) + ' ago'}</Typography>
                    </Grid>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}


export default MessageItem