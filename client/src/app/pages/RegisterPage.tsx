import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useRegisterUserMutation } from '../store/RTKQuery'
import { setUseProxies } from 'immer'
import { useDispatch, useSelector } from 'react-redux'
import { actions, State, useAppDispatch, useAppSelector } from '../store'
interface Attributes {
  value: String
  error: Boolean
  errorText: String
}

interface FormState {
  name: String
  email: String
  password: String
  confirmpassword: String
}

interface FormError {
  name: String
  email: String
  password: Array<String>
  confirmpassword: String
}

type PasswordType = {
  type: 'success' | 'warning' | 'error' | 'primary'
  percentage: Number
  visible: true | false
}

const RegisterPage = () => {
  const user = useAppSelector((state) => state.slice.user)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [registerUser, response] = useRegisterUserMutation()

  useEffect(() => {
    if (response.isSuccess == true && user == null) {
      const user = response.data
      const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        friends: user.friends,
        profilePic: user.profilePic,
      }
      dispatch(actions.slice1.setUser(payload))
    }
  }, [response])

  useEffect(() => {
    if (user != null) {
      console.log("Navigating to dashboard from register page")
      navigate('/dashboard')
    }
  }, [user])
  const [passState, setPassState] = useState<PasswordType>({
    type: 'primary',
    percentage: 0,
    visible: false,
  })
  const initialFormState: FormState = {
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
  }
  const initialFormErrorState: FormError = {
    name: '',
    email: '',
    password: [],
    confirmpassword: '',
  }

  // if(response.isSuccess == true){
  //   const dispatch = useDispatch();
  //   const user = response.data
  //   const payload = {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     profilePic: user.profilePic
  //   }
  //   dispatch(actions.slice1.setUser(payload))
  // }
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [formErrors, setFormError] = useState<FormError>(initialFormErrorState)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // const resp = await axios.post('http://localhost:5000/api/v1/register', {
    //   user: formState,
    // },{withCredentials:true})

    // console.log('Resp: ', resp)

    registerUser({ user: formState })
      .unwrap()
      .then((res) => {})
  }

  const validatePassword = (password: string) => {
    var message = ''
    var passPts = 0

    formErrors.password = []
    if (password.match(/[a-z]/g)) {
      passPts += 10
    } else {
      formErrors.password.push(
        'Password should contain atleast 1 small letter.',
      )
    }
    if (password.match(/[A-Z]/g)) {
      passPts += 10
    } else {
      formErrors.password.push(
        'Password should contain atleast 1 Capital letter.',
      )
    }
    if (password.match(/[0-9]/g)) {
      passPts += 10
    } else {
      formErrors.password.push(
        'Password should contain atleast 1 numeric value.',
      )
    }
    if (password.match(/[!@#$%^&()-_]/g)) {
      passPts += 10
    } else {
      formErrors.password.push(
        'Password should contain atleast 1 special character.',
      )
    }
    if (password.match(/([a-zA-Z0-9!@#$%^&*()-_]){6,}/g)) {
      passPts += 100
    } else {
      formErrors.password.push('Password should contain atleast 6 characters.')
    }
    var percentage = (passPts / 140) * 100
    var type: 'primary' | 'warning' | 'error' | 'success' = 'primary'
    if (passPts < 100) {
      type = 'error'
    } else if (passPts >= 100 && passPts <= 130) {
      type = 'warning'
    } else if (passPts == 140) {
      type = 'success'
    }
    setPassState({ type: type, percentage: percentage, visible: true })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [event.currentTarget.name as keyof FormState]: event.currentTarget.value,
    })

    switch (event.currentTarget.name) {
      case 'name':
        var length = formState.name.length
        if (length <= 5 && length > 40) {
          setFormError({
            ...formErrors,
            [event.currentTarget
              .name as keyof FormError]: 'Name should be atleast 5 characters and less than 40 characters.',
          })
        } else if (/[^0-9a-zA-Z ]/.test(event.currentTarget.value)) {
          setFormError({
            ...formErrors,
            [event.currentTarget
              .name as keyof FormError]: 'Name should have only alphanumeric characters.',
          })
        } else {
          setFormError({
            ...formErrors,
            [event.currentTarget.name as keyof FormError]: '',
          })
        }
        break
      case 'email':
        var email = event.currentTarget.value
        if (email.match(/^\S+@\S+\.\S+$/)) {
          setFormError({
            ...formErrors,
            [event.currentTarget.name as keyof FormError]: '',
          })
        } else {
          setFormError({
            ...formErrors,
            [event.currentTarget
              .name as keyof FormError]: 'Please Enter a valid Email.',
          })
        }
        break
      case 'password':
        var password = event.currentTarget.value
        validatePassword(password)
        break
      case 'confirmpassword':
        if (event.currentTarget.value != formState.password) {
          setFormError({
            ...formErrors,
            [event.currentTarget
              .name as keyof FormError]: 'Passwords do not match.',
          })
        } else {
          setFormError({
            ...formErrors,
            [event.currentTarget.name as keyof FormError]: '',
          })
        }
        break
      default:
        break
    }

    // setTimeout(() => {
    //   console.table(formState)
    //   console.log(
    //     'Is Filled? = ' + Object.values(formState).every((item) => item != ''),
    //   )
    //   console.log(
    //     'No Errors? = ' + Object.values(formErrors).every((item) => item == ''),
    //   )
    //   console.log(
    //     '-----------------------------------------------------------------',
    //   )
    // }, 400)

    // setFormState({
    //   ...formState,
    //   [event.currentTarget.name]: {value: event.currentTarget.value, error: formState[event.currentTarget.name].error, errorText: formState[event.currentTarget.errorText]},
    // })
  }

  const getBtnState = () => {
    if (
      Object.values(formState).every((item) => item != '') &&
      Object.values(formErrors).every((item) => item == '')
    ) {
      return false
    } else {
      return true
    }
  }

  return (
    <div style={{ padding: '0px 60px' }}>
      <Grid
        marginY={2}
        container
        justifyContent="center"
        alignItems="center"
        direction="row"
      >
        <Typography fontWeight="bold" variant="h4">
          <span className="font4">Register</span>
        </Typography>
      </Grid>
      <Divider light />
      <form
        onSubmit={(event) => {
          handleSubmit(event)
        }}
      >
        <Stack
          spacing={4}
          direction="column"
          paddingX={1}
          paddingY={4}
          display="flex"
        >
          <TextField
            name="name"
            value={formState.name}
            error={formErrors.name == '' ? false : true}
            helperText={formErrors.name}
            variant="outlined"
            id="outlined-error"
            onChange={handleChange}
            label="Enter Name"
          />
          <TextField
            name="email"
            value={formState.email}
            error={formErrors.email == '' ? false : true}
            helperText={formErrors.email}
            variant="outlined"
            onChange={handleChange}
            label="Enter Email"
          />
          <Grid item container sx={{ width: '100%' }}>
            <TextField
              name="password"
              variant="outlined"
              sx={{ width: '100%' }}
              color={passState.type}
              type="password"
              // helperText={formErrors.password}
              value={formState.password}
              onChange={handleChange}
              label="Password"
            />
            <Typography
              variant="caption"
              color="grey"
              sx={{ marginTop: '5px' }}
            >
              {formErrors.password.map((item, index) => {
                return (
                  <p key={index} style={{ margin: '0px' }}>
                    {item}
                  </p>
                )
              })}
            </Typography>
          </Grid>
          {passState.visible == true && (
            <LinearProgress
              variant="determinate"
              value={passState.percentage as number}
              color={passState.type}
            />
          )}
          {passState.type == 'warning' && (
            <p style={{ color: '#ff9800', margin: '0px' }}>Weak Password</p>
          )}
          {passState.type == 'success' && (
            <p style={{ color: 'green', margin: '0px' }}>Strong Password</p>
          )}
          <TextField
            variant="outlined"
            type="password"
            error={formErrors.confirmpassword == '' ? false : true}
            helperText={formErrors.confirmpassword}
            value={formState.confirmpassword}
            name="confirmpassword"
            onChange={handleChange}
            label="Confirm Password"
          />
          <Grid
            container
            direction="column-reverse"
            justifyContent="space-between"
          >
            <Grid
              item
              container
              xs={12}
              xl={12}
              lg={4}
              md={12}
              paddingY={2}
              justifyContent="flex-end"
            >
              <Button
                variant="text"
                onClick={() => {
                  console.log("Navigating to login from register page")
                  navigate('/auth/login')
                }}
              >
                Already Have An Account ?
              </Button>
            </Grid>
            <Grid
              item
              justifyContent="center"
              alignItems="center"
              container
              xs={12}
              xl={12}
              lg={8}
              md={12}
            >
              {response.isLoading == true ? (
                <CircularProgress />
              ) : (
                <Button
                  type="submit"
                  sx={{ width: '100%' }}
                  variant="contained"
                  disabled={getBtnState()}
                  size="large"
                >
                  Register
                </Button>
              )}
            </Grid>
          </Grid>
        </Stack>
      </form>
    </div>
  )
}

export default RegisterPage
