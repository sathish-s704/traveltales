import Admin from "../models/Admin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


// Admin Signup
export const adminSignup = async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        const admin = new Admin({ email, password });
        await admin.save();

        res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin Login
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, message: "Admin Login successful", token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Admin Logout
export const adminLogout = (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: " Admin Logged out successfully" });
};

// Get All Users (Admin Only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude passwords
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update User (Admin Only)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, email } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, { fullName, email }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete User (Admin Only)
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Create User (Admin Only)
export const createUser = async (req, res) => {
    console.log("Incoming request:", req.body);

    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        console.log("Missing fields");
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();

        console.log("User created:", user);
        res.status(201).json({ success: true, message: "User created successfully", user });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//token refresh
export const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(403).json({ success: false, message: "Refresh token missing" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Also set the new access token in cookies
        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.json({ success: true, accessToken: newAccessToken });
    });
};
