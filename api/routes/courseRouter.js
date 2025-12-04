// server/routes/courseRoutes.js
import { Router } from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  registerToCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);

// Must be logged in, and in controller we check isAdmin
router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

// Any logged-in user can register
router.post("/:id/register", protect, registerToCourse);

export default router;