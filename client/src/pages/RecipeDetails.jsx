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
          setError("מתכון לא נמצא");
        }
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת המתכון");
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
      <div style={styles.container}>
        <p style={styles.message}>טוען מתכון...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error || "מתכון לא נמצא"}</p>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          חזור
        </button>
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

  const isFavorite = favorites.some((fav) => fav.idMeal === recipeId || fav._id === recipeId);

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.backBtnTop}>
        ← חזור
      </button>

      {/* תמונת המתכון */}
      <div style={styles.imageWrapper}>
        <img
          src={recipeImage || 'https://via.placeholder.com/800x400?text=No+Image'}
          alt={recipeTitle}
          style={styles.image}
        />

        {/* כפתור לב */}
        <button
          style={{
            ...styles.favoriteBtn,
            background: isFavorite ? "rgba(255, 201, 71, 0.9)" : "rgba(45, 24, 16, 0.9)",
            borderColor: isFavorite ? "#ffc947" : "rgba(255, 140, 66, 0.6)",
            transform: isFavorite ? "scale(1.1)" : "scale(1)",
          }}
          onClick={() => toggleFavorite(recipe)}
          title={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      {/* תוכן המתכון */}
      <div style={styles.content}>
        <h1 style={styles.title}>{recipeTitle}</h1>

        {/* מטא-דאטה */}
        <div style={styles.meta}>
          {recipeCategory && (
            <span style={styles.badge}>📂 {recipeCategory}</span>
          )}
          {recipeArea && (
            <span style={styles.badge}>🌍 {recipeArea}</span>
          )}
          {recipeDifficulty && (
            <span style={styles.badge}>⭐ {recipeDifficulty}</span>
          )}
          {recipeTime && (
            <span style={styles.badge}>⏱️ {recipeTime} דקות</span>
          )}
          {!isUserRecipe && recipe.strTags && (
            <span style={styles.badge}>🏷️ {recipe.strTags}</span>
          )}
        </div>

        {/* מרכיבים + הוראות הכנה בשורה אחת */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
          {/* מרכיבים */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🥘 מרכיבים</h2>
            <ul style={styles.ingredientsList}>
              {ingredients.length > 0 ? (
                ingredients.map((ing, idx) => (
                  <li key={idx} style={styles.ingredient}>
                    • {ing}
                  </li>
                ))
              ) : (
                <p style={{ color: '#d4b896' }}>אין מרכיבים</p>
              )}
            </ul>
          </div>

          {/* הוראות הכנה */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>👨‍🍳 הוראות הכנה</h2>
            <div style={styles.instructions}>
              {recipeInstructions || 'אין הוראות הכנה'}
            </div>

            {/* וידאו (אם קיים) */}
            {recipeVideo && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <a
                  href={recipeVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="details-video-link"
                >
                  🎥 צפה בסרטון הכנה
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;

// 🎨 STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1f1410, #2a1915)",
    color: "#f5e6d3",
    paddingTop: "calc(var(--nav-height, 70px) + 20px)",
    paddingBottom: "40px",
  },
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "var(--nav-height, 70px)",
  },
  message: {
    fontSize: "18px",
    color: "#f5e6d3",
  },
  error: {
    fontSize: "18px",
    color: "#ff8c42",
    marginBottom: "20px",
  },
  backBtn: {
    padding: "10px 24px",
    background: "rgba(255, 140, 66, 0.2)",
    border: "1px solid rgba(255, 140, 66, 0.5)",
    borderRadius: "8px",
    color: "#ffc947",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  backBtnTop: {
    position: "fixed",
    top: "calc(var(--nav-height, 70px) + 20px)",
    left: "20px",
    padding: "10px 20px",
    background: "rgba(45, 24, 16, 0.9)",
    border: "1px solid rgba(255, 140, 66, 0.4)",
    borderRadius: "8px",
    color: "#ffc947",
    fontSize: "16px",
    cursor: "pointer",
    zIndex: 100,
    transition: "all 0.3s ease",
  },
  imageWrapper: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto 30px",
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(29, 15, 10, 0.8)",
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "350px",
    objectFit: "cover",
    display: "block",
  },
  favoriteBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "rgba(45, 24, 16, 0.9)",
    border: "2px solid rgba(255, 140, 66, 0.6)",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "32px",
    transition: "transform 0.2s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  title: {
    fontSize: "clamp(24px, 4vw, 32px)",
    fontWeight: "700",
    marginBottom: "16px",
    textAlign: "center",
    color: "#ffc947",
    textShadow: "0 2px 10px rgba(255, 201, 71, 0.3)",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "40px",
  },
  badge: {
    padding: "6px 12px",
    background: "rgba(255, 140, 66, 0.15)",
    border: "1px solid rgba(255, 140, 66, 0.4)",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#ffc947",
  },
  section: {
    marginBottom: "0",
    background: "rgba(45, 24, 16, 0.5)",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 140, 66, 0.2)",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#ff8c42",
  },
  ingredientsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  ingredient: {
    padding: "8px 12px",
    background: "rgba(255, 140, 66, 0.1)",
    borderRadius: "8px",
    fontSize: "13px",
    borderLeft: "3px solid #ff8c42",
  },
  instructions: {
    fontSize: "13px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    color: "#f5e6d3",
  },
  instructionsList: {
    listStyle: "decimal",
    paddingRight: "20px",
    margin: 0,
    color: "#f5e6d3",
  },
  instructionItem: {
    fontSize: "13px",
    lineHeight: "1.6",
    marginBottom: "10px",
    color: "#f5e6d3",
  },
};
