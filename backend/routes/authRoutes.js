import express from "express";
import * as authController from "../controllers/authController.js"; // Use `import * as` syntax

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

export default router;


