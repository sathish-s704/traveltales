import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";

dotenv.config();

// Register a new user
export const register = async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.json({ success: false, message: "Missing required fields" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ fullName, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7*24*60*60*1000,
        });
        //send email to user
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: "Welcome to our platform",
            text: ` welcome to our platform! You have successfully registered with the email ${email}`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "User created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password required fields" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid Email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000,
        });

        res.json({ success: true, message: "Login successful" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Logout user
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
}   


export const sentVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpires = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    console.log(otp ?? "no otp")
    
    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpires < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = ""; // Clear OTP after verification
        user.verifyOtpExpires = null; // Set expiry to null

        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

//check if user is authendicated
export const isAuthendicated=async(req,res)=>{
    try{
        return res.json({success:true});

    }catch(error){
        res.json({success:false,message:error.message});
    }
}

//sent password reset otp

export const sentResetOtp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email is required"});
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }

        const otp=String(Math.floor(100000+Math.random()*900000));
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000;
        await user.save();
        const mailOptions={
            from:process.env.SMTP_USER,
            to:email,
            subject:"Password Reset OTP",
            text:`Your RESET OTP is ${otp}`,
        };
        await transporter.sendMail(mailOptions);
        res.json({success:true,message:"OTP sent successfully"});


    }catch(error){
        res.json({success:false,message:error.message});
    }   
}
  
//reset password here
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Missing required fields" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = ""; // Clear OTP after successful reset
        user.resetOtpExpireAt = null; // Set to null instead of 0

        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};