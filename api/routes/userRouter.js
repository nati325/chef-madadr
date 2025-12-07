import { Router } from "express";
import {
  register,
  login,
  getProfile,
  getUserCourses,
  addCourseToUser,
  removeCourseFromUser,
  getFavorites,
  toggleFavoriteMeal
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Profile
router.get("/profile", protect, getProfile);

// Courses
router.get("/courses", protect, getUserCourses);
router.post("/courses/:courseId", protect, addCourseToUser);
router.delete("/courses/:courseId", protect, removeCourseFromUser);

// ⭐ FAVORITES — מה שהיה חסר אצלך ⭐
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:mealId", protect, toggleFavoriteMeal);

export default router;
