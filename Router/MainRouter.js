
import express  from "express";
import { addDuoChat, addTeam, getChat, getUserChatList, getUsers, sendMessage, testData } from "../controller/dataController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();
router.route('/testData').get(AuthMiddleware, testData)
router.route('/getUsers').get(AuthMiddleware, getUsers)
router.route('/addTeam').post(AuthMiddleware, addTeam)
router.route('/getUserChatList').get(AuthMiddleware, getUserChatList)
router.route('/getChat/:chatId').get(AuthMiddleware, getChat)
router.route('/sendMessage').post(AuthMiddleware, sendMessage)
router.route('/addDuoChat').post(AuthMiddleware, addDuoChat)
export default router;