
const AuthMiddleware = (req, res, next) => {
    // res.cookie('s_user',{id:''}, {maxAge: 20})
    const day = 1000 * 60 * 60 * 24
    if (req.signedCookies.s_user != null) {
        next();
        // res.cookie('s_user', { _id:  req.signedCookies.s_user._id }, { path: '/',maxAge: 360 * day, secure: true, signed: true, httpOnly: true })
    } else {
        // res.cookie('s_user', { id: 'kafka12343252343' }, { signed: true });
        res.status(401).json({error: "unauthorized",message:"User Not Authorized."})
    }
}

export default AuthMiddleware