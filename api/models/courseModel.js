// server/models/courseModel.js

import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },   // Course name
    description: { type: String },                         // Description
    price: { type: Number, required: true },               // Price

    // Physical course:
    location: { type: String, required: true },            // City / Address
    date: { type: Date, required: true },                  // Date and time

    maxSeats: { type: Number, required: true },            // How many people allowed?
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Users registered for the course

    // 🔥 Course content/syllabus
    content: { type: String },
    // 🔥 תמונה של הקורס
    image: { type: String },
    // 🔥 Who created the course (the admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,    // 👈 MUST HAVE! Without this there's no course
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
