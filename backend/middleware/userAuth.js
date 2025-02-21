import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    // Extract token from headers or cookies
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    console.log("Incoming Token:", token || "No token received");

    // If no token, return unauthorized error
    if (!token) {
      return res.status(401).json({ success: false, msg: "No Authorization. Please log in again." });
    }

    // Verify the token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Token Decoded:", tokenDecode); // Debugging token content

    // Store user ID in request object
    req.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    // Handle specific JWT errors
    let errorMsg = "Token is not valid";
    if (error.name === "TokenExpiredError") {
      errorMsg = "Session expired. Please log in again.";
    } else if (error.name === "JsonWebTokenError") {
      errorMsg = "Invalid token. Please log in again.";
    }

    return res.status(401).json({ success: false, msg: errorMsg });
  }
};

export default userAuth;
