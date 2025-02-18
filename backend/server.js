import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/authRoutes.js"; // Correct import

const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 4000;
const db = process.env.MONGO_URI;

// Use the authentication routes
app.use("/api/auth", router);

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
