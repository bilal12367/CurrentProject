import {
  Button,
  Grid,
  IconButton,
  ThemeProvider,
  Collapse,
  Typography,
} from '@mui/material'
import { createTheme } from '@mui/system'
import React, { useState, Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import il1 from '../../assets/landingpagepic1.png'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NavbarPageRoutes from '../components/NavbarPageRoutes'
const theme = createTheme({})
export const LandingPage = () => {
  const [toggleNav, setToggleNav] = useState<boolean>(false)
  const navigate = useNavigate()
  return (
    <Fragment>
      <Grid
        container
        direction="column"
        overflow="auto"
        sx={{ height: '100%', backgroundColor: 'aliceblue' }}
      >
        <Grid
          // App Bar
          container
          paddingX={{ xs: 7, sm: 15, md: 25, xl: 25 }}
          alignItems={{
            md: 'flex-start',
            lg: 'center',
            xl: 'center',
            xs: 'flex-start',
          }}
          justifyContent={{
            md: 'flex-start',
            lg: 'space-between',
            xl: 'space-between',
            xs: 'flex-start',
          }}
          sx={{ backgroundColor: 'white' }}
          direction={{ md: 'column', lg: 'row', xl: 'row', xs: 'column' }}
        >
          <Grid item padding={0} width={{ lg: '20%', xl: '20%', xs: '100%' }}>
            <Grid container direction="row" justifyContent="space-between">
              <h1 className="font3">Logo</h1>
              <Grid
                item
                display={{ xs: 'flex', lg: 'none', xl: 'none' }}
                alignItems="center"
              >
                <IconButton
                  onClick={() => {
                    setToggleNav(!toggleNav)
                  }}
                >
                  <MenuRoundedIcon color="primary" fontSize="large" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <NavbarPageRoutes onLg={true} />
            <Collapse in={toggleNav}>
              <NavbarPageRoutes onLg={false} />
            </Collapse>
          </Grid>
        </Grid>

        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          direction="row"
          margin={{ xs: 0, lg: "10% 0%", xl: "10% 0%" }}
          paddingX={{ xs: 6, sm: 16, md: 24, lg: 20, xl: 25 }}
        // paddingX={25}
        >
          <Grid container item direction="column" xs={12} md={12} lg={6}>
            <Typography letterSpacing="6px" variant='h3'>
              <p className="font4" style={{margin:'0px'}}>
                Say Goodbye to, those heavy Messaging apps.{' '}
              </p>
            </Typography>

            <Typography
              letterSpacing="3px"
              color="grey"
              variant="subtitle1"
              marginTop="40px"
            >
              Get Started by connecting with your colleagues <br /> and working
              on your awesome project.
            </Typography>
            <Grid>
              <Button
                variant="contained"
                sx={{ marginTop: '40px' }}
                onClick={() => {
                  console.log("Navigating to login page from landing page")
                  navigate('/auth/login')
                }}
                size="large"
              >
                Login / Register
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            item
            direction="column"
            xs={12}
            md={12}
            lg={6}
            alignItems="flex-end"
          >
            <Grid container item marginTop={{ xs: 6, sm: 15, md: 20, lg: 0, xl: 0 }} direction="row">
              {/* <h1>Welcome To Our Website</h1> */}
              <img src={il1} height="100%" width="100%" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}
