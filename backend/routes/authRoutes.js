import express from "express";
import * as authController from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRoutes = express.Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authController.logout);
authRoutes.post("/sent-verify-otp", userAuth, authController.sentVerifyOtp);
authRoutes.post("/verify-email", userAuth, authController.verifyEmail); // Requires authentication
authRoutes.post("/is-auth", userAuth, authController.isAuthendicated);
authRoutes.post("/reset-otp", authController.sentResetOtp);
authRoutes.post("/reset-password", authController.resetPassword);

export default authRoutes;
