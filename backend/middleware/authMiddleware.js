import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  console.log("Received Token:", token); // ✅ Debugging step

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
  }

  try {
    // ✅ Decode the token WITHOUT verifying
    const decoded = jwt.decode(token);
    console.log("Decoded Token (before verification):", decoded); 

    // ✅ Check if the token has already expired
    if (decoded && decoded.exp * 1000 < Date.now()) {
      console.error("Token expired at:", new Date(decoded.exp * 1000));
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    // ✅ Verify the token
    const verifiedDecoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token (after verification):", verifiedDecoded);

    if (verifiedDecoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.adminId = verifiedDecoded.id;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
