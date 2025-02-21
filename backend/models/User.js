import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String,default: ''},
  verifyOtpExpiredAt: { type: Number,default: 0},
  isAccountVerified: { type: Boolean, default: false },
  resetOtp:{ type: String, default:false},
  resetOtpExpireAt:{ type: Number, default:0},
 
});



const userModel=mongoose.models.user||mongoose.model("User", userSchema);
export default userModel;