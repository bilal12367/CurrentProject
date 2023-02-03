import { Grid, Paper, useTheme } from '@mui/material'
import { deepPurple } from '@mui/material/colors'
import React, { Key } from 'react'
import { Message, useAppSelector } from '../store'

interface PropType {
    messageItem: Message
}

const MessageItem = ({ messageItem }: PropType) => {
    const user = useAppSelector((state) => state.slice.user)
    const theme = useTheme();
    var setContent = {
        alignment: 'flex-start',
        bgColor: '#817ecf',
        textColor: 'white'
    }
    if (user?._id !== messageItem.from) {
        setContent.alignment = 'flex-start'
        // setContent.bgColor = '#817ecf'
        setContent.textColor = 'white'
        setContent.bgColor = deepPurple[300]
    } else {
        setContent.alignment = 'flex-end'
        setContent.textColor = 'black'
        setContent.bgColor = deepPurple[50]
    }
    return (
        <React.Fragment key={messageItem._id as (Key | null)}>
            <Grid container direction='row' marginY={2} paddingLeft={2} justifyContent={setContent.alignment}>
                <Paper elevation={2} sx={{borderRadius: '7px' ,backgroundColor: setContent.bgColor, color: setContent.textColor }}>
                    <Grid paddingX={2} maxWidth='440px' textOverflow='ellipsis' paddingY={1}>
                        {messageItem.message}
                    </Grid>
                </Paper>
            </Grid>
        </React.Fragment>
    )
}


export default MessageItem