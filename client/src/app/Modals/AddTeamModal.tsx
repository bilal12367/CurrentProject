import React, { ChangeEventHandler, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { deepPurple } from '@mui/material/colors'
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import { useAppSelector } from '../store';
import { Button, Chip, CircularProgress, FormControl, Grid, Input, InputAdornment, InputLabel, Typography, useTheme } from '@mui/material';
import { useAddTeamMutation } from '../store/RTKQuery';
import ErrorBox from '../wrappers/ErrorBox';
import SuccessBox from '../wrappers/SuccessBox';
import { useSocketContext } from '../store/SocketContext';

import Groups from '@mui/icons-material/Groups';
import SwipeableViewComponent from '../components/SwipeableViewComponent';

interface PropType {
    handleOpenModal: () => void,
    handleCloseModal: () => void
}

const UserSelectionComponent = ({ handleOpenModal, handleCloseModal }: PropType) => {
    const theme = useTheme();
    const { getSocket } = useSocketContext();
    const [errorState, setErrorState] = useState({ error: false, message: '' })
    var socket = getSocket();
    const [pageState, setPageState] = useState(0);
    const [teamName, setTeamName] = useState('');
    const { usersList, user } = useAppSelector((state) => state.slice)
    const [checked, setChecked] = React.useState<string[]>([]);
    const [input1State, setInput1State] = React.useState<string>('');
    const [addNewTeam, responseAddNewTeam] = useAddTeamMutation();
    useEffect(() => {
        if (responseAddNewTeam.isSuccess) {
            // handleCloseModal();
        }
    }, [responseAddNewTeam])

    const handleTeamNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.currentTarget.value)
    }

    const handleSearchUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput1State(event.currentTarget.value)
    }

    const handleAddTeam = () => {
        if (checked.length >= 2 && teamName != '') {
            addNewTeam({ teamName: teamName, participants: [...checked, user?._id], admin: user?._id }).unwrap().then((res) => {
                socket.emit("teamAdded", res.chat)
                handleCloseModal();
            })
            setErrorState({ error: false, message: '' })
        } else {
            setErrorState({ error: true, message: 'Please select two or more users.' })
        }
    }

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const handleIndexChange = (index: any) => {
        setPageState(index)
        // console.log('indexLatest', indexLatest)
    }

    const handleChipDelete = (userItem: any) => {
        var list = checked;
        var updatedList = list.filter((item) => {
            if (item === userItem._id) {
                return undefined
            } else {
                return item
            }
        })
        setChecked(updatedList);
    }
    return (
        <React.Fragment>
            {/* <SwipeableViews style={{ width: '100%', padding: '0px' }} onChangeIndex={handleIndexChange} index={pageState} animateTransitions={true} enableMouseEvents={true}> */}
            <Grid style={{ width: '100%', height: '400px' }}>
                <SwipeableViewComponent position={pageState+1}>

                    <Grid container width='100%' height='100%' direction='column' justifyContent='space-between'>
                        <Grid>
                            <Grid container paddingX={2}>
                                <FormControl sx={{ width: '100%', backgroundColor: theme.palette.grey[200], borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderRadius: '4px', marginTop: '14px' }} variant="standard">
                                    <Input
                                        sx={{ padding: '10px' }}
                                        id="input-with-icon-adornment"
                                        onChange={handleSearchUserChange}
                                        value={input1State}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>

                            <List disablePadding className='sc1' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0px', margin: '0px', maxHeight: '400px', overflowY: 'scroll', bgcolor: 'background.paper' }}>
                                {Object.values(usersList).map((userItem) => {
                                    const value: string = userItem._id as string
                                    if (user?._id != value) {
                                        return (
                                            <ListItem
                                                onClick={handleToggle(value)}
                                                key={value}
                                                secondaryAction={
                                                    <Checkbox
                                                        edge="end"
                                                        // onChange={handleToggle(value)}
                                                        checked={checked.indexOf(value) !== -1}
                                                        inputProps={{ 'aria-labelledby': value }}
                                                    />
                                                }
                                                disablePadding
                                            >
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: deepPurple[400] }}>
                                                            {userItem?.name[0]}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText id={value} primary={userItem.name} />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    }
                                })}
                                {responseAddNewTeam.isError && <ErrorBox text={'Something went wrong.' + (responseAddNewTeam as any).error.data.message} />}

                                {errorState.error == true && <ErrorBox text={errorState.message} />}
                            </List>
                        </Grid>
                        <Grid container direction='row' justifyContent='space-between' marginTop={1}>
                            <Grid item>
                                <Button variant='text' onClick={handleCloseModal}>Cancel</Button>
                            </Grid>
                            <Grid item>
                                {responseAddNewTeam.isLoading ? <Grid paddingX={5}>
                                    <CircularProgress size={30} />
                                </Grid> : <Button variant='contained' onClick={() => { setPageState(1) }}>Next</Button>}

                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container paddingX={2} direction='column' justifyContent='space-between' height='100%'>
                        <Grid container direction='column'>
                            <FormControl aria-label='Team Name' sx={{ width: '100%', backgroundColor: theme.palette.grey[200], borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderRadius: '4px', marginTop: '14px' }} variant="standard">
                                <InputLabel htmlFor="input-with-icon-adornment" sx={{ margin: '5px 10px' }}>
                                    Add Team Name
                                </InputLabel>
                                <Input
                                    sx={{ padding: '10px', marginTop: '4px !important' }}
                                    id="input-with-icon-adornment"
                                    onChange={handleTeamNameChange}
                                    value={teamName}
                                    startAdornment={
                                        <InputAdornment aria-label='Team Name' position="start">
                                            <Groups />
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            <Grid container direction='row' marginTop={2}>
                                {checked.length != 0 && Object.values(checked).map((item) => {
                                    var userItem = usersList.filter((user1) => {
                                        if (user1._id === item) {
                                            return user1;
                                        }
                                    })[0]
                                    return (
                                        <Chip sx={{ marginRight: '10px' }} color='primary' label={userItem.name} variant="filled" onDelete={() => { handleChipDelete(userItem) }} />
                                    )
                                })}
                            </Grid>
                        </Grid>
                        <Grid container direction='row' justifyContent='space-between'>
                            <Button variant='text' onClick={() => { setPageState(0) }}>{'Select Users'}</Button>
                            <Button variant='contained' disabled={(checked.length >= 2 && teamName != '') ? false : true} onClick={handleAddTeam}>{'Add Team'}</Button>
                        </Grid>
                    </Grid>
                </SwipeableViewComponent>
            </Grid>
        </React.Fragment>
    );
}

export default UserSelectionComponent



{/* <SwipeableViews style={{ width: '100%', padding: '0px' }} onChangeIndex={handleIndexChange} index={pageState} animateTransitions={true}>
                <Grid container width='100%' direction='column'>
                    <Grid container paddingX={2}>
                        <FormControl sx={{ width: '100%', backgroundColor: theme.palette.grey[200], borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderRadius: '4px', marginTop: '14px' }} variant="standard">
                            <Input
                                sx={{ padding: '10px' }}
                                id="input-with-icon-adornment"
                                onChange={handleSearchUserChange}
                                value={input1State}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>

                    <List disablePadding className='sc1' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0px', margin: '0px', maxHeight: '400px', overflowY: 'scroll', bgcolor: 'background.paper' }}>
                        {Object.values(usersList).map((userItem) => {
                            const value: string = userItem._id as string
                            if (user?._id != value) {
                                return (
                                    <ListItem
                                        onClick={handleToggle(value)}
                                        key={value}
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                // onChange={handleToggle(value)}
                                                checked={checked.indexOf(value) !== -1}
                                                inputProps={{ 'aria-labelledby': value }}
                                            />
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: deepPurple[400] }}>
                                                    {userItem?.name[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText id={value} primary={userItem.name} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            } 
                        })}
                        {responseAddNewTeam.isError && <ErrorBox text={'Something went wrong.' + (responseAddNewTeam as any).error.data.message} />}
                        
                        {errorState.error == true && <ErrorBox text={errorState.message} />}
                    </List>
                    <Grid container direction='row' justifyContent='space-between' marginTop={1}>
                        <Grid item>
                            <Button variant='text' onClick={handleCloseModal}>Cancel</Button>
                        </Grid>
                        <Grid item>
                            {responseAddNewTeam.isLoading ? <Grid paddingX={5}>
                                <CircularProgress size={30} />
                            </Grid> : <Button variant='contained' onClick={() => { setPageState(1) }}>Next</Button>}

                        </Grid>
                    </Grid>
                </Grid>
                <Grid container paddingX={2} direction='column' justifyContent='space-between' height='100%'>
                    <Grid container direction='column'>
                        <FormControl aria-label='Team Name' sx={{ width: '100%', backgroundColor: theme.palette.grey[200], borderTopRightRadius: '4px', borderTopLeftRadius: '4px', borderRadius: '4px', marginTop: '14px' }} variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment" sx={{ margin: '5px 10px' }}>
                                Add Team Name
                            </InputLabel>
                            <Input
                                sx={{ padding: '10px', marginTop: '4px !important' }}
                                id="input-with-icon-adornment"
                                onChange={handleTeamNameChange}
                                value={teamName}
                                startAdornment={
                                    <InputAdornment aria-label='Team Name' position="start">
                                        <Groups />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <Grid container direction='row' marginTop={2}>
                            {checked.length != 0 && Object.values(checked).map((item) => {
                                var userItem = usersList.filter((user1) => {
                                    if (user1._id === item) {
                                        return user1;
                                    }
                                })[0]
                                return (
                                    <Chip sx={{ marginRight: '10px' }} color='primary' label={userItem.name} variant="filled" onDelete={() => { handleChipDelete(userItem) }} />
                                )
                            })}
                        </Grid>
                    </Grid>
                    <Grid container direction='row' justifyContent='space-between'>
                        <Button variant='text' onClick={() => { setPageState(0) }}>{'Select Users'}</Button>
                        <Button variant='contained' disabled={(checked.length >= 2 && teamName!= '') ? false: true} onClick={handleAddTeam}>{'Add Team'}</Button>
                    </Grid>
                </Grid>
            </SwipeableViews> */}