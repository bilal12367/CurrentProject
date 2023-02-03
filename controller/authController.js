import mongoose from 'mongoose';
import { IncorrectPassword, UserNotFound, UserNotRegistered } from '../middleware/Errors.js';
import User from '../models/User.js'
export const RegisterUser = async (req, res, next) => {
    try {
        const { user } = req.body;
        const resp = await User.create({
            name: user.name,
            email: user.email,
            password: user.password,
            friends: [],
            profilePic: 'default'
        })
        const day = 1000 * 60 * 60 * 24
        res.cookie('s_user', { _id: resp._id }, { path: '/', maxAge: 360 * day, secure: true, signed: true, httpOnly: true })
        resp.password = undefined;
        await new Promise(resolve => setTimeout(resolve, 1400)); // Delay
        res.json(resp)
    } catch (error) {
        next(error);
    }

}

export const LoginUser = async (req, res, next) => {
    try {
        const body = req.body;
        const user = await User.findOne({ email: body.user.email });
        if (user) {
            const isMatch = await user.comparePassword(body.user.password);
            const day = 1000 * 60 * 60 * 24
            if (isMatch == true) {
                res.cookie('s_user', { _id: user._id }, { path: '/', maxAge: 360 * day, secure: true, signed: true, httpOnly: true })
                user.password = undefined;
                user.friends = undefined;
                res.json({ user })
            } else {
                throw new IncorrectPassword("Password is Incorrect");
                // res.status(500).json({ user: null, error: 'Invalid Password', type: 'password' })
            }
        } else {
            throw new UserNotRegistered("User Not Registered.")
            // res.status(500).json({ user: null, error: 'User not Registered.', type: 'email' })
        }
    } catch (error) {
        next(error);
    }

}

export const GetUser = async (req, res) => {
    try {
        if (Object.prototype.hasOwnProperty.call(req.signedCookies, 's_user')) {
            const user = req.signedCookies.s_user;
            const resp = await User.findOne({ _id: user._id })
            if (resp == null) {
                // res.json({ user: null, message: "User Not Found." })
                throw new UserNotFound("User Not Found.");
            } else {
                resp.password = undefined;
                resp.friends = undefined;
                res.json(resp)
            }
        } else {
            res.json(null)
        }
    } catch (error) {
        next(error)
    }

}