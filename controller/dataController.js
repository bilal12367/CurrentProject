import User from "../models/User.js"
import { v4 as uuidv4 } from 'uuid'
import mongoose from "mongoose"
import Chat from '../models/Chat.js'
import { conn } from '../server.js'
import UserChatList from "../models/UserChatList.js"
import Message from "../models/Message.js"
import UserStatus from "../models/UserStatus.js"
import logBox from "log-box"
import { logger } from "../logger/logger.js"
import fs from 'fs'
import * as url from 'url';
import { deleteObjectS3 } from "../aws/awsS3.js"
import File from "../models/File.js"
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const testData = async (req, res) => {
    res.json({ data: 'testdata' })
}

export const getPeerAndSocketId = async (req, res) => {
    logger.info("ENDPOINT: /getPeerSocketId")
    logger.info("Req body: ", req.body)
    const userStatus = await UserStatus.findOne({user_id: req.body.user})
    if(userStatus.online) {
        res.json({status: 'online', peerId: userStatus.peer_id,socketId: userStatus.socket_id })
    }else {
        res.json({status: 'offline'})
    }
}

export const deleteFileById = async (req, res) => {
    logger.debug("ENDPOINT: /deleteFileById")
    logger.debug("Request body: ", req.body)
    var fileId = req.body.fileId;
    try {
        // const resp = await deleteObjectS3(fileId)
        await File.deleteOne({ file_id: fileId })
        fs.unlinkSync('./uploads/' + fileId, (err) => {
            res.status(500).json({ message: "Can't delete file." })
        })
        res.json({ message: "Deleted " + fileId })
    } catch (error) {
        logger.error(error)
    }
}

export const sendMessage = async (req, res) => {
    // console.log("Send Message Called")
    const userId = req.signedCookies.s_user._id;
    const { chatId, message, files } = req.body;
    logger.info("ENDPOINT: /sendMessage ")
    logger.info("Request Body: ", req.body)
    logger.info('chatId', chatId)
    logger.info('message', message)
    logger.info('Files: ', files)
    // res.json({body: req.body})
    // var messageDoc = await Message.create({ from: userId, toChat: chatId, message, files: files })
    // var chat = await Chat.findOne({ _id: chatId })
    const session = await conn.startSession();
    try {
        await session.withTransaction(async () => {
            var messageDoc = await Message.create({ from: userId, toChat: chatId, message, files: files })
            res.json({ message: messageDoc })
            var chat = await Chat.findOne({ _id: chatId })
            chat.messages.push(messageDoc._id);
            await chat.save();
            // 1.) Check Whether user is viewing the chat
            // 2.) If user currently viewing chat then update the last message of that user's chatlist.
            // 3.) If user not viewing chat then update the unread messages add message id and update the last message.
            for (var user of chat.participants) {
                const userChatList = await UserChatList.findOne({ user_id: user, chat: chatId })
                const userStatus = await UserStatus.findOne({ user_id: user })
                if (userStatus) {
                    const user1 = await User.findOne({ _id: user })
                    if (userStatus.online == true && userStatus.viewing_chat_id != undefined) {
                        if (userStatus.viewing_chat_id?.toString() == chat._id) {
                            console.log("UnRead not updated for: ", user1.name)
                            userChatList.lastMessage = messageDoc._id;
                        } else {
                            console.log("UnReadUpdated for: ", user1.name)
                            userChatList.unReadMessages.push(messageDoc._id);
                            userChatList.lastMessage = messageDoc._id;
                        }
                    } else {
                        console.log("UnReadUpdated for ", user1.name)
                        userChatList.unReadMessages.push(messageDoc._id);
                        userChatList.lastMessage = messageDoc._id;
                    }
                    // // console.log("-----------------------------------------")
                    await userChatList.save();
                } else {
                    await UserStatus.create({ user_id: user, online: false })
                    userChatList.unReadMessages.push(messageDoc._id);
                    userChatList.lastMessage = messageDoc._id;
                    await userChatList.save();
                }
            }
        })
    } catch (error) {
        console.log('error from send Message: ', error)
        await session.abortTransaction();
    }

    // res.json({ message: messageDoc })
}

export const getUsers = async (req, res) => {
    const users = await User.find({});
    users.forEach((user) => {
        user.password = undefined;
        user.friends = [];
        user.createdAt = undefined;
        user.updatedAt = undefined;
        return user;
    })
    res.json({ data: users })
}

export const getChat = async (req, res) => {
    const userId = req.signedCookies.s_user._id
    const { chatId } = req.params;
    const chat = await Chat.findOne({ chat_id: chatId }).populate([{ path: 'messages' }, { path: 'participants' }])
    var participants = []
    var team_name = ''
    const userChatList = await UserChatList.findOne({ user_id: userId, chat: chat._id })
    userChatList.unReadMessages = []
    userChatList.save();

    const userStatus = await UserStatus.findOne({ user_id: userId })

    if (userStatus) {
        userStatus.viewing_chat_id = chat._id;
        logger.debug("Setting Chat ID: ", userStatus.viewing_chat_id)
        userStatus.online = true;
        logger.debug("UserStatus: ", userStatus)
        await userStatus.save();
    } else {
        await UserStatus.create({ user_id: userId, online: true, viewing_chat_id: chat._id })
    }

    for (var participant of chat.participants) {
        participants.push(participant._id.toString());
        if (chat.chat_type == 'duo' && participant._id.toString() != userId) {
            team_name = participant.name;
        }
    }
    // Include inside if condition if the userId exists inside chat.participants array.
    // Only then send the access or data.
    if (chat != null && participants.includes(userId)) {
        if (chat.chat_type === 'team') {
            res.json({ chat_id: chat._id, team_name: chat.team_name, participants: chat.participants, messages: chat.messages })
        } else if (chat.chat_type === 'duo') {
            res.json({ chat_id: chat._id, team_name: team_name, participants: chat.participants, messages: chat.messages })
        }
        // export interface Chat {
        //     chat_id: string,
        //     team_name: string,
        //     participants: [string],
        //     mesages: [string]
        // }
    } else {
        res.json({ userId, chat, chatId, message: 'response from getchat' })
    }

}

export const getUserChatList = async (req, res) => {
    const userId = req.signedCookies.s_user._id
    const userChatList = await UserChatList.find({ user_id: userId }).sort([['updatedAt', -1]]).populate([{ path: 'chat', populate: [{ path: 'participants' }, { path: 'admin' }] }, { path: 'lastMessage' }])
    // const userChatList = await UserChatList.find({ user_id: userId }).populate({ path: 'chat', populate: [{ path: 'participants' }, { path: 'admin' }] })
    logger.debug("UserChatList: ", userChatList)
    var resp = [];
    for (let userChatItem of userChatList) {
        var teamName = userChatItem.chat.team_name;
        if (userChatItem.chat_type == 'duo') {
            for (let participant of userChatItem.chat.participants) {
                if (participant._id != userId) {
                    teamName = participant.name;
                }
            }
        }
        // // console.log('userChatItem', userChatItem)
        // userChatItem.unReadMessages = urMessages;
        // // console.log('userChatItem', userChatItem)
        var resItem = {
            _id: userChatItem.chat._id,
            chat_id: userChatItem.chat.chat_id,
            chat_type: userChatItem.chat_type,
            team_name: teamName,
            urMessages: userChatItem.unReadMessages,
            participants: userChatItem.chat.participants,
            lastMessage: userChatItem.lastMessage,
            admin: userChatItem.chat.admin,
            updatedAt: userChatItem.updatedAt
        }
        resp.push(resItem)
    }
    res.json({ resp: resp })
    // {
    //          _id: new ObjectId("63a8170686ab14dabc6268f7"),
    //          user_id: '63a7284df655523a27a0c844',
    //          chat: {
    //            _id: new ObjectId("63a8170686ab14dabc6268f1"),
    //            chat_id: '3e8e0d83-552f-4d0c-a2a0-592c5be3234a',
    //            team_name: 'Paypal Team',
    //            admin: [Array],
    //            participants: [Array],
    //            messages: [],
    //            __v: 0
    //          },
    //          unReadMessages: [],
    //          createdAt: 2022-12-25T09:25:26.804Z,
    //          updatedAt: 2022-12-25T09:25:26.804Z,
    //          __v: 0
    //        },

    // Resume from here
    // res.json({ data: 'somedata' })
}

export const addTeam = async (req, res) => {
    const body = req.body;
    body._id = uuidv4();
    const session = await conn.startSession();
    try {
        await session.withTransaction(async () => {
            const chat = await Chat.create([{
                chat_id: body._id,
                team_name: body.teamName,
                chat_type: 'team',
                admin: [body.admin],
                participants: body.participants,
                messages: [],
            }], { session })

            // const resp = await Chat.populate(chat, [{path: 'participants'},{path: 'admin'}])

            for (const user of chat[0].participants) {
                await UserChatList.create([{
                    user_id: user,
                    chat_type: chat[0].chat_type,
                    chat: chat[0]._id,
                }], { session })
            }
            var respChat = {
                _id: chat[0]._id,
                chat_id: chat[0].chat_id,
                chat_type: chat[0].chat_type,
                team_name: chat[0].team_name,
                admin: chat[0].admin,
                participants: chat[0].participants,
                urMessages: [],
                messages: chat[0].messages
            }

            // console.log('respChat from TeamAdded: ', respChat)

            res.status(200).json({ chat: respChat })
        })
        await session.endSession();
    } catch (error) {
        // console.log('error from add team', error)
        await session.abortTransaction();
        res.status(401).json({ error });
    }

}

export const addDuoChat = async (req, res) => {
    const userId = req.signedCookies.s_user._id
    const user2Id = req.body.userId
    let team_name = '';
    if (userId > user2Id) {
        team_name = user2Id + '_' + userId;
    } else {
        team_name = userId + '_' + user2Id;
    }
    const session = await conn.startSession();
    try {
        await session.withTransaction(async () => {
            const chat = await Chat.create([{
                chat_id: uuidv4(),
                team_name: team_name,
                chat_type: 'duo',
                admin: [],
                participants: [userId, user2Id],
                messages: []
            }], { session })
            // const resp = await Chat.populate(chat, [{path: 'participants'},{path: 'admin'}])

            for (const user of chat[0].participants) {
                await UserChatList.create([{
                    user_id: user,
                    chat_type: chat[0].chat_type,
                    chat: chat[0]._id,
                }], { session })
            }

            const chat1 = await Chat.populate(chat, { path: 'participants' })

            let participants = []
            for (let participant of chat1[0].participants) {
                participant.password = undefined;
                participants.push(participant)
            }

            var respChat = {
                _id: chat[0]._id,
                chat_id: chat[0].chat_id,
                team_name: chat[0].team_name,
                chat_type: chat[0].chat_type,
                admin: chat[0].admin,
                participants: participants,
                urMessages: [],
                messages: chat[0].messages
            }

            // console.log('respChat of AddedDuo: ', respChat)

            res.status(200).json({ chat: respChat })
        })
        await session.endSession();
    } catch (error) {
        console.log('error from add duo chat', error)
        await session.abortTransaction();
    }
}

export const setPeerId = async (req, res, next) => {
    logger.info("ENDPOINT: /setPeerId")
    logger.info("Request Body: ", req.body)

    try {

    } catch (error) {
        logger.error("/setPeerId Error: ", error)
    }
}

export const GetUserById = async (req, res, next) => {
    logger.info("ENDPOINT: /getUserById")
    logger.info("Request Body: ", req.body)
    const userId = req.body.userId
    try {
        if (Object.prototype.hasOwnProperty.call(req.signedCookies, 's_user') && userId) {
            const resp = await User.findOne({ _id: userId })
            if (resp == null) {
                throw new UserNotFound("User Not Found.")
            } else {
                res.json(resp)
            }
        } else {
            res.json(null)
        }
    } catch (error) {
        next(error)
    }
}

export const getFileById = async (req, res, next) => {
    logger.info("ENDPOINT: /getFileById")
    logger.info("Request Body: ", req.body)
    const fileId = req.body.fileId
    try {
        const resp = await File.findOne({ file_id: fileId })
        res.status(200).json(resp)
    } catch (error) {
        next(error)
    }
}