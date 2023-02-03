import React, { ReactNode } from 'react'
import {Grid, Typography} from '@mui/material'
import {red} from '@mui/material/colors'

interface PropType {
  text: string
}

const ErrorBox = ({text}: PropType) => {
  return (
    <Grid container bgcolor={red[50]} marginY={1} border='1px solid red' borderRadius='8px' padding={1} justifyContent='center' alignItems='center'>
      <Typography color={red[400]}>{text}</Typography>
    </Grid>
  )
}

export default ErrorBox