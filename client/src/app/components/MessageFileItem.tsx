import { Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Modal, Paper, Skeleton, SkeletonClasses, SkeletonProps, SkeletonTypeMap, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { deepPurple } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { defaultStyles, FileIcon } from "react-file-icon";
import { useGetFileByIdMutation } from "../store/RTKQuery";
import { formatSizeUnits } from "../utils/utils";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
// import FileViewer from 'react-file-viewer'
interface MessageFileItemProps {
    fileId: string
}

export const MessageFileItem = ({ fileId }: MessageFileItemProps): JSX.Element => {
    const [getFileById, getFileResp] = useGetFileByIdMutation()
    const [openModal, setOpenModal] = useState<boolean>(false)
    var anim: false | "pulse" | "wave" | undefined = "wave"
    useEffect(() => {
        getFileById({ fileId })
    }, [])
    if (getFileResp.isSuccess) {
        // console.log("File Response:")
        // console.log(getFileResp.data)
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDownload = () => {
        setAnchorEl(null);
        
    }
    const toggleModal = () => {
        if (openModal) {
            setOpenModal(false)
        } else {
            setOpenModal(true)
        }
    }
    const handleOpenFile = () => {
        toggleModal();
        handleClose()
    }
    const getParams = () => {

        var fileName = getFileResp.data.original_name
        var extension = fileName.split('.').at(-1) as string
        var styles = JSON.parse(JSON.stringify(defaultStyles))
        // console.log("Extension: ", extension)
        var style = styles[extension];
        if (style.color == undefined && style.labelColor == undefined && style.glyphColor == undefined) {
            style.glyphColor = deepPurple[400]
            style.labelColor = deepPurple[400]
        }
        style.extension = extension
        return style
    }

    if (getFileResp.isLoading == false && getFileResp.isSuccess == true) {
        var file = getFileResp.data

        return <Paper sx={{ marginTop: '10px' }}>
            <Modal open={openModal} onClose={handleClose} >
                <Paper>
                    <Grid display='flex' flexDirection='column'>
                        <Grid display='flex' padding={2} flexDirection='row' justifyContent='space-between'>
                            <Grid>
                                <Typography variant="h4">File Name</Typography>
                            </Grid>
                            <IconButton onClick={toggleModal}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                        <Grid>
                            
                        </Grid>
                    </Grid>
                </Paper>
            </Modal>
            <Grid display='flex' justifyContent='space-between' flexDirection='row' padding={1}>
                <Grid flexDirection='row' display='flex'>
                    <Grid width='40px'>
                        <FileIcon  {...getParams()} />
                    </Grid>
                    <Grid paddingX={2} >
                        <Typography variant="subtitle2" fontWeight='bold'>{file.original_name}</Typography>
                        <Typography variant='caption'>{formatSizeUnits(file.size)}</Typography>
                    </Grid>
                </Grid>
                <Grid>
                    <IconButton id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        onClick={handleClick}>
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        sx={{ padding: '0px !important' }}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                paddingTop: '0px',
                                paddingBottom: '0px'
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            sx: { py: 0 }
                        }}
                    >
                        <Grid width='200px' >
                            <MenuItem onClick={handleOpenFile}>
                                <ListItemIcon>
                                    <FileOpenIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Open</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleDownload}>
                                <ListItemIcon>
                                    <DownloadIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Download</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <ShareIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Share</ListItemText>
                            </MenuItem>

                        </Grid>
                    </Menu>
                </Grid>
            </Grid>
        </Paper>
    } else {
        return <Paper sx={{ marginTop: '10px' }}>
            <Grid display='flex' flexDirection='row' padding={1}>
                <Grid>
                    <Skeleton height='40px' animation={anim} width='40px' variant="rounded" />
                </Grid>
                <Grid paddingX={1}>
                    <Skeleton height='15px' animation={anim} width='140px' />
                    <Skeleton height='10px' width='70px' />
                </Grid>
            </Grid>
        </Paper>
    }
}