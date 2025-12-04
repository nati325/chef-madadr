import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import RecipeCard from "../components/RecipeCard";
import RecipeCarousel from "../components/RecipeCarusel.jsx";
import { fetchHomeRecipes } from "../apirecipe/recipesApi.js";
import "./home.css";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await fetchHomeRecipes();  // Returns TheMealDB objects
        setRecipes(data || []);
        console.log("Recipes from API:", data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  // --- Filters by TheMealDB fields ---

  // By category (strCategory)
  const beefRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "beef"
  );

  const chickenRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "chicken"
  );

  const dessertRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "dessert"
  );

  const lambRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "lamb"
  );

  const pastaRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "pasta"
  );

  const porkRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "pork"
  );

  const seafoodRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "seafood"
  );

  const sideRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "side"
  );

  const starterRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "starter"
  );

  const veganRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "vegan"
  );

  const vegetarianRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "vegetarian"
  );

  const breakfastRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "breakfast"
  );

  const miscRecipes = recipes.filter(
    (r) => r.strCategory && r.strCategory.toLowerCase() === "miscellaneous"
  );

  // By area (strArea)
  const americanRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "american"
  );

  const britishRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "british"
  );

  const chineseRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "chinese"
  );

  const frenchRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "french"
  );

  const indianRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "indian"
  );

  const italianRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "italian"
  );

  const mexicanRecipes = recipes.filter(
    (r) => r.strArea && r.strArea.toLowerCase() === "mexican"
  );

  return (
    <main>
      <Hero />

      <div className="home-content">
        {loading && <p>Loading recipes...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && !error && (
          <>
            {/* 1–13: לפי קטגוריה */}
            <div>
              <RecipeCarousel title="Beef Recipes" recipes={beefRecipes} />
            </div>
            <RecipeCarousel title="Chicken Recipes" recipes={chickenRecipes} />
            <RecipeCarousel title="Dessert Recipes" recipes={dessertRecipes} />
            <RecipeCarousel title="Lamb Recipes" recipes={lambRecipes} />
            <RecipeCarousel title="Pasta Recipes" recipes={pastaRecipes} />
            <RecipeCarousel title="Pork Recipes" recipes={porkRecipes} />
            <RecipeCarousel title="Seafood Recipes" recipes={seafoodRecipes} />
            <RecipeCarousel title="Side Dishes" recipes={sideRecipes} />
            <RecipeCarousel title="Starters" recipes={starterRecipes} />
            <RecipeCarousel title="Vegan Recipes" recipes={veganRecipes} />
            <RecipeCarousel title="Vegetarian Recipes" recipes={vegetarianRecipes} />
            <RecipeCarousel title="Breakfast Recipes" recipes={breakfastRecipes} />
            <RecipeCarousel title="Miscellaneous Recipes" recipes={miscRecipes} />

            {/* 14–20: לפי אזור */}
            <RecipeCarousel title="American Recipes" recipes={americanRecipes} />
            <RecipeCarousel title="British Recipes" recipes={britishRecipes} />
            <RecipeCarousel title="Chinese Recipes" recipes={chineseRecipes} />
            <RecipeCarousel title="French Recipes" recipes={frenchRecipes} />
            <RecipeCarousel title="Indian Recipes" recipes={indianRecipes} />
            <RecipeCarousel title="Italian Recipes" recipes={italianRecipes} />
            <RecipeCarousel title="Mexican Recipes" recipes={mexicanRecipes} />
          </>
        )}
      </div>
    </main>
  );
}

export default Home;
