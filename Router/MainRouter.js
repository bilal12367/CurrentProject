
import express  from "express";
import { addDuoChat,setPeerId , addTeam, deleteFileById, getChat, getFileById, GetUserById, getUserChatList, getUsers, sendMessage, testData, getPeerAndSocketId } from "../controller/dataController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();
router.route('/testData').get(AuthMiddleware, testData)
router.route('/getUsers').get(AuthMiddleware, getUsers)
router.route('/addTeam').post(AuthMiddleware, addTeam)
router.route('/getUserChatList').get(AuthMiddleware, getUserChatList)
router.route('/getChat/:chatId').get(AuthMiddleware, getChat)
router.route('/sendMessage').post(AuthMiddleware, sendMessage)
router.route('/addDuoChat').post(AuthMiddleware, addDuoChat)
router.route('/deleteFileById').post(AuthMiddleware, deleteFileById)
router.route('/getUserById').post(AuthMiddleware, GetUserById)
router.route('/getFileById').post(AuthMiddleware, getFileById)
router.route('/setPeerId').post(AuthMiddleware,setPeerId)
router.route('/getPeerAndSocketId').post(AuthMiddleware,getPeerAndSocketId)
export default router;