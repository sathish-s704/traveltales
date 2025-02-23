import jwt from "jsonwebtoken";
const userAuth = (req, res, next) => {
  try {
    let token;

    // Extract token from cookies or headers
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("Incoming Token:", token || "No token received");

    if (!token) {
      return res.status(401).json({ success: false, msg: "No Authorization. Please log in again." });
    }

    // Verify the token
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token Decoded:", tokenDecode);

    // Attach user ID to request object
    req.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

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

