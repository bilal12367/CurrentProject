import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import './DashboardPages.css'
import GroupsIcon from '@mui/icons-material/Groups'
import SearchIcon from '@mui/icons-material/Search';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { useSocketContext } from '../store/SocketContext';
import { io } from 'socket.io-client'
import { useAppSelector } from '../store';
const Dashboard: React.FC = () => {
  const [navState, setNavState] = useState({ width: 0.7, showText: false })
  const { chatId } = useParams();
  const user = useAppSelector(state => state.slice.user)
  const [alignment, setAlignment] = React.useState<string | null>('Teams');
  const navigate = useNavigate();
  const { getSocket, setSocket } = useSocketContext();
  var socket = getSocket();

  useEffect(() => {
    handleChange(null, 0)
    if (user != null) {
      // socket.emit("clear",{})
      setSocket(user._id, user)
    }
    return () => {
      if (user != null) {
        socket.emit("disconnect", { user: user })
      }
    }
  }, [user])

  // const handleAlignment = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newAlignment: string | null,
  // ) => {
  //   if (newAlignment != null) {
  //     navigate('/dashboard/' + newAlignment)
  //   }
  //   setAlignment(newAlignment);
  // };

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent | null, newValue: number) => {
    var path = '';
    switch (newValue) {
      case 0:
        path = 'teams'
        break;
      case 1:
        path = 'search'
        break;
      case 2:
        path = 'posts'
        break;
      case 3:
        path = 'aboutDev'
        break;
      default:
        path = 'teams'
        break;
    }
    setValue(newValue);
    if (path != '') {
      // console.log("Navigating to dashboard+path from dashboard and path is: " + path)
      if (chatId != undefined && path == 'teams') {
        navigate('/dashboard/' + path + '/' + chatId)
      } else {
        navigate('/dashboard/' + path)
      }
    }
  };

  return (
    <main>
      <Box
        height="100vh"
        display="flex"
        bgcolor="aliceblue"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >

        <Grid container direction="row" height="100%" justifyContent="flex-start">
          <Grid
            className='smoothTs'
            item
            bgcolor="white"
            onMouseLeave={() => {
              setNavState({ ...navState, showText: false })
            }}
            overflow='visible'
            onMouseEnter={() => {
              setNavState({ ...navState, showText: true })
            }}
            xs={navState.width}
          >
            <Paper elevation={3}>
              <List disablePadding>
                {/* Make Component from here */}
                {/* <ToggleButtonGroup
                value={alignment}
                exclusive
                color='primary'
                fullWidth={true}
                role='group'
                orientation='vertical'
                onChange={handleAlignment}
                aria-label="text alignment"
              >

                <MenuItem icon={<GroupsIcon />} showText={navState.showText} title='Teams' handleAlignment={handleAlignment} alignment={alignment} />
                <MenuItem icon={<SearchIcon />} showText={navState.showText} title='Search' handleAlignment={handleAlignment} alignment={alignment} />
                <MenuItem icon={<ViewStreamIcon />} showText={navState.showText} title='Posts' handleAlignment={handleAlignment} alignment={alignment} />


              </ToggleButtonGroup> */}
                <Tabs orientation='vertical' value={value} onChange={handleChange} TabIndicatorProps={{ style: { borderLeft: '5px', borderColor: 'divider' } }}>
                  <Tab label="Teams" icon={<GroupsIcon />} />
                  <Tab label="Search" icon={<SearchIcon />} />
                  <Tab label="Posts" icon={<ViewStreamIcon />} />
                  <Tab label="Developer" icon={<PersonIcon />} />
                </Tabs>

              </List>
            </Paper>
          </Grid>
          <Grid item className='smoothTs' bgcolor="aliceblue" xs={12 - navState.width}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </main>
  )
}

export default Dashboard
