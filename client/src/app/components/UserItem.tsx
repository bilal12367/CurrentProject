import { Avatar, Box, Card, Collapse, Grid, Grow, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetUserByIdMutation } from "../store/RTKQuery";

interface UserItemProps {
    userId: String
}


export const UserItem = ({ userId }: UserItemProps): JSX.Element => {
    const [getUserById, getUserResp] = useGetUserByIdMutation();
    const [showDetails, setShowDetails] = useState<boolean>(false);
    var timeOutController: any;
    useEffect(() => {
        if (getUserResp.isUninitialized) {
            getUserById({ userId })
        }
    }, [])

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
                fontSize: '14px',
                fontWeight: 'bold',
                width: '34px',
                height: '34px'
            },
            children: `${name.split(' ')[0][0].toUpperCase()}`,
        };
    }

    const showDetailsFunc = () => {
        if (timeOutController) {
            clearTimeout(timeOutController)
        }
        setShowDetails(true);
    }
    const hideShowDetails = () => {
        timeOutController = setTimeout(() => {
            setShowDetails(false);
        }, 1000)
    }
    return <Grid position='relative' alignItems='center' onMouseLeave={() => { hideShowDetails() }} onMouseEnter={() => { showDetailsFunc() }}>
        {getUserResp.isLoading == false && getUserResp.isSuccess == true &&
            <Avatar  {...stringAvatar(getUserResp.data.name)} />
        }
        <Grid>
            <Grid sx={{ position: 'absolute', width: '240px', paddingTop: '8px', zIndex: '3', display: (showDetails == true ? 'block' : 'none') }}  >
                <Collapse in={showDetails} >
                    <Paper sx={{ borderRadius: '0px', padding: '8px' }}>
                        <Box bgcolor='white' height='14px' width='14px' position='absolute' sx={{ transform: 'rotate(45deg)' }} marginTop="-14px" marginLeft='5px' />
                        <div>Tooltip</div>
                        <div>Tooltip</div>
                        <div>Tooltip</div>
                        <div>Tooltip</div>
                        <div>Tooltip</div>
                        <div>Tooltip</div>
                    </Paper>
                </Collapse>
            </Grid>
        </Grid>
    </Grid>
}

