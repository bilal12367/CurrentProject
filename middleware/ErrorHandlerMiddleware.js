import { IncorrectPassword, UserNotFound, UserNotRegistered } from "./Errors.js"

export const ErrorHandlerMiddleWare = (error, req, res, next) => {
    console.log("-----------------------ERROR-------------------------")
    console.log(error)
    switch (error.name) {
        case UserNotRegistered.name:
            console.log("User Not Registered")
            res.status(401).json({ error: 'AuthError',type: 'UserNotRegistered', message: "User Not Registered" })
            break;
        case IncorrectPassword.name:
            console.log("Incorrect Password")
            res.status(401).json({ error: 'AuthError', type: "IncorrectPassword" ,message: "Incorrect Password" })
            break;
        case UserNotFound.name:
            console.log("User Not Found")
            res.status(401).json({ error: 'AuthError', type: "UserNotFound", message: "User Not Found" })
            break;
        default:
            res.status(500).json({ error })
            break;
    }

    console.log("------------------------------------------------")
}
