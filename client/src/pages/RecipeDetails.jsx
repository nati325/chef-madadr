import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { getRecipeById } from "../apirecipe/userRecipesApi";
import "./details.css";

function RecipeDetails() {
  const { id } = useParams(); // מזהה המתכון מה-URL
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUserRecipe, setIsUserRecipe] = useState(false);

  useEffect(() => {
    async function loadRecipe() {
      try {
        setLoading(true);

        // Try to load from MongoDB first (user recipes)
        if (id.length === 24) { // MongoDB ID length
          try {
            const userRecipe = await getRecipeById(id);
            setRecipe(userRecipe);
            setIsUserRecipe(true);
            setLoading(false);
            return;
          } catch (err) {
            console.log('Not a user recipe, trying TheMealDB...');
          }
        }

        // If not found in MongoDB, try TheMealDB
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await res.json();

        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
          setIsUserRecipe(false);
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading recipe");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="recipe-details-page">
        <p className="details-message">Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-details-page">
        <p className="details-error">{error || "Recipe not found"}</p>
        <div className="back-btn-container" style={{ textAlign: 'center' }}>
          <button onClick={() => navigate(-1)} className="details-back-button">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // חילוץ מרכיבים (ingredients)
  const ingredients = [];

  if (isUserRecipe) {
    // MongoDB recipe - ingredients is an array of {name, amount}
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      recipe.ingredients.forEach(ing => {
        ingredients.push(`${ing.amount} ${ing.name}`);
      });
    }
  } else {
    // TheMealDB recipe - ingredients are in strIngredient1, strIngredient2, etc.
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure + " " : ""}${ingredient}`);
      }
    }
  }

  // Get recipe ID and title
  const recipeId = isUserRecipe ? recipe._id : recipe.idMeal;
  const recipeTitle = isUserRecipe ? recipe.title : recipe.strMeal;
  const recipeImage = isUserRecipe ? recipe.image : recipe.strMealThumb;
  const recipeInstructions = isUserRecipe ? recipe.instructions : recipe.strInstructions;
  const recipeCategory = isUserRecipe ? recipe.categories?.join(', ') : recipe.strCategory;
  const recipeDifficulty = isUserRecipe ? recipe.difficulty : null;
  const recipeTime = isUserRecipe ? recipe.readyInMinutes : null;
  const recipeArea = isUserRecipe ? 'User Recipe' : recipe.strArea;
  const recipeVideo = isUserRecipe ? null : recipe.strYoutube;

  const isFavorite = favorites.includes(recipeId);

  return (
    <div className="recipe-details-page">
      <div className="recipe-container">


        {/* Hero Section */}
        <div className="recipe-hero">
          <img
            src={recipeImage || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={recipeTitle}
            className="recipe-image"
          />

          <button
            className="recipe-favorite-btn"
            onClick={() => toggleFavorite(recipeId)}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Main Content */}
        <div className="recipe-content">
          <div className="recipe-header">
            <h1 className="recipe-title">{recipeTitle}</h1>

            <div className="recipe-meta">
              {recipeCategory && (
                <span className="meta-badge">📂 {recipeCategory}</span>
              )}
              {recipeArea && (
                <span className="meta-badge">🌍 {recipeArea}</span>
              )}
              {recipeDifficulty && (
                <span className="meta-badge">⭐ {recipeDifficulty}</span>
              )}
              {recipeTime && (
                <span className="meta-badge">⏱️ {recipeTime} min</span>
              )}
              {!isUserRecipe && recipe.strTags && (
                <span className="meta-badge">🏷️ {recipe.strTags}</span>
              )}
            </div>
          </div>

          <div className="recipe-content-grid">
            {/* Ingredients */}
            <div className="recipe-section">
              <h2 className="recipe-section-title">🥘 Ingredients</h2>
              <ul className="ingredients-list">
                {ingredients.length > 0 ? (
                  ingredients.map((ing, idx) => (
                    <li key={idx} className="ingredient-item">
                      <span className="ingredient-bullet">•</span> {ing}
                    </li>
                  ))
                ) : (
                  <p>No ingredients listed.</p>
                )}
              </ul>
            </div>

            {/* Instructions */}
            <div className="recipe-section">
              <h2 className="recipe-section-title">👨‍🍳 Instructions</h2>
              <div className="instructions-text">
                {recipeInstructions || 'No instructions provided.'}
              </div>

              {/* Video Link */}
              {recipeVideo && (
                <div className="video-link-container">
                  <a
                    href={recipeVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    🎥 Watch Video Tutorial
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
