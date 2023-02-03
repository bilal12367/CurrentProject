import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    from: { type: mongoose.Types.ObjectId, ref: 'users', required: true },
    toChat: { type: mongoose.Types.ObjectId, ref: 'chat', required: true },
    message: { type: String },
    files: [{ type: String }],
    replyFor: {type: mongoose.Types.ObjectId, ref: 'messages'}
}, { timestamps: true })

export default mongoose.model('messages', MessageSchema)
