import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";



dotenv.config();

const app = express();


// Middleware for parsing JSON requests



// app.use(cors({credentials: true}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));



app.use(bodyParser.json());


app.use(cookieParser());


const port = process.env.PORT || 4000;
const db = process.env.MONGO_URI;

// Use the authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);



// Connect to the database
mongoose
  .connect(db)
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
