import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var chatSchema = new mongoose.Schema({
    chat_id: { type: String, required: true, unique: true },
    team_name: { type: String },
    chat_type: { type: String },
    admin: [{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }],
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }],
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: 'messages'
    }]
});

//Export the model
export default mongoose.model('chats', chatSchema);