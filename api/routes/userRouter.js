import { Router } from "express";
import { register, login, getProfile, toggleFavoriteMeal, addCourseToUser, getUserCourses, removeCourseFromUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);

// ⭐ חדש – toggle פייבוריט
router.patch("/favorites", protect, toggleFavoriteMeal);
router.post("/courses/:courseId", protect, addCourseToUser);
router.get("/courses", protect, getUserCourses);
router.delete("/courses/:courseId", protect, removeCourseFromUser);
export default router;
