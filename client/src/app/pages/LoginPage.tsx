import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Typography,
  Alert
} from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { actions, useAppDispatch, useAppSelector } from '../store'
import { useLoginUserMutation } from '../store/RTKQuery'

export interface Form {
  email: string
  password: string
}

export interface FormError {
  emailError: string,
  passwordError: string
}
const LoginPage = () => {
  const navigate = useNavigate()
  const [loginUser, response] = useLoginUserMutation();
  const LoginError = useAppSelector((state) => state.slice.errors.login)
  const [formState, setFormState] = useState<Form>({ email: '', password: '' })
  const [formErrors, setFormErrors] = useState<FormError>({ emailError: '', passwordError: '' })
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (response.isSuccess == true && response.data.user != null) {
      dispatch(actions.slice1.setUser(response.data.user))
      console.log("Navigating to dashboard from Login Page")
      navigate('/dashboard')
    } else if (response.isSuccess == true && response.data.user == null) {
      const error = response.data.error;
      const type = response.data.type;
      // Show Error Somewhere.
      if (type == 'email') {
        setFormErrors({ ...formErrors, emailError: error })
      } else if (type == 'password') {
        setFormErrors({ ...formErrors, passwordError: error })
      }
    }
    // if( response.data.user != null){
    //   navigate('/dashboard')
    // }
  }, [response])
  const Login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginUser({ user: formState }).unwrap()
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [event.currentTarget.name]: event.currentTarget.value })
  }
  return (
    <div>
      <Grid marginY={2} container justifyContent="center" direction="row">
        <Typography fontWeight="bold" variant="h4">
          <span className="font4">Login Form</span>
        </Typography>
      </Grid>
      <Divider light />
      <form onSubmit={Login}>
        {LoginError.error != null && <Grid item container><Alert sx={{width:'100%'}} severity='error'>{LoginError.message}</Alert></Grid>}
        <Grid
          spacing={4}
          container
          direction="column"
          paddingX={1}
          paddingY={2}
          display="flex"
        >
          <Grid item container direction="column">
            <TextField name='email' type='email' variant="outlined" onChange={handleChange} value={formState.email} label="Enter Email" />
          </Grid>
          <Grid item container direction="column">
            <TextField name='password' type='password' variant="outlined" onChange={handleChange} value={formState.password} label="Password" />
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid
            item
            container
            xs={12}
            xl={6}
            lg={4}
            md={12}
            justifyContent="flex-start"
          >
            <Button
              variant="text"
              onClick={() => {
                console.log("Navigating to register from login")
                navigate('/auth/register')
              }}
            >
              Don't Have An Account ?
            </Button>
          </Grid>
          <Grid item container xs={12} xl={6} lg={8} md={12}>
            <Button type='submit' sx={{ width: '100%' }} variant="contained" size="large">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default LoginPage
