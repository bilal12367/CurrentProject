import Express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import http from 'http';
import cors from 'cors'
import { Server } from 'socket.io';
import SocketController from './controller/SocketController.js';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser"
import router from './Router/MainRouter.js';
import authRouter from './Router/AuthRouter.js'
import AuthMiddleware from './middleware/AuthMiddleware.js';
import AWS from 'aws-sdk'
import redis from 'redis'
import { ErrorHandlerMiddleWare } from './middleware/ErrorHandlerMiddleware.js';
import { logger } from './logger/logger.js';
import { randomUUID, randomBytes } from 'crypto';
import { downloadFromS3, uploadToS3 } from './aws/awsS3.js';
import File from './models/File.js';
import fs from 'fs'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var fileId = randomBytes(16).toString('hex')
        cb(null,  fileId);
  
    }
});

const upload = multer({storage: storage})

// var upload = multer({ dest: '/uploads' })
dotenv.config({path: './env/.env'});

// const client = redis.createClient({ legacyMode: true, url: 'redis://192.168.0.4:6379' })
// const client = redis.createClient({ legacyMode: true, url: 'redis://' + process.env.REDIS_URL + ':' + process.env.REDIS_PORT })

// await client.connect();

const app = Express();

app.use(cors({
    origin: 'http://localhost:3000', 
    // origin: 'http://localhost:3000', 
    // allowedHeaders: ['Content-Type', 'multipart/form-data', 'authorization', 'x-metadata', 'x-to'],
    // exposedHeaders: ['Content-Type', 'multipart/form-data', 'content-disposition', 'x-metadata'], 
    // preflightContinue: true, 
    credentials: true
}))
app.use(Express.json())
app.use(Express.urlencoded({
    extended: true,
    })
   );
// app.use(helmet())
app.use(cookieParser(process.env.SECRET_KEY));


app.use('/api/v1', router);

app.use('/api/v1', authRouter);


app.post('/fileUpload', upload.single('file'),async (req, res) => {
    logger.debug("ENDPOINT: /fileUpload")

    // logger.debug("Request: ",req)
    logger.debug("Request body: ", req.body)
    logger.debug("Request file: ", req.file)
    logger.debug("Request file: ", req.files)
    try {
        if (req.file != undefined) {
            var fileSize = req.file.size / Math.pow(10, 6)
    
            if (fileSize <= 15) {
                var fileId = randomBytes(16).toString('hex')
                req.file.fileId = fileId
                // await uploadToS3(req.file)
                // fs.unlinkSync('./uploads/'+req.file.filename)
                const file = await File.create({file_id: req.file.filename,original_name: req.file.originalname, mime_type: req.file.mimetype, size: req.file.size})
                res.status(200).json({ fileId: req.file.filename, file })
            } else {
                res.status(500).json({ error: "File exceeds size limit of 10MB." })
            }
        }    
    } catch (error) {
        console.log("File Upload error")
        console.log(error)
    }
    
})
app.post('/fileDownload', authRouter ,async(req,res)=> {
    console.log("FileDownloadAPI")
    console.log('req.body', req.body)
    const data = await downloadFromS3(req.body.fileId)
    res.json({data})
})
app.use(ErrorHandlerMiddleWare);

app.use('*', (req, res) => {
    res.send("<h1>Route Not Found.</h1>")
})

const server = http.createServer(app);

const socket = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT","DELETE"],
        transports: ['websocket', 'polling'],
        credentials: true,
    },
    allowEIO3: true
})

SocketController(socket);

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, (err) => {
        if (err) {
            console.log("Error: ")
            console.log(err)
        } else {
            console.log('Connected to mongodb')
        }
    });
}
export const conn = mongoose.connection;
server.listen(process.env.PORT | 5000, async () => {
    console.log('Server started listening at port ' + process.env.PORT + ' ...')
    console.log('---------------------------------------------------------------------')
    console.log('---------------------------------------------------------------------')
    console.log('---------------------------------------------------------------------')
    console.log('---------------------------------------------------------------------')
    console.log('---------------------------------------------------------------------')
    await connectDB();
})