import express from "express";
import { adminSignup, adminLogin, adminLogout, getAllUsers, updateUser, deleteUser,createUser ,refreshToken} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

adminRouter.post("/signup", adminSignup);
adminRouter.post("/signin", adminLogin);
adminRouter.post("/logout", adminLogout);
adminRouter.get("/users", authMiddleware, getAllUsers);
adminRouter.put("/users/:id", authMiddleware, updateUser);
adminRouter.delete("/users/:id", authMiddleware, deleteUser);
adminRouter.post("/create-users", authMiddleware, createUser);
adminRouter.get("/refresh-token",refreshToken);

export default adminRouter;
