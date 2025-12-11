import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

function RecipeCard({ recipe }) {
  const { favorites, toggleFavorite } = useFavorites();
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= 769);

  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 769;
      console.log('Window width:', window.innerWidth, 'isDesktop:', newIsDesktop);
      setIsDesktop(newIsDesktop);
    };
    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!recipe) {
    console.log('RecipeCard: No recipe provided');
    return null;
  }

  console.log('RecipeCard rendering:', recipe.title || recipe.name); // Debug

  const title =
    recipe.title || recipe.name || recipe.strMeal || "Untitled recipe";

  const image =
    recipe.image || recipe.img || recipe.strMealThumb || "";

  const category =
    recipe.category || recipe.strCategory || "";

  const area =
    recipe.area || recipe.strArea || "";

  const time =
    recipe.readyInMinutes || recipe.cookingTime || null;

  // מזהה יחודי למתכון – ב-TheMealDB זה בדרך כלל idMeal
  const id = recipe.idMeal || recipe._id || recipe.id;

  const isFavorite = favorites.includes(id);

  const handleHeartClick = (e) => {
    e.preventDefault(); // מונע ניווט
    e.stopPropagation(); // שלא ילחץ על כרטיס/ניווט
    if (!id) return;
    toggleFavorite(id);
  };

  return (
    <Link
      to={`/recipe/${id}`}
      className="recipe-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 26px rgba(255, 140, 66, 0.4)";
        e.currentTarget.style.border = "1px solid rgba(255, 140, 66, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(29, 15, 10, 0.8)";
        e.currentTarget.style.border = "1px solid rgba(255, 140, 66, 0.2)";
      }}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(74, 47, 31, 0.5), rgba(45, 24, 16, 0.8))",
        borderRadius: isDesktop ? "16px" : "12px",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(29, 15, 10, 0.8)",
        border: "1px solid rgba(255, 140, 66, 0.2)",
        transition: "all 0.3s ease",
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        aspectRatio: "0.85 / 1",
      }}
    >
      <div className="image-wrapper" style={{ position: "relative", flex: "1", flexShrink: 0 }}>
        {image ? (
          <img
            src={image}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #4a2f1f, #2d1810)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffc947",
            fontSize: isDesktop ? "48px" : "24px"
          }}>
            🍽️
          </div>
        )}

        {/* הכפתור של הלב */}
        <button
          onClick={handleHeartClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          style={{
            position: "absolute",
            top: isDesktop ? "8px" : "3px",
            right: isDesktop ? "8px" : "3px",
            background: "rgba(45, 24, 16, 0.85)",
            border: "1px solid rgba(255, 140, 66, 0.6)",
            borderRadius: "50%",
            width: isDesktop ? "32px" : "18px",
            height: isDesktop ? "32px" : "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isDesktop ? "16px" : "10px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
          }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div style={{
        padding: isDesktop ? "12px 16px 16px" : "3px 5px 5px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.5) 100%)",
        backdropFilter: "blur(12px)"
      }}>
        <h3 style={{
          fontSize: isDesktop ? "18px" : "9px",
          margin: isDesktop ? "0 0 8px" : "0 0 2px",
          color: "#f5e6d3",
          lineHeight: "1.1",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          fontWeight: "600",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)"
        }}>{title}</h3>
        <div style={{
          fontSize: isDesktop ? "16px" : "7px",
          color: "#ffc947",
          display: "flex",
          justifyContent: "space-between",
          gap: isDesktop ? "8px" : "2px",
        }}>
          {category && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{category}</span>}
          {area && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{area}</span>}
        </div>
      </div>
    </Link>
  );
}

export default RecipeCard;
