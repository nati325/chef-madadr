import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { useFavorites } from "../context/FavoritesContext.jsx";
import "./RecipesAZ.css";

const RecipesAZ = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");   // Single search
  const [filterBy, setFilterBy] = useState("name");   // name | category | area
  const [error, setError] = useState("");

  // Load all recipes A-Z
  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      setError("");
      const letters = "abcdefghijklmnopqrstuvwxyz";
      const allMeals = [];

      try {
        for (let letter of letters) {
          const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
          );
          const data = await res.json();
          if (data.meals) allMeals.push(...data.meals);
        }
        setMeals(allMeals);
        setFilteredMeals(allMeals);
      } catch (err) {
        console.error("Error:", err);
        setError("Problem loading data from server");
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  // 🔍 Filtering – one search + selected field
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMeals(meals);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = meals.filter((meal) => {
      if (filterBy === "name") {
        return meal.strMeal?.toLowerCase().includes(term);
      }
      if (filterBy === "category") {
        return meal.strCategory?.toLowerCase().includes(term);
      }
      if (filterBy === "area") {
        return meal.strArea?.toLowerCase().includes(term);
      }
      return true;
    });

    setFilteredMeals(result);
  }, [meals, searchTerm, filterBy]);

  // 🎨 Modern black style + floating search
  const styles = {
    page: {
      minHeight: "100vh",
      margin: 0,
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background:
        "radial-gradient(circle at top, #4a2f1f 0, transparent 55%), linear-gradient(180deg, #1f1410, #2a1915)",
      color: "#f5e6d3",
      boxSizing: "border-box",
      paddingTop: "calc(var(--nav-height, 70px) + 90px)", // Space for nav + search
      paddingInline: "10px",
      paddingBottom: "32px",
    },

    // Floating top search
    searchBoxTopWrapper: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      position: "fixed",
      top: "var(--nav-height, 70px)",
      left: 0,
      right: 0,
      zIndex: 400,
      padding: "8px 10px",
      boxSizing: "border-box",
    },
    searchBoxTop: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "rgba(45, 24, 16, 0.98)",
      backdropFilter: "blur(12px)",
      borderRadius: 50,
      padding: "12px 20px",
      boxShadow: "0 8px 32px rgba(255, 140, 66, 0.3), 0 2px 8px rgba(0, 0, 0, 0.5)",
      border: "2px solid rgba(255, 140, 66, 0.4)",
      flex: 1,
      maxWidth: 700,
      transition: "all 0.3s ease",
    },
    searchIcon: {
      fontSize: 18,
      opacity: 0.85,
    },
    inputTop: {
      flex: 1,
      background: "transparent",
      border: "none",
      outline: "none",
      color: "#f5e6d3",
      fontSize: 16,
      minWidth: 0,
      fontWeight: 400,
    },
    selectTop: {
      borderRadius: 20,
      border: "1px solid rgba(255, 140, 66, 0.5)",
      background: "rgba(45, 24, 16, 0.95)",
      color: "#ffc947",
      fontSize: 14,
      padding: "8px 14px",
      outline: "none",
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.2s ease",
    },

    headerRow: {
      maxWidth: 1200,
      margin: "0 auto 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingInline: 4,
    },
    pageTitle: {
      margin: 0,
      fontSize: "clamp(18px, 3vw, 22px)",
      fontWeight: 600,
      letterSpacing: "0.03em",
    },
    pageSub: {
      margin: 0,
      fontSize: 12,
      opacity: 0.7,
    },

    statusRow: {
      maxWidth: 1200,
      margin: "0 auto 10px",
      paddingInline: 6,
      fontSize: 12,
      opacity: 0.8,
      display: "flex",
      justifyContent: "space-between",
      gap: 8,
    },

    container: {
      maxWidth: 1400,
      margin: "0 auto",
      padding: "0 20px",
      display: "grid",
      gap: 24,
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    },
    card: {
      background: "linear-gradient(145deg, #3d2817, #2d1810)",
      borderRadius: 16,
      color: "#f5e6d3",
      overflow: "hidden",
      boxShadow: "0 8px 20px rgba(29, 15, 10, 0.8)",
      transition: "transform 0.18s ease, box-shadow 0.18s ease, border 0.18s",
      cursor: "pointer",
      border: "1px solid rgba(255, 140, 66, 0.2)",
      position: "relative",
    },
    favoriteBtn: {
      position: "absolute",
      top: 8,
      right: 8,
      background: "rgba(45, 24, 16, 0.8)",
      border: "none",
      borderRadius: "50%",
      width: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 18,
      transition: "transform 0.2s ease",
      zIndex: 10,
    },
    img: {
      width: "100%",
      height: 150,
      objectFit: "cover",
      display: "block",
    },
    cardBody: {
      padding: "10px 12px 12px",
    },
    cardTitle: {
      fontSize: 16,
      margin: "0 0 6px",
    },
    cardMeta: {
      fontSize: 12,
      color: "#ffc947",
      display: "flex",
      justifyContent: "space-between",
      gap: 6,
      marginBottom: 6,
    },
    cardText: {
      fontSize: 12,
      color: "#f5e6d3",
      lineHeight: 1.4,
      maxHeight: "3.2em",
      overflow: "hidden",
    },

    emptyText: {
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
      opacity: 0.8,
    },
    errorText: {
      textAlign: "center",
      marginTop: 40,
      fontSize: 14,
      color: "#ff8c42",
    },
    
    // Responsive
    "@media (max-width: 768px)": {
      container: {
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 16,
        padding: "0 15px",
      },
      searchBoxTop: {
        maxWidth: "95%",
        padding: "10px 16px",
      },
    },
    "@media (max-width: 480px)": {
      container: {
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 12,
        padding: "0 10px",
      },
      searchBoxTop: {
        flexDirection: "column",
        gap: 8,
      },
    },
  };

  return (
    <div className="recipes-page">
      {/* 🔍 Search */}
      <div className="search-box-wrapper">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search recipe..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="search-select"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="name">By Name</option>
            <option value="category">By Category</option>
            <option value="area">By Area</option>
          </select>
        </div>
      </div>

      {/* Status */}
      <div className="status-row">
        <span>
          {loading
            ? "Loading recipes..."
            : error
            ? ""
            : `Total ${meals.length} recipes, currently showing ${filteredMeals.length}`}
        </span>
      </div>

      {/* Cards */}
      {error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="recipes-container">
          {!loading && filteredMeals.length === 0 ? (
            <p className="empty-text">No recipes found matching your search.</p>
          ) : (
            filteredMeals.map((meal) => (
              <RecipeCard key={meal.idMeal} recipe={meal} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecipesAZ;
