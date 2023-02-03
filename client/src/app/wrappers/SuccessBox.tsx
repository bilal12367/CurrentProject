import React, { ReactNode } from 'react'
import {Grid, Typography} from '@mui/material'
import {red,green} from '@mui/material/colors'

interface PropType {
  text: string
}

const SuccessBox = ({text}: PropType) => {
  return (
    <Grid container bgcolor={green[50]} marginY={1} border='1px solid green' borderRadius='8px' padding={1} justifyContent='center' alignItems='center'>
      <Typography color={green[400]}>{text}</Typography>
    </Grid>
  )
}

export default SuccessBox