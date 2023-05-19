import Express, { response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import http from 'http';
import cors from 'cors'
import { Server } from 'socket.io';
import SocketController from './controller/SocketController.js';
import mongoose from 'mongoose';
import stream from 'stream'
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
import fs, { readFileSync } from 'fs'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var fileId = randomBytes(16).toString('hex')
        cb(null, fileId);

    }
});

const upload = multer({ storage: storage })

// var upload = multer({ dest: '/uploads' })
dotenv.config({ path: './env/.env' });

// const client = redis.createClient({ legacyMode: true, url: 'redis://192.168.0.4:6379' })
// const client = redis.createClient({ legacyMode: true, url: 'redis://' + process.env.REDIS_URL + ':' + process.env.REDIS_PORT })

// await client.connect();

const app = Express();
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

app.use(cors({
    // origin: '*', 
    // methods: ["GET", "POST"],
    // origin: ['http://192.168.0.6:3000','http://192.168.0.3:3000','http://192.168.0.6:5000','http://localhost','http://192.168.56.1'], 
    origin: 'http://localhost:3000',
    // allowedHeaders: ['Content-Type', 'multipart/form-data', 'Content-disposition', 'x-metadata'],
    // exposedHeaders: ['Content-Type', 'multipart/form-data', 'Content-Disposition', 'x-metadata'], 
    // preflightContinue: true, 
    credentials: true
}))
// app.use(cors())
app.use(Express.json())
app.use(Express.urlencoded({
    extended: true,
})
);
// app.use(helmet())
app.use(cookieParser(process.env.SECRET_KEY));


app.use('/api/v1', router);

app.use('/api/v1', authRouter);


app.post('/fileUpload', upload.single('file'), async (req, res) => {
    logger.debug("ENDPOINT: /fileUpload")

    // logger.debug("Request: ",req)
    logger.debug("Request body: ", req.body)
    logger.debug("Request file: ", req.file)
    try {
        if (req.file != undefined) {
            var fileSize = req.file.size / Math.pow(10, 6)

            if (fileSize <= 15) {
                var fileId = randomBytes(16).toString('hex')
                // const uploadFile = readFileSync('./uploads/'+req.file.filename)
                // await uploadToS3(req.file,fileId)
                // fs.unlinkSync('./uploads/'+req.file.filename)
                const file = await File.create({ file_id: req.file.filename, original_name: req.file.originalname, mime_type: req.file.mimetype, size: req.file.size })
                res.status(200).json({ fileId: req.file.filename, file })
            } else {
                res.status(500).json({ error: "File exceeds size limit of 10MB." })
            }
        }
    } catch (error) {
        logger.error("File Upload error")
        logger.error(error)
    }

})
app.post('/fileDownload', authRouter, async (req, res) => {
    logger.info("/fileDownload Endpoint")
    logger.info("Request Body: ", req.body)
    // const data = await downloadFromS3(req.body.fileId)
    // const url = fs.readFileSync('./uploads/'+req.body.fileId,'utf8')
    const file = await File.findOne({ file_id: req.body.fileId })

    res.download('./uploads/' + file.file_id, file.original_name)
    // const data = fs.readFileSync('./uploads/'+file.file_id)
    // // logger.info(url.slice(0,30))
    // // res.json({file,buffer: url})
    // logger.info("Data: ",data)
    // var fileContents = Buffer.from(data.Body,'base64')
    // readStream.end(fileContents)
    // res.set({'Content-type': file.mime_type,'Content-disposition': 'attachment; filename=test.pdf'});

    // res.setHeader('Content-Disposition', 'attachment; filename=test.pdf')
    // res.set('Content-Disposition:', 'attachment; filename=' + file.original_name );
    // logger.info("File Contents: ",res)
    // readStream.pipe(res)
    // res.send(fileContents)
    // res.download(fileContents,file.original_name)
    // res.status(200).download(fileContents,file.original_name)
    // res.download('./uploads/'+req.body.fileId,file.original_name)
})
app.use(ErrorHandlerMiddleWare);

app.use('*', (req, res) => {
    res.send("<h1>Route Not Found.</h1>")
})

const server = http.createServer(app);

const socket = new Server(server, {
    cors: {
        // origin: "*",
        origin: 'http://localhost:3000',
        // origin: ['http://192.168.0.6:3000','http://192.168.0.3:3000','http://192.168.0.6:5000','http://localhost:3000'], 
        methods: ["GET", "POST", "PUT", "DELETE"],
        transports: ['websocket', 'polling'],
        credentials: true,
    },
    allowEIO3: true
})

SocketController(socket);

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, (err) => {
        if (err) {
            logger.error("Error: ")
            logger.debug(err)
        } else {
            logger.info('Connected to mongodb')
        }
    });
}
export const conn = mongoose.connection;
server.listen(process.env.PORT | 5000, async () => {
    logger.info('Server started listening at port ' + process.env.PORT + ' ...')
    logger.info('---------------------------------------------------------------------')
    logger.info('---------------------------------------------------------------------')
    logger.info('---------------------------------------------------------------------')
    logger.info('---------------------------------------------------------------------')
    logger.info('---------------------------------------------------------------------')
    await connectDB();
})