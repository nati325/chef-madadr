// server/routes/recipeRouter.js
import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
} from "../controllers/recipeControler.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getRecipes);
router.get("/my/recipes", protect, getMyRecipes);
router.get("/:id", getRecipeById);

router.post("/", protect, createRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;