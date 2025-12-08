// server/controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

// POST /api/users/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/users/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      isAdmin,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    // req.user comes from authMiddleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const addCourseToUser = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Check if user already registered in course
    const alreadyRegistered = course.participants.some(
      (p) => p.toString() === user._id.toString()
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered to course" });
    }
    // Check if course is full
    if (course.participants.length >= course.maxSeats) {
      return res.status(400).json({ message: "Course is full" });
    }
    // Add user to course participants
    course.participants.push(user._id);
    await course.save();
    // Add course to user.courses
    const existingCourse = user.courses.find(c => String(c.courseId || c._id) === String(courseId));
    if (!existingCourse) {
      user.courses.push({ courseId });
    }
    await user.save();
    res.json({ courses: user.courses });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/courses - returns all purchased courses
export const getUserCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      courses: user.courses || [],
    });
  } catch (err) {
    console.error("getUserCourses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/courses/:courseId - removes a course
export const removeCourseFromUser = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    if (!courseId) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Remove user from course participants
    course.participants = course.participants.filter(
      (p) => p.toString() !== user._id.toString()
    );
    await course.save();
    // Remove course from user.courses
    user.courses = user.courses.filter(c => String(c.courseId || c._id) !== String(courseId));
    await user.save();
    res.json({ courses: user.courses, message: "Course removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/favorites - returns user's favorite meals
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      favoriteMeals: user.favoriteMeals || [],
    });
  } catch (err) {
    console.error("getFavorites error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/favorites  (toggle favoriteMeal by idMeal)
export const toggleFavoriteMeal = async (req, res) => {
  try {
    // Try to get ID from params (preferred) or body
    console.log("toggleFavoriteMeal request:", { params: req.params, body: req.body });
    const idMeal = req.params.mealId || req.body.idMeal;

    if (!idMeal) {
      console.log("toggleFavoriteMeal failed: Missing idMeal");
      return res.status(400).json({ message: "idMeal is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If already exists → remove. If not → add
    const index = user.favoriteMeals.indexOf(idMeal);
    if (index === -1) {
      user.favoriteMeals.push(idMeal);
    } else {
      user.favoriteMeals.splice(index, 1);
    }

    await user.save();

    res.json({
      favoriteMeals: user.favoriteMeals,
    });
  } catch (err) {
    console.error("toggleFavoriteMeal error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
