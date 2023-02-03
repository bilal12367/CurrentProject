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
import redis from 'redis'
import { ErrorHandlerMiddleWare } from './middleware/ErrorHandlerMiddleware.js';

const upload = multer({})

dotenv.config();

// const client = redis.createClient({ legacyMode: true, url: 'redis://192.168.0.4:6379' })
const client = redis.createClient({ legacyMode: true, url: 'redis://'+process.env.SERVER_URL+':6379' })

await client.connect();

const app = Express();

app.use(Express.json())

// app.use(helmet())
app.use(cookieParser(process.env.SECRET_KEY));

app.use(cors({ origin: 'http://localhost:3000', preflightContinue: true, credentials: true }))

app.use('/api/v1', router);

app.use('/api/v1', authRouter);


app.use('/fileUpload', upload.array('files', 5), (req, res) => {
    res.send("Files Uploaded");
})

app.use(ErrorHandlerMiddleWare);

app.use('*', (req, res) => {
    res.send("<h1>Route Not Found.</h1>")
})

const server = http.createServer(app);

const socket = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true,
    },
    allowEIO3: true
})

SocketController(socket, client);

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

    await connectDB();
})