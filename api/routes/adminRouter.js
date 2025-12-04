import express from "express";
const router = express.Router();
import { getAdminStats, getAllUsers } from "../controllers/adminController.js";
import isAdmin from "../middleware/adminMiddleware.js";

// All routes are protected with isAdmin middleware
router.get("/stats", isAdmin, getAdminStats);
router.get("/users", isAdmin, getAllUsers);

export default router;
