import { io } from "socket.io-client";
import User from "../models/User.js";
import UserStatus from "../models/UserStatus.js";
import { logger } from "../logger/logger.js";
import path from 'path'
import fs from 'fs'
import { uploadToS3 } from "../aws/awsS3.js";
import * as url from 'url';
import { LocalFileData, constructFileFromLocalFileData } from "get-file-object-from-local-path";
// Use Redis https://www.youtube.com/watch?v=k0_DK4bzHiU
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const SocketController = async (io) => {
    io.on("connection", (socket) => {
        var userId, socketId;
        socket.on("user", async (data) => {
            userId = data._id
            socketId = socket.id
            console.info("---------------------------------------------")
            const userStatus = await UserStatus.findOne({ user_id: data._id })
            const user1 = await User.findOne({ _id: data._id })
            // console.info(user1.name, ' Connected')
            logger.info(user1.name + ' Connected');
            if (userStatus) {
                logger.info(user1.name + ' Updating Status online.')
                userStatus.online = true;
                userStatus.name = user1.name;
                userStatus.socket_id = socket.id
                userStatus.viewing_chat_id = undefined;
                logger.debug("Removing viewing chat id socket on user")
                await userStatus.save();
            } else {
                logger.debug("Removing viewing chat id socket on user")
                await UserStatus.create({ user_id: userId, socket_id: socket.id, user_name: user1.name, online: true, viewing_chat_id: undefined })
            }
            // client.set(userId, socket.id)
            // client.keys("*", (err, data) => {
            //     if (data != null) console.info("Redis List: ", data)
            // })
        })
        socket.on("closing", (data) => {
            console.info("Closing: ", data)
        })

        socket.on("set_view_chat", (data) => {
            logger.info("Socket Event: set_view_chat")
            logger.info("Data: ", data)
        })
        socket.on("remove_view_chat", (data) => {
            logger.info("Socket Event: remove_view_chat")
            logger.info("Data: ", data)
        })

        socket.on("clear", async (data) => {
            // client.keys("*", (err, data) => {
            //     if (data != null) {
            //         data.forEach(item => {
            //             client.del(item)
            //         });
            //     }
            // })
            // client.keys("*", (err, data) => {
            //     if (data != null) console.info(data)
            // })
        })

        socket.on("send_message", (data) => {
            const { toChat } = data.message;
            io.to(toChat).emit("message_update", data)
        })

        socket.on("call_request", (data) => {
            logger.info("Call Request Socket: ", data)
            io.to(data.socketId).emit("call_request", data)
        })

        socket.on("accept_call", (data) => {
            logger.info("Call Accept Socket: ",data)
            io.to(data.callerSocketId).emit("accept_call",data)
        })

        socket.on("teamAdded", async (data) => {
            const users = await UserStatus.find({ user_id: { $in: data.participants } }).select({ socket_id: 1, user_id: 1 });
            users.map((item) => {
                if (item.socket_id !== undefined) {
                    io.to(item.socket_id).emit('chatUpdate', data);
                }
            })
            // data.participants.forEach((item) => {

            //     client.get(item, (err, data1) => {
            //         if (data1 != null) {
            //             // const chatItem = { teamName: data.teamName, urMessages: []}
            //             // io.to(data1).emit('chatUpdate', data)
            //             // socket.sockets.in(data1).emit('teamAddEvent',data1)
            //             // io.sockets.in(data1).emit('teamAddEvent',data1)
            //             // socket.to(data1).emit('teamAddEvent',data1)
            //         }
            //     })
            //     io.sockets.in(item).emit('teamAddEvent',data)
            // })
        })

        socket.on("duoAdded", async (data) => {
            const users = await UserStatus.find({ user_id: { $in: data.participants } }).select({ socket_id: 1, user_id: 1 });
            users.map((item) => {
                if (item.socket_id !== undefined) {
                    io.to(item.socket_id).emit('chatUpdate', data);
                }
            })
            // data.participants.forEach((item) => {
            //     client.get(item._id, (err, data1) => {
            //         if (data1 != null) {
            //             // const chatItem = { teamName: data.teamName, urMessages: []}
            //             io.to(data1).emit('chatUpdate', data)
            //             // socket.sockets.in(data1).emit('teamAddEvent',data1)
            //             // io.sockets.in(data1).emit('teamAddEvent',data1)
            //             // socket.to(data1).emit('teamAddEvent',data1)
            //         }
            //     })
            //     // io.sockets.in(item).emit('teamAddEvent',data)
            // })
        })

        socket.on("join_room", async (data) => {
            socket.join(data.roomId);
            // const userStatus = await UserStatus.findOne({ user_id: data.user });
            // if (userStatus) {
            //     userStatus.online = true;
            //     userStatus.viewing_chat_id = data.roomId;
            //     await userStatus.save();
            // } else {
            //     await UserStatus.create({ user_id: data.user, online: true, viewing_chat_id: data.roomId })
            // }
            // io.to(data).emit('update',{data: 'data from room'})
        })

        socket.on('upload_s3', async (data) => {
            console.log("Data from upload s3: ", data)
            // const file = JSON.parse(fs.readFileSync(path.join(__dirname,'..','uploads',data.fileId),{encoding: 'utf-8'}))

            const buffer = fs.readFileSync(__dirname + '/../uploads/' + data.fileId)
            const file = {
                fileId: data.fileId,
                buffer: buffer
            }
            // await uploadToS3(file,socket)
            // fs.unlinkSync(__dirname+'/../uploads/'+data.fileId)
            // await uploadToS3(data.fileId,socket)
        })

        socket.on("leave_room", async (data) => {
            socket.leave(data.roomId)
            const userStatus = await UserStatus.findOne({ user_id: data.user });
            if (userStatus && data.updateDbFlag == undefined) {
                logger.debug(data)
                userStatus.viewing_chat_id = undefined;
                logger.debug("Removing viewing chat id socket on leave_room")
                await userStatus.save();
            }
            // else {
            //     await UserStatus.create({ user_id: data.user, online: true, viewing_chat_id: undefined })
            // }
        })

        socket.on("setPeerId", async (data) => {
            logger.info("Socket Event: //setPeerId")
            logger.info("Data: ", data)
            const userStatus = await UserStatus.findOne({ user_id: data.user })
            userStatus.peer_id = data.peerId
            await userStatus.save();
            logger.debug("User Peer Id Updated: ", userStatus)
        })

        socket.on("disconnect1", async (data) => {
            console.info("-------------------------------------")
            console.log("Disconnect 1 called.")
            console.log("Data: ", data)
            console.info("-------------------------------------")

        })

        socket.on("disconnect", async (data) => {
            const userStatus = await UserStatus.findOne({ socket_id: socket.id })
            if (userStatus) {
                userStatus.online = false;
                userStatus.viewing_chat_id = undefined;
                logger.debug("Removing viewing chat id socket on disconnect")
                userStatus.socket_id = undefined;
                await userStatus.save();
            }
            // const userStatus = await UserStatus.findOne({ user_id: userId });
            // const user = await User.findOne({ _id: userId })
            // if(user){

            //     console.info(user.name + " disconnected")
            // }
            // if (userStatus) {
            //     userStatus.online = false;
            //     userStatus.viewing_chat_id = undefined;
            //     userStatus.socket_id = undefined;
            //     await userStatus.save();
            //     // console.info(user.name + " Saving status offline")
            //     console.info("-------------------------------------")
            // } else {
            //     await UserStatus.create({ user_id: userId, online: false, viewing_chat_id: undefined, socket_id: undefined })
            // }
            // client.exists(userId, (err, data) => {
            //     if (data == 1) {
            //         client.del(userId)
            //         client.keys("*", (err, data) => {
            //             if (data != null) console.info("Redis List: " + data)
            //         })
            //     }
            // })
        })
    })

}

export default SocketController;