// server/controllers/courseController.js

import Course from "../models/courseModel.js";

// --- Create new course (admin only) ---
export const createCourse = async (req, res) => {
  try {
    // Only admin can create a course
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin can create a course" });
    }

    const userId = req.user._id; // Who created it (the admin)
    const course = new Course({ ...req.body, createdBy: userId });
    await course.save();
    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- Get all courses (open to all) ---
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Get one course by id (open to all) ---
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "participants",
      "name email"
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- User registration for course (any logged-in user can register) ---
export const registerToCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If user already registered – don't allow again
    const alreadyRegistered = course.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: "You are already registered to this course" });
    }

    // If course is full
    if (course.participants.length >= course.maxSeats) {
      return res.status(400).json({ message: "Course is full" });
    }

    course.participants.push(userId);
    await course.save();

    res.json({ message: "Registered successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Update course (admin only) ---
export const updateCourse = async (req, res) => {
  try {
    // Admin only
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin can update a course" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- מחיקת קורס (רק אדמין) ---
export const deleteCourse = async (req, res) => {
  try {
    // רק אדמין
    if (!req.user || !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin can delete a course" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};