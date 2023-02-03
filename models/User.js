import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please Provide Valid Email.",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validator.isStrongPassword,
      message: "Please Provide Valid Password.",
    },
  },
  friends: [{
    type: mongoose.Types.ObjectId,
    ref: 'users'
  }],
  // token: {type: String},
  profilePic: { type: String },
}, { timestamps: true });

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// UserSchema.pre("save", async function () {
//     if (this.token == undefined) {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       this.token = jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
//         expiresIn: process.env.SECRET_LIFETIME,
//       });
//       this.refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_KEY, {
//         expiresIn: process.env.REFRESH_LIFETIME,
//       });
//     }
//   });

//   UserSchema.methods.refToken = function () {
//     try {
//       jwt.verify(this.refreshToken, process.env.REFRESH_KEY);
//       this.token = jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
//         expiresIn: process.env.SECRET_LIFETIME,
//       });
//       return { token: this.token };
//     } catch (error) {
//       return {
//         error: "TokenExpired",
//         message: "Refresh Token Expired re-login again.",
//       };
//     }
//   };

//   UserSchema.methods.generateTokens = function () {
//     this.refreshToken = jwt.sign({ id: this._id }, process.env.REFRESH_KEY, {
//       expiresIn: process.env.REFRESH_LIFETIME,
//     });
//     this.token = jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
//       expiresIn: process.env.SECRET_LIFETIME,
//     });
//   };

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export default mongoose.model("users", UserSchema);
