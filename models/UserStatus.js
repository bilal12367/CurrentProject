import mongoose from "mongoose";

const UserStatusSchema = new mongoose.Schema({
  user_id: {type: mongoose.Types.ObjectId, ref: 'users',unique: true},
  user_name: {type: String}, // For debugging remove it afterwards
  socket_id: {type: String},
  online: {type: Boolean},
  viewing_chat_id: {type: mongoose.Types.ObjectId, ref: 'chat'}
}, { timestamps: true });

export default mongoose.model("userstatus", UserStatusSchema);
