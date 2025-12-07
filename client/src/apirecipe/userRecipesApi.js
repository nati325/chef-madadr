// API calls for user-created recipes (MongoDB)
const API_URL = "http://localhost:5000/api/recipes";

// Create a new recipe (requires authentication)
export async function createRecipe(token, recipeData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Server error response:', error); // Debug
    throw new Error(error.error || error.message || "Failed to create recipe");
  }

  return response.json();
}

// Get all user recipes (community recipes)
export async function getAllRecipes() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return response.json();
}

// Get current user's recipes only
export async function getMyRecipes(token) {
  const response = await fetch(`${API_URL}/my/recipes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch your recipes");
  }

  return response.json();
}

// Get a single recipe by ID
export async function getRecipeById(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Recipe not found");
  }

  return response.json();
}

// Update a recipe (requires authentication and ownership)
export async function updateRecipe(token, id, recipeData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update recipe");
  }

  return response.json();
}

// Delete a recipe (requires authentication and ownership)
export async function deleteRecipe(token, id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete recipe");
  }

  return response.json();
}
