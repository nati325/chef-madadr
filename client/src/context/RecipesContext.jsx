import { createContext, useContext, useEffect, useState } from "react";
import { getAllRecipes } from "../apirecipe/userRecipesApi.js";

const RecipesContext = createContext();

export function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (err) {
      console.error("Failed to load recipes", err);
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = (newRecipe) => {
    setRecipes((prev) => [...prev, newRecipe]);
  };

  const updateRecipe = (recipeId, updatedRecipe) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe._id === recipeId ? { ...recipe, ...updatedRecipe } : recipe
      )
    );
  };

  const removeRecipe = (recipeId) => {
    setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        loading,
        addRecipe,
        updateRecipe,
        removeRecipe,
        refreshRecipes: loadRecipes,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  return useContext(RecipesContext);
}
