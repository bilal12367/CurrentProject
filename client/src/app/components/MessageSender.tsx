import { Collapse, Grid, IconButton, LinearProgress, OutlinedInput, Paper, Typography } from '@mui/material'
import React, { ChangeEvent, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/system'
import { useSendMessageMutation } from '../store/RTKQuery';
import { useAppSelector } from '../store';
import { useEffect } from 'react'
import { DefaultExtensionType, defaultStyles, FileIcon, FileIconProps } from 'react-file-icon'
import { useSocketContext } from '../store/SocketContext';
import axios, { AxiosProgressEvent } from 'axios';
import { server_url } from '../constants';
import { ReadFileList } from '../utils/File_Reader';
import Card from '@mui/material/Card';
import { deepPurple, grey } from '@mui/material/colors';
import { FileItemType } from '../store/types';
import FileItem from './FileItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
const MessageSender = () => {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const { getSocket } = useSocketContext();

    const [files, setFiles] = useState<FileItemType[]>([])
    const [error, setError] = useState<string | null>(null);
    const socket = getSocket();
    const theme = useTheme()
    const [sendMessageReq, sendMessageResp] = useSendMessageMutation();
    const { selectedChat } = useAppSelector((state) => state.slice)
    const [message, setMessage] = useState('')
    useEffect(() => {
        if (sendMessageResp.isLoading == false && sendMessageResp.isSuccess == true && sendMessageResp.status == 'fulfilled') {
            
            socket.emit("send_message", { message: sendMessageResp.data.message })
        }
    }, [sendMessageResp])

    // Just simple use effect to make the message disappear after few seconds.
    useEffect(() => {
        if (error != null) {
            setTimeout(() => {
                setError(null)
            }, 3000)
        }
    }, [error])

    // Uploads the messageInput state.
    const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setMessage(value);
    }

    // Checks if all held files are uploaded by checking fileId.
    const areAllFilesUploaded = () => {
        var flag = true;
        for (var file of files) {
            if (file.fileId == undefined) {
                flag = false;
            }
        }
        return flag;
    }

    // Sends the message.
    const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (files.length == 0 || areAllFilesUploaded()) { // Checks if files list is empty or all the files uploaded or not.
            if (message != '') {
                var tempFiles: any[] = []
                for(var file of files){
                    // var temp = {
                    //     original_name: file.name,
                    //     mime_type: file.type,
                    //     file_id: file.fileId,
                    //     size: file.size
                    // }
                    tempFiles.push(file.fileId)
                }
                sendMessageReq({ chatId: selectedChat?._id, message, files: tempFiles })
                // socket.to(selectedChat?.chat_id).emit({ chatId: selectedChat?._id, message, files: [] })
                // socket.emit("send_message",{chatId: selectedChat?.chat_id, message,files: []})
                setMessage('')
                setFiles([])
            }
        }
    }

    // Sets the error message.
    const setErrorMessage = (error: string) => {
        setError(error)
    }

    // Triggers when you select files from file picker.
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        var fileObjList: any[] = []
        if (e.target.files) {
            // uploadFile(e.target.files[0])
            ReadFileList(e.target.files, setFiles, setErrorMessage)
        }
    }

    // Triggers after the file is uploaded.
    const setFileId = (index: number, fileId: string) => {
        var tempFiles = files
        var fileItem = tempFiles[index]
        fileItem.fileId = fileId
        tempFiles[index] = fileItem
        setFiles(tempFiles)
    }

    // Removes file from list when the remove button is pressed
    const removeFileFromList = (key: number) => {
        var tempFiles = [...files];
        var temp = tempFiles.splice(key, 1);
        setFiles(tempFiles);
    }

    return (
        <React.Fragment>

            <Paper elevation={3}>
                <Collapse in={error != null}><Alert severity='error'>{error}</Alert></Collapse>
                <Collapse in={files.length != 0}  >
                    <Grid container display='flex' flexDirection='row' padding={1} justifyContent='start'>

                        {Object.values(files).map((fileItem: FileItemType, index) => {
                            return <FileItem fileItem={fileItem} key={index} index={index} setFileId={setFileId} removeFile={removeFileFromList} />
                        }
                        )}
                    </Grid>
                </Collapse>
                <form onSubmit={sendMessage}>
                    <Grid display='flex' flexDirection='row' alignItems='center' paddingY={1.5} paddingX={1} position='relative' zIndex={2} bgcolor='white' >
                        <Grid item>
                            <IconButton size='large' onClick={() => { if (fileRef.current != null) { fileRef.current.click(); fileRef.current.value = ""; } }}>
                                <input type='file' name="file" multiple={true} style={{ display: 'none' }} onChange={handleFileChange} ref={fileRef} />
                                <AttachFileIcon sx={{ transform: 'rotate(45deg)' }} />
                            </IconButton>
                        </Grid>
                        <Grid item flexGrow='1' paddingX={2} paddingY={0.4}>
                            <OutlinedInput value={message} onChange={handleMessageInput} sx={{ backgroundColor: theme.palette.grey[200], borderRadius: '205px' }} fullWidth={true} />
                        </Grid>
                        <Grid item>
                            <IconButton type='submit' sx={{ backgroundColor: deepPurple[400], padding: '14px', borderRadius: '20px' }} disabled={!(files.length == 0 || areAllFilesUploaded())}>
                                <SendIcon fontSize='medium' style={{ color: 'white' }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

        </React.Fragment>
    )
}

export default MessageSender