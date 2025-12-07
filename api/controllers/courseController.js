// server/controllers/courseController.js

import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

// --- Create new course (admin only) ---
export const createCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Only admin can create a course" });
    }

    const userId = req.user._id;
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

    const alreadyRegistered = course.participants.some(
      (p) => String(p) === String(userId)
    );
    if (alreadyRegistered) {
      // Instead of error, return current courses
      const user = await User.findById(userId).select("courses").lean();
      return res.json({
        message: "You are already registered to this course",
        alreadyRegistered: true,
        userCourses: user?.courses || [],
      });
    }

    if (course.maxSeats && course.participants.length >= course.maxSeats) {
      return res.status(400).json({ message: "Course is full" });
    }

    // Add user to course participants
    course.participants.push(userId);
    await course.save();

    // Add course to user.courses array if not exists
    const user = await User.findById(userId);
    if (user) {
      const existingCourse = user.courses.find(c => String(c.courseId) === String(courseId));
      if (!existingCourse) {
        user.courses.push({
          courseId: course._id,
          status: "pending",
          purchaseDate: new Date()
        });
        await user.save();
      }
    }

    // Return the updated user's courses (so client can replace state)
    const updatedUser = await User.findById(userId).select("courses").lean();
    res.json({
      message: "Registered successfully",
      course,
      userCourses: updatedUser?.courses || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Unregister from course ---
export const unregisterFromCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove user from course participants
    course.participants = course.participants.filter(
      (p) => String(p) !== String(userId)
    );
    await course.save();

    // Remove course from user.courses
    const user = await User.findById(userId);
    if (user) {
      user.courses = user.courses.filter(
        (c) => String(c.courseId) !== String(courseId)
      );
      await user.save();
    }

    const updatedUser = await User.findById(userId).select("courses").lean();
    res.json({
      message: "Unregistered successfully",
      userCourses: updatedUser?.courses || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Update course (admin only) ---
export const updateCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Only admin can update a course" });
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

// --- Delete course (admin only) ---
export const deleteCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Only admin can delete a course" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete the course
    await course.deleteOne();

    // Remove this course from all users' courses arrays
    await User.updateMany(
      { "courses.courseId": course._id },
      { $pull: { courses: { courseId: course._id } } }
    );

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};