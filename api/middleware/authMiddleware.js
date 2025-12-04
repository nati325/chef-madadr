// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // 👈 Important the .js!

// middleware that verifies user is logged in
export const protect = async (req, res, next) => {
  try {
    // Expecting a Header named Authorization: "Bearer asdasdasd.token.here"
    const authHeader = req.headers.authorization;

    // If there's no token at all
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Cut the word "Bearer " and leave only the token
    const token = authHeader.split(" ")[1];

    // Decode the token according to our secret in .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the id we put in the token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add isAdmin if user email matches ADMIN_EMAIL
    if (user.email === process.env.ADMIN_EMAIL) {
      user.isAdmin = true;
    }
    req.user = user;

    // Continue to router / controller
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
