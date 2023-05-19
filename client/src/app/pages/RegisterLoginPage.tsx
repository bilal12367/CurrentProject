import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import React, {useEffect} from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import rgil from '../../assets/RegisterBack1.png'
import LoginPage from './LoginPage'
import { BackgroundColors } from '../colors/colors'

const RegisterLoginPage = () => {
    useEffect(()=> {
      
    })
  return (
    <div>
      <main>
        <Grid
          container
          direction="row"
          bgcolor={BackgroundColors.aliceBlue}
          sx={{ height: '100vh' }}
        >
          <Grid
            item
            container
            xl={8}
            bgcolor={BackgroundColors.grey}
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-start"
            // sx={{
            //   backgroundImage: `url(${rgil})`,
            //   backgroundRepeat: 'no-repeat',
            //   backgroundSize: '100% 100%',
            // }}
          >
              <img src={rgil} width='100%' height='100%' style={{aspectRatio:'4:3'}}/>
            {/* <Grid item container justifyContent="center">
              {/* <img src={rgil} height="60%" width="60%" /> */}
            {/*</Grid> */}
          </Grid>
          <Grid
            container
            item
            xl={4}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid
              container
              direction="column"
              height="100%"
              justifyContent="center"
            >
              <Card
                sx={{
                  minWidth: '40%',
                  borderRadius: '0px',
                  padding: '20px',
                  height: '100%',
                }}
                elevation={4}
              >
                <Outlet />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </main>
    </div>
  )
}

export default RegisterLoginPage
