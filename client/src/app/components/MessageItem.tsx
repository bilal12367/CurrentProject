import { Grid, Paper, Typography, useTheme } from '@mui/material'
import { deepPurple } from '@mui/material/colors'
import React, { Key, useRef, useEffect } from 'react'
import { Message, useAppSelector } from '../store'
import { UserItem } from './UserItem'

interface PropType {
    messageItem: Message,
}

const MessageItem = ({ messageItem }: PropType) => {
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
        setContent.textColor = 'white'
        setContent.bgColor = deepPurple[300]
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
                {setContent.showFromUser == true && <UserItem userId={messageItem.from}/>}                
                <Paper elevation={2} sx={{borderRadius: '7px' ,backgroundColor: setContent.bgColor, color: setContent.textColor }}>
                    <Grid display='flex' flexDirection='column' paddingX={2} maxWidth='440px' textOverflow='ellipsis' paddingY={1}>
                        {messageItem.message}
                        {messageItem.files && Object.values(messageItem.files).map((fileItem)=> {
                            return <Typography variant='caption'>{fileItem}</Typography>
                        })}
                    </Grid>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}


export default MessageItem