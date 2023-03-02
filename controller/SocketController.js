import { io } from "socket.io-client";
import User from "../models/User.js";
import UserStatus from "../models/UserStatus.js";
import { logger } from "../logger/logger.js";
// Use Redis https://www.youtube.com/watch?v=k0_DK4bzHiU
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
                await userStatus.save();
                console.info("---------------------------------------------")
            } else {
                logger.info('Creating userstatus for: ', user1.name)
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

        socket.on("teamAdded", async (data) => {
            const users = await UserStatus.find({ user_id: { $in: data.participants } }).select({ socket_id: 1, user_id: 1 });
            users.map((item)=>{
                if(item.socket_id !== undefined){
                    io.to(item.socket_id).emit('chatUpdate',data);
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

        socket.on("duoAdded",async (data) => {
            const users = await UserStatus.find({ user_id: { $in: data.participants } }).select({ socket_id: 1, user_id: 1 });
            users.map((item)=>{
                if(item.socket_id !== undefined){
                    io.to(item.socket_id).emit('chatUpdate',data);
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

        socket.on("leave_room", async (data) => {
            socket.leave(data.roomId)
            const userStatus = await UserStatus.findOne({ user_id: data.user });
            if (userStatus) {
                userStatus.viewing_chat_id = undefined;
                await userStatus.save();
            } 
            // else {
            //     await UserStatus.create({ user_id: data.user, online: true, viewing_chat_id: undefined })
            // }
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