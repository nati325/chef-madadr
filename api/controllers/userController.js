// server/controllers/userController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

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
    console.log("🔵 addCourseToUser started");
    console.log("🔵 req.params.courseId:", req.params.courseId);
    console.log("🔵 req.user:", req.user);
    
    const courseId = parseInt(req.params.courseId, 10);
    console.log("🔵 Parsed courseId:", courseId);
    
    if (isNaN(courseId)) {
      console.log("🔴 Invalid course ID");
      return res.status(400).json({ message: "Invalid course ID" });
    }

    console.log("🔵 Finding user:", req.user.id);
    const user = await User.findById(req.user.id);
    console.log("🔵 User found:", !!user);
    
    if (!user) {
      console.log("🔴 User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔵 Current user.courses:", user.courses);
    
    // Check if course already exists (by courseId)
    const existingCourse = user.courses.find(c => c.courseId === courseId);
    console.log("🔵 Existing course:", existingCourse);
    
    if (!existingCourse) {
      console.log("🔵 Adding new course");
      // Add new course with status "pending"
      user.courses.push({
        courseId: courseId,
        status: "pending",
        purchaseDate: new Date()
      });
      console.log("🔵 Saving user...");
      await user.save();
      console.log("🟢 User saved successfully");
    }

    res.json({
      courses: user.courses,
    });
  } catch (err) {
    console.error("🔴 addCourseToUser error:", err);
    console.error("🔴 Error stack:", err.stack);
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
    console.log("🔴 removeCourseFromUser called");
    const courseId = parseInt(req.params.courseId, 10);
    console.log("🔴 Course ID to remove:", courseId);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔴 User courses before:", user.courses);
    
    // Filter - remove the course from the array
    user.courses = user.courses.filter(c => c.courseId !== courseId);
    console.log("🔴 User courses after:", user.courses);
    
    await user.save();

    res.json({
      courses: user.courses,
      message: "Course removed successfully"
    });
  } catch (err) {
    console.error("removeCourseFromUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/favorites  (toggle favoriteMeal by idMeal)
export const toggleFavoriteMeal = async (req, res) => {
  try {
    const { idMeal } = req.body;

    if (!idMeal) {
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
