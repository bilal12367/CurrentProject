import AWS from 'aws-sdk'
import { logger } from '../logger/logger.js'

export const getAWSS3 = () => {
    const awsConfig = {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }
    const S3 = new AWS.S3(awsConfig)
    return S3
}

export const uploadToS3 =async (file)=>{
    const S3 = getAWSS3()
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: file.fileId,
        Body: file.buffer
    }
    logger.info("File uploading: ",file.fileId)
    const resp = await S3.upload(params).on('httpUploadProgress',(e)=>{
        var percentage = Math.floor((e.loaded/e.total) * 100)
        
        logger.info("Percentage: ",percentage)
    }).promise();
    logger.info("File Uploaded: ",file.fileId)
    return resp;
    
}

export const deleteObjectS3 = async (fileId) => {
    const S3 = getAWSS3()
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileId
    }
    logger.info("File Deletion started.")
    const resp = await S3.deleteObject(params).promise();
    logger.info("File deleted successfully. ",fileId)
    return resp;
}