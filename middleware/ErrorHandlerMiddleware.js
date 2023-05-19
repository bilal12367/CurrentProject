import { logger } from "../logger/logger.js"
import { IncorrectPassword, UserNotFound, UserNotRegistered } from "./Errors.js"

export const ErrorHandlerMiddleWare = (error, req, res, next) => {
    logger.error("-----------------------ERROR-------------------------")
    logger.error(error)
    switch (error.name) {
        case UserNotRegistered.name:
            logger.error("User Not Registered")
            res.status(401).json({ error: 'AuthError',type: 'UserNotRegistered', message: "User Not Registered" })
            break;
        case IncorrectPassword.name:
            logger.error("Incorrect Password")
            res.status(401).json({ error: 'AuthError', type: "IncorrectPassword" ,message: "Incorrect Password" })
            break;
        case UserNotFound.name:
            logger.error("User Not Found")
            res.status(401).json({ error: 'AuthError', type: "UserNotFound", message: "User Not Found" })
            break;
        default:
            res.status(500).json({ error })
            break;
    }

    logger.error("------------------------------------------------")
}
