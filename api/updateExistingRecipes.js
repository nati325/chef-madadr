// updateExistingRecipes.js - Update existing recipes with real content
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from './models/recipeModel.js';

dotenv.config();

const realRecipeData = [
  {
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    description: "A simple and delicious pizza with fresh mozzarella, tomatoes, and basil.",
    readyInMinutes: 30,
    difficulty: "Easy",
    ingredients: [
      { name: "Pizza dough", amount: "1 ball" },
      { name: "Tomato sauce", amount: "1/2 cup" },
      { name: "Fresh mozzarella", amount: "200g" },
      { name: "Fresh basil leaves", amount: "10 leaves" },
      { name: "Olive oil", amount: "2 tbsp" },
      { name: "Salt", amount: "to taste" }
    ],
    instructions: [
      "Preheat oven to 230°C (450°F).",
      "Roll out pizza dough on a floured surface.",
      "Spread tomato sauce evenly over the dough.",
      "Tear mozzarella and distribute over the sauce.",
      "Bake for 12-15 minutes until crust is golden.",
      "Remove from oven, add fresh basil leaves and drizzle with olive oil."
    ],
    categories: ["Italian", "Vegetarian"]
  },
  {
    title: "Creamy Carbonara Pasta",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500",
    description: "Traditional Italian pasta with eggs, cheese, pancetta, and black pepper.",
    readyInMinutes: 25,
    difficulty: "Medium",
    ingredients: [
      { name: "Spaghetti", amount: "400g" },
      { name: "Pancetta", amount: "150g" },
      { name: "Eggs", amount: "4 large" },
      { name: "Parmesan cheese", amount: "100g grated" },
      { name: "Black pepper", amount: "2 tsp freshly ground" },
      { name: "Salt", amount: "to taste" }
    ],
    instructions: [
      "Cook spaghetti in salted boiling water according to package instructions.",
      "While pasta cooks, fry pancetta until crispy.",
      "In a bowl, whisk together eggs and parmesan cheese.",
      "Drain pasta, reserving 1 cup of pasta water.",
      "Add hot pasta to pancetta, remove from heat.",
      "Quickly mix in egg mixture, adding pasta water to create creamy sauce.",
      "Season with black pepper and serve immediately."
    ],
    categories: ["Italian", "Pasta"]
  },
  {
    title: "Chocolate Chip Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500",
    description: "Soft and chewy chocolate chip cookies with a crispy edge.",
    readyInMinutes: 45,
    difficulty: "Easy",
    ingredients: [
      { name: "All-purpose flour", amount: "2 1/4 cups" },
      { name: "Butter", amount: "1 cup softened" },
      { name: "Brown sugar", amount: "3/4 cup" },
      { name: "White sugar", amount: "3/4 cup" },
      { name: "Eggs", amount: "2" },
      { name: "Vanilla extract", amount: "2 tsp" },
      { name: "Baking soda", amount: "1 tsp" },
      { name: "Salt", amount: "1 tsp" },
      { name: "Chocolate chips", amount: "2 cups" }
    ],
    instructions: [
      "Preheat oven to 180°C (350°F).",
      "Cream together butter and both sugars until fluffy.",
      "Beat in eggs and vanilla extract.",
      "In separate bowl, mix flour, baking soda, and salt.",
      "Gradually blend dry ingredients into butter mixture.",
      "Stir in chocolate chips.",
      "Drop rounded tablespoons of dough onto baking sheets.",
      "Bake 10-12 minutes until golden brown.",
      "Cool on baking sheet for 2 minutes before transferring."
    ],
    categories: ["Dessert", "Baking"]
  },
  {
    title: "Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500",
    description: "Crisp romaine lettuce with creamy Caesar dressing and parmesan.",
    readyInMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Romaine lettuce", amount: "2 heads" },
      { name: "Parmesan cheese", amount: "1 cup shaved" },
      { name: "Croutons", amount: "2 cups" },
      { name: "Caesar dressing", amount: "1/2 cup" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Black pepper", amount: "to taste" }
    ],
    instructions: [
      "Wash and chop romaine lettuce into bite-sized pieces.",
      "Place lettuce in large bowl.",
      "Add Caesar dressing and toss to coat.",
      "Add croutons and mix gently.",
      "Top with shaved parmesan cheese.",
      "Drizzle with lemon juice and season with black pepper.",
      "Serve immediately."
    ],
    categories: ["Salad", "Healthy"]
  },
  {
    title: "Beef Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500",
    description: "Seasoned ground beef in crispy taco shells with fresh toppings.",
    readyInMinutes: 30,
    difficulty: "Easy",
    ingredients: [
      { name: "Ground beef", amount: "500g" },
      { name: "Taco shells", amount: "12" },
      { name: "Taco seasoning", amount: "2 tbsp" },
      { name: "Lettuce", amount: "2 cups shredded" },
      { name: "Tomatoes", amount: "2 diced" },
      { name: "Cheddar cheese", amount: "1 cup shredded" },
      { name: "Sour cream", amount: "1/2 cup" }
    ],
    instructions: [
      "Brown ground beef in a large skillet over medium heat.",
      "Drain excess fat.",
      "Add taco seasoning and 1/2 cup water, simmer for 5 minutes.",
      "Warm taco shells in oven according to package directions.",
      "Fill each taco shell with seasoned beef.",
      "Top with lettuce, tomatoes, cheese, and sour cream.",
      "Serve immediately."
    ],
    categories: ["Mexican", "Quick"]
  },
  {
    title: "Chicken Stir Fry",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
    description: "Quick and healthy stir-fried chicken with colorful vegetables.",
    readyInMinutes: 20,
    difficulty: "Easy",
    ingredients: [
      { name: "Chicken breast", amount: "500g sliced" },
      { name: "Bell peppers", amount: "2 sliced" },
      { name: "Broccoli", amount: "2 cups florets" },
      { name: "Soy sauce", amount: "3 tbsp" },
      { name: "Garlic", amount: "3 cloves minced" },
      { name: "Ginger", amount: "1 tbsp minced" },
      { name: "Vegetable oil", amount: "2 tbsp" }
    ],
    instructions: [
      "Heat oil in a large wok or skillet over high heat.",
      "Add chicken and stir-fry for 5 minutes until cooked.",
      "Remove chicken and set aside.",
      "Add garlic and ginger, stir for 30 seconds.",
      "Add bell peppers and broccoli, stir-fry for 3 minutes.",
      "Return chicken to pan, add soy sauce.",
      "Toss everything together for 2 minutes.",
      "Serve with rice."
    ],
    categories: ["Asian", "Healthy"]
  },
  {
    title: "Blueberry Pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
    description: "Fluffy pancakes loaded with fresh blueberries.",
    readyInMinutes: 25,
    difficulty: "Easy",
    ingredients: [
      { name: "All-purpose flour", amount: "2 cups" },
      { name: "Milk", amount: "1 3/4 cups" },
      { name: "Eggs", amount: "2" },
      { name: "Sugar", amount: "2 tbsp" },
      { name: "Baking powder", amount: "2 tsp" },
      { name: "Salt", amount: "1/2 tsp" },
      { name: "Butter", amount: "4 tbsp melted" },
      { name: "Fresh blueberries", amount: "1 cup" }
    ],
    instructions: [
      "Mix flour, sugar, baking powder, and salt in a bowl.",
      "In another bowl, whisk together milk, eggs, and melted butter.",
      "Pour wet ingredients into dry ingredients, mix until just combined.",
      "Gently fold in blueberries.",
      "Heat griddle over medium heat and grease lightly.",
      "Pour 1/4 cup batter for each pancake.",
      "Cook until bubbles form, then flip and cook other side.",
      "Serve warm with maple syrup."
    ],
    categories: ["Breakfast", "Sweet"]
  },
  {
    title: "Greek Salad",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500",
    description: "Fresh Mediterranean salad with feta cheese and olives.",
    readyInMinutes: 15,
    difficulty: "Easy",
    ingredients: [
      { name: "Cucumbers", amount: "2 diced" },
      { name: "Tomatoes", amount: "4 diced" },
      { name: "Red onion", amount: "1 sliced thin" },
      { name: "Feta cheese", amount: "200g crumbled" },
      { name: "Kalamata olives", amount: "1 cup" },
      { name: "Olive oil", amount: "1/4 cup" },
      { name: "Lemon juice", amount: "2 tbsp" },
      { name: "Oregano", amount: "1 tsp dried" }
    ],
    instructions: [
      "Combine cucumbers, tomatoes, and red onion in a large bowl.",
      "Add olives and feta cheese.",
      "In a small bowl, whisk together olive oil, lemon juice, and oregano.",
      "Pour dressing over salad and toss gently.",
      "Season with salt and pepper to taste.",
      "Let sit for 10 minutes before serving."
    ],
    categories: ["Salad", "Greek", "Vegetarian"]
  }
];

async function updateExistingRecipes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all existing recipes
    const existingRecipes = await Recipe.find().sort({ createdAt: 1 });
    console.log(`Found ${existingRecipes.length} existing recipes`);

    if (existingRecipes.length === 0) {
      console.log('No recipes to update');
      process.exit(0);
    }

    let updatedCount = 0;

    // Update each recipe with real data
    for (let i = 0; i < existingRecipes.length; i++) {
      const recipe = existingRecipes[i];
      const newData = realRecipeData[i % realRecipeData.length]; // Cycle through data

      recipe.title = newData.title + (i >= realRecipeData.length ? ` ${Math.floor(i / realRecipeData.length) + 1}` : '');
      recipe.image = newData.image;
      recipe.description = newData.description;
      recipe.readyInMinutes = newData.readyInMinutes;
      recipe.difficulty = newData.difficulty;
      recipe.ingredients = newData.ingredients;
      recipe.instructions = newData.instructions;
      recipe.categories = newData.categories;

      await recipe.save();
      updatedCount++;
      console.log(`✅ Updated: ${recipe.title}`);
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} recipes!`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating recipes:', error);
    process.exit(1);
  }
}

updateExistingRecipes();
