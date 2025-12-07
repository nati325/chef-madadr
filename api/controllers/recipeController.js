/// server/controllers/recipeController.js
import Recipe from "../models/recipeModel.js";

// =============================
//     CREATE RECIPE
// =============================
export const createRecipe = async (req, res) => {
  try {
    const userId = req.user._id; // Who created? (comes from protect Middleware)

    const recipe = new Recipe({
      ...req.body,
      userId,
    });

    await recipe.save();
    
    // Populate userId to return full user details
    await recipe.populate("userId", "name email");
    
    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// =============================
//     GET ALL RECIPES
// =============================
export const getRecipes = async (req, res) => {
  try {
    console.log('Getting all recipes...');
    const recipes = await Recipe.find().populate("userId", "name email");
    console.log(`Found ${recipes.length} recipes`);
    console.log('Sample recipe:', recipes[0]); // Debug
    res.json(recipes);
  } catch (err) {
    console.error('Error in getRecipes:', err.message); // Debug
    res.status(500).json({ error: err.message });
  }
};

// =============================
//     GET RECIPE BY ID
// =============================
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("userId", "name email");

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
//     UPDATE RECIPE  (maintains permissions)
// =============================
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // 🔒 Check ownership or admin
    const isOwner = recipe.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You don't have permission to update this recipe" });
    }

    Object.assign(recipe, req.body); // Update
    await recipe.save();
    
    // Populate userId to return complete user details
    await recipe.populate("userId", "name email");

    res.json({ message: "Recipe updated successfully", recipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
//     DELETE RECIPE (maintains permissions)
// =============================
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // 🔒 Check ownership or admin
    const isOwner = recipe.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "You don't have permission to delete this recipe" });
    }

    await recipe.deleteOne();

    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =============================
//     GET MY RECIPES (current user's recipes)
// =============================
export const getMyRecipes = async (req, res) => {
  try {
    const userId = req.user._id;
    const recipes = await Recipe.find({ userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};