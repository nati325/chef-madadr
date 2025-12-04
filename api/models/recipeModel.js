// server/models/recipeModel.js
import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // שם רכיב
  amount: { type: String, required: true }, // למשל "2 כוסות", "200 גרם"
});

const RecipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String },
    description: { type: String },
    readyInMinutes: { type: Number },

    difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "קל", "בינוני", "קשה"] },

    ingredients: [IngredientSchema],
    instructions: [{ type: String, required: true }],

    categories: [{ type: String }],

    // 🔥 זה החלק שמאפשר "בעלות" על מתכון
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // חשוב מאוד! כל מתכון חייב יוצר
    },
  },
  {
    timestamps: true, // נותן createdAt ו־updatedAt אוטומטי
  }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;