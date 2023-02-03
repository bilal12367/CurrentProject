import mongoose from "mongoose";

const UserChatListSchema = mongoose.Schema({
    user_id: { type: String, required: true, trim: true },
    chat_type: { type: String },
    chat: { type: mongoose.Types.ObjectId, ref: 'chats', required: true },
    unReadMessages: [{
        type: mongoose.Types.ObjectId, ref: 'messages'
    }],
    lastMessage: {
        type: mongoose.Types.ObjectId, ref: 'messages'
    }
}, { timestamps: true })


export default mongoose.model("UserChatList", UserChatListSchema)