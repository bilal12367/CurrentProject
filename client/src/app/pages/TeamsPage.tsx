import React, { useEffect, useRef, useState } from 'react'
import { Avatar, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Menu, Modal, MenuItem, Paper, TextField, Typography, useTheme, Box, Collapse } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { useAddDuoChatMutation, useGetAllUsersQuery } from '../store/RTKQuery';
import CircularProgress from '@mui/material/CircularProgress';
import { actions, ChatItem, useAppSelector, User } from '../store';
import { deepPurple } from '@mui/material/colors';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs/Tabs';
import Tab from '@mui/material/Tab/Tab';
import TabPanel from '../components/TabPanel';
import SimpleModalPopup from '../components/SimpleModalPopup';
import Divider from '@mui/material/Divider';
import UserSelectionComponent from '../Modals/AddTeamModal';
import UserChatList from './UserChatList';
import { useSocketContext } from '../store/SocketContext';
import SwipeableViewComponent from '../components/SwipeableViewComponent';
import { UserItem } from '../components/UserItem';
// import SwipeableViews from 'react-swipeable-views';
const TeamsPage = () => {
  const { getSocket } = useSocketContext();
  const { user, selectedUser, usersList, userChatList, selectedChatData, selectedChat } = useAppSelector((state) => state.slice)
  const { isLoading, isSuccess, isError } = useGetAllUsersQuery('');
  const [addDuoChat, addDuoChatResponse] = useAddDuoChatMutation();
  const [tabState, setTabState] = useState(0)
  const theme = useTheme();
  const menuRef = useRef(null);
  const [pageState, setPageState] = useState(0);
  const [showProfile, setShowProfile] = useState(0);     // Shows Profile for 2 and shows chat list for 1
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const dispatch = useDispatch();
  const { chatId } = useParams();
  var socket = getSocket();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setShowMenu(true)
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    const menuSelect = event.currentTarget.dataset.myValue
    // console.log('event: ', event.currentTarget.dataset.myValue)
    switch (menuSelect) {
      case "1":
        break;
      case "2":
        handleOpenModal();
        break;
    }
    setAnchorEl(null);
    setShowMenu(false);
  };

  useEffect(() => {
    if (chatId == undefined && selectedChatData != null) {
      dispatch(actions.slice1.setSelectedChatDataNull())
    }
    // if (selectedChatData == null) {
    //   socket.emit("leave_room", { user: user?._id, roomId: selectedChat?._id })
    // }
    return () => {

    }
  }, [selectedChatData, selectedChat])
  return (
    <main>
      <Grid container direction='row' width='100%' height='100vh'>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >

          <Paper elevation={3} sx={{ width: '30%', padding: '14px', borderRadius: '14px' }}>
            <Grid container direction='column'>
              <Grid container justifyContent='center'>
                <Typography variant='h5'>
                  Make A Team
                </Typography>
              </Grid>
              <Grid>
                <Divider />
              </Grid>
              <Grid container justifyContent='center'>
                <UserSelectionComponent handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} />
              </Grid>
            </Grid>
          </Paper>
        </Modal>

        <Grid xs={3} item borderLeft='1px solid #F4F4F4' borderRight='1px solid #FFFFFF' bgcolor='snow'>
          <Paper elevation={0} sx={{ position: 'relative', zIndex: 3, height: '100%', }} >
            <SwipeableViewComponent position={showProfile + 1}>
              <Grid container padding={3} flexDirection='column' height='100%' >
                <Grid container justifyContent='space-between' direction='row' position='relative' >
                  {/* <Grid position='absolute' right={0} bottom={'-410%'} zIndex={3}>
                    <Collapse in={showMenu}>
                      <Paper elevation={3} sx={{ padding: '10px' }}>
                        <MenuItem data-my-value={0} onClick={(e) => { setShowProfile(1); setShowMenu(false); setAnchorEl(null) }}>Profile</MenuItem>
                        <MenuItem data-my-value={1} onClick={handleClose}>My account</MenuItem>
                        <MenuItem data-my-value={2} onClick={handleClose}>Make A Team</MenuItem>
                        <MenuItem data-my-value={3} onClick={handleClose}>Logout</MenuItem>
                      </Paper>
                    </Collapse>
                  </Grid> */}
                  <Grid display='flex' flexDirection='row' >
                    {user?._id == undefined && <CircularProgress />}
                    {user?._id && <UserItem userId={user?._id as string} />}
                    <Box width='20px' />
                    <Typography variant='h4'>
                      Chats
                    </Typography>
                  </Grid>
                  <IconButton id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <MoreVertIcon htmlColor='black' />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem data-my-value={0} onClick={(e) => { setShowProfile(1); setShowMenu(false); setAnchorEl(null) }}>Profile</MenuItem>
                    <MenuItem data-my-value={1} onClick={handleClose}>My account</MenuItem>
                    <MenuItem data-my-value={2} onClick={handleClose}>Make A Team</MenuItem>
                    <MenuItem data-my-value={3} onClick={handleClose}>Logout</MenuItem>
                  </Menu>
                </Grid>

                <Grid container display='block' justifyContent='start' flexDirection='column' flexGrow={1} overflow='clip'>
                  <Grid container display='block'>
                    <Tabs variant='fullWidth' sx={{ width: '100%' }} value={tabState} onChange={(event: React.SyntheticEvent, newValue: number) => { setTabState(newValue); if (pageState == 0) { setPageState(1); } else { setPageState(0) } }} aria-label="basic tabs example">
                      <Tab label="Chats" />
                      <Tab label="Search Users" />
                    </Tabs>
                  </Grid>
                  <Grid width="100%" height='100%' container display='block'>
                    <SwipeableViewComponent position={tabState + 1}>
                      <div style={{ padding: '5px' }}>
                        <UserChatList />
                      </div>
                      <div style={{ padding: '5px' }}>
                        <FormControl sx={{ width: '100%', backgroundColor: theme.palette.grey[200], borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderRadius: '4px', marginTop: '14px' }} variant="standard">
                          <Input
                            sx={{ padding: '10px' }}
                            id="input-with-icon-adornment"
                            startAdornment={
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                        {isLoading == true && <CircularProgress />}
                        {isLoading == false && isSuccess == true &&
                          // Search User List
                          <Grid textOverflow='ellipsis'>{usersList?.map((item: User) => {
                            if (item._id != user?._id) {
                              return <Paper elevation={2} sx={{ marginTop: '14px' }} key={item._id as any}
                                onClick={() => {
                                  // var user: User = {
                                  //   _id: item._id,
                                  //   email: item.email,
                                  //   name: item.name,
                                  //   friends: null,
                                  //   profilePic: item.profilePic
                                  // }
                                  // dispatch(actions.slice1.setSelectedUser(user))
                                  if (user != null) {
                                    var team_name = ''
                                    if (item._id > user._id) {
                                      team_name = user._id + '_' + item._id;
                                    } else {
                                      team_name = item._id + '_' + user._id;
                                    }
                                    const res = userChatList.filter((chatItem: ChatItem) => {
                                      if (chatItem.team_name == team_name) {
                                        return chatItem
                                      }
                                    })
                                    if (res.length == 0) {
                                      addDuoChat({ userId: item._id }).unwrap().then((res) => {
                                        // Emit Socket event for duo chat added.
                                        // console.log("Res from add duo chat: ", res)
                                        socket.emit("duoAdded", res.chat)
                                      })
                                    }
                                  }
                                  // addDuoChat(item._id);
                                }}
                              >
                                <MenuItem sx={{ padding: '10px' }}>
                                  <Grid container direction='column'>
                                    <Typography variant='subtitle1'>{item.name}</Typography>
                                    <Typography variant='subtitle2'>{item.email}</Typography>
                                  </Grid>
                                </MenuItem>
                              </Paper>
                            }

                          })}</Grid>
                        }
                      </div>
                    </SwipeableViewComponent>
                  </Grid>

                </Grid>
              </Grid>
              <Grid>
                <h1>Hello There</h1>
              </Grid>
            </SwipeableViewComponent>
          </Paper>
        </Grid>
        <Grid display='flex' position='relative' zIndex={2} height='100vh' flexDirection='column' xs={9} item>
          <Outlet />

          {

            (chatId === undefined) &&
            <React.Fragment>
              <Grid height='100vh' justifyContent='center' alignItems='center' bgcolor='aliceblue'>
                <h1>No User or chat id</h1>
              </Grid>
            </React.Fragment>
          }
        </Grid>
      </Grid>
    </main>
  )
}

export default TeamsPage