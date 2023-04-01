import { Card, Grid, IconButton, LinearProgress, Typography, useTheme } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import React, { useEffect, useState } from 'react'
import { defaultStyles, FileIcon } from 'react-file-icon';
import { FileItemType } from '../store/types';
import CloseIcon from '@mui/icons-material/Close';
import axios, { AxiosProgressEvent } from 'axios';
import { server_url } from '../constants';
import { useRequestDeleteFileMutation } from '../store/RTKQuery';
import { useSocketContext } from '../store/SocketContext';

interface FileItemProps {
    fileItem: FileItemType,
    index: number,
    removeFile: (index: number) => void,
    setFileId: (index: number, fileId: string) => void
}

const FileItem = ({ fileItem, index, removeFile, setFileId }: FileItemProps): JSX.Element => {
    const theme = useTheme()
    const [progress, setProgress] = useState<number>(0);
    // var extension: Record<DefaultExtensionType, Partial<FileIconProps>> = fileItem.name.split(".").at(-1)
    var extension: string = fileItem.name.split(".").at(-1) as string
    var styles = JSON.parse(JSON.stringify(defaultStyles))
    var style = styles[extension];
    const {getSocket} = useSocketContext();
    const socket = getSocket();
    var isListenerSet = false;
    const [requestDeleteFileApi, resposeRequestDeleteFile] = useRequestDeleteFileMutation();
    const [fileId, setFileIdState] = useState<string | null>(null) //Just for debugging purposes.
    const [uploadStatus, setUploadStatus] = useState<'idle'| 'uploading' | 'uploaded'|null>('idle')
    useEffect(() => {
        if(!fileItem.fileId){
            uploadFile(fileItem)
        }
        
    }, [fileItem])

    useEffect(()=>{
        if(fileId && isListenerSet==false){
            console.log("Emitting event.")
            socket.emit("upload_s3",{fileId: fileId})
            socket.on(fileId, (data: any)=> {
                var percentage = data.percentage - 50
                setProgress(50 + percentage)
                console.log("Progress: ",50 + percentage)
            })
            isListenerSet = true;
        }
    },[fileId])
    const requestDeleteFile = (fileItem: FileItemType) => {
        if(fileItem.fileId){
            requestDeleteFileApi({fileId: fileItem.fileId})
        }
    }
    const uploadFile = (fileItem: FileItemType) => {
        var formData = new FormData();
        formData.append("file", fileItem.file)
        setUploadStatus('uploading')
        
        axios.post(server_url + '/fileUpload', formData, {
            headers: {
                "Content-Type": fileItem.file.type,
            }, onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                // console.log("Progress: ", progressEvent.progress)
                var loaded = progressEvent.progress;
                if (loaded) {
                    var percentage = (loaded * 50) 
                    console.log("Progress: ",percentage)
                    setProgress(percentage)
                }
            }
        }).then((res) => {
            // setProgress(100)
            setUploadStatus('uploaded')
            setFileIdState(res.data.fileId) // Debugging purposes.
            setFileId(index,res.data.fileId)
        })

        // .then((res)=> {  
        //     if(res.data.fileId){
        //         setFileId(res.data.fileId)
        //     }
        // })
    }
    if (style.color == undefined && style.labelColor == undefined && style.glyphColor == undefined) {
        style.glyphColor = deepPurple[400]
        style.labelColor = deepPurple[400]
    }
    return <Grid display='flex' padding={1}>
        <Card style={{ width: '100%' }}>
            <Grid display='flex' justifyContent='space-between' bgcolor={theme.palette.grey[200]} width='100%' padding={1} flexDirection='row'>
                <Grid item display='flex'>
                    <Grid width='40px'>
                        <FileIcon extension={extension} {...style} />
                    </Grid>
                    <Grid marginX={2}>
                        <Typography variant='subtitle2'>{fileItem.name}</Typography>
                        {fileId && <Typography variant='caption'>{fileId}</Typography>}
                    </Grid>
                </Grid>
                <Grid item marginLeft={1}>
                    <IconButton size='small' onClick={() => {
                        removeFile(index)
                        requestDeleteFile(fileItem)
                    }}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </Grid>
            </Grid>
            <LinearProgress variant='determinate' color={uploadStatus == 'uploading'?'primary': 'success'} value={progress} />
        </Card>
    </Grid>
}

export default FileItem