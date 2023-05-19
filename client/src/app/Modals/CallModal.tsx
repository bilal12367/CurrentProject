import { Dialog, Divider, Grid, IconButton } from '@mui/material'
import React, { Dispatch } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
interface CallModalProps {
    open: boolean,
    openModal: Dispatch<boolean>
}

const CallModal = ({ open, openModal }: CallModalProps) => {
    const handleClose = () => {
        openModal(false);
    }
    return (
        <React.Fragment>
            <Dialog fullScreen open={open} onClose={handleClose}>
                <Grid width='100%' display='flex' flexDirection='row' padding='10px'>
                    <Grid>
                        <IconButton sx={{borderRadius:'0px',padding:'0px'}} onClick={handleClose}>
                            <CloseRoundedIcon sx={{border:'1px solid #e6e9ed',padding:'10px',borderRadius:'6px'}} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Divider/>
                <h1>This is call modal.</h1>
            </Dialog>
        </React.Fragment>
    )
}

export default CallModal