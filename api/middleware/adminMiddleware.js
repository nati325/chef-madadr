import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user email matches admin email
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error("ADMIN_EMAIL not set in .env file");
      return res.status(500).json({ message: "Admin email not configured" });
    }

    if (decoded.email === adminEmail) {
      req.user.isAdmin = true;
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default isAdmin;
