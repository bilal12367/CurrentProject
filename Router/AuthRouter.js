import Express from "express"
import { GetUser, LoginUser, RegisterUser } from "../controller/authController.js";
const router = Express.Router();

router.post('/register',RegisterUser)

router.get('/getUser',GetUser)

router.post('/login',LoginUser)

export default router;