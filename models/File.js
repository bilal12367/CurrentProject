import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    file_id: { type: String, required: true, trim: true },
    original_name: { type: String, required: true, trim: true },
    mime_type: { type: String, required: true, trim: true },
    size: { type: Number },
})

export default mongoose.model('files', FileSchema)