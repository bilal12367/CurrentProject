import { Collapse, Grid, ListItem, ListItemButton, ListItemIcon, ToggleButton, Typography, useTheme } from '@mui/material'
import React, { useEffect, Dispatch, SetStateAction } from 'react'
import GroupsIcon from '@mui/icons-material/Groups'
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';

interface propTypes {
    icon: React.ReactElement;
    showText: boolean;
    title: string;
    handleAlignment: (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => void;
    alignment: string | null;
}

const MenuItem = ({ icon, showText, title, handleAlignment, alignment }: propTypes) => {
    const theme = useTheme();
    var selected: boolean = false;
    var borderLeft: boolean = false;
    const navigate = useNavigate();
    if (alignment == title) {
        selected = true;
        borderLeft = true;
    }
    useEffect(() => {
        if (alignment == title) {
            console.log("Navigating to dashboard+title from menu item")
            navigate('/dashboard/' + title)
        }

        return () => {

        }
    }, [])
    return (
        <ToggleButton value='Teams' onClick={(event) => {
            if (alignment == title) {
                handleAlignment(event, null)
            } else {
                handleAlignment(event, title)
            }
        }} sx={{ width: '100%', padding: '20px 0px', borderLeft: borderLeft == true ? '3px solid ' + theme.palette.primary.main: '', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px',borderRadius:'0px' }} aria-label='Teams'>
            <Grid container direction='row' display='flex'>
                <ListItem disablePadding>
                    {/* <ListItemButton sx={{ padding: '20px 0px' }}> */}
                    <ListItemIcon sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Grid container direction='column' alignItems='center' justifyContent='center'>
                            <Grid item container justifyContent='center'>
                                {/* <GroupsIcon fontSize='large' className='smoothTs' color="primary" /> */}
                                {/* {React.cloneElement(icon, { color: (selected == true ? 'primary' : '') , fontSize:'large', className:'smoothTs' })} */}
                                <icon.type color={selected == true ? 'primary' : 'disabled'} fontSize='large' className='smoothTs' />
                            </Grid>
                            {/* {navState.showText == true && <p></p>} */}
                            <Grid item >
                                <Collapse orientation='vertical' in={showText}>
                                    <Typography variant='caption' fontWeight='bold' color={selected == true ? 'primary' : 'disabled'}>
                                        {title}
                                    </Typography>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </ListItemIcon>
                    {/* </ListItemButton> */}
                </ListItem>
            </Grid>
        </ToggleButton>
    )
}

export default MenuItem