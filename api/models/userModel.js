// api/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true, unique: true },
    password:{ type: String, required: true },

    // מתכונים מועדפים (ObjectId למתכונים מקומיים)
    favorites: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }
    ],
    // מזהי מתכונים מ-TheMealDB API (strings)
    favoriteMeals: [
      { type: String }
    ],
    
    // קורסים שנרכשו
    courses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        status: { type: String, default: "pending" },
        purchaseDate: { type: Date, default: Date.now }
      }
    ],
    
    // 👇 שדה אדמין – זה מה שנשתמש בו לבדוק אם הוא "דומיין" כמו שאמרת
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;