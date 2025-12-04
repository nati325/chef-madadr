// src/context/FavoritesContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { toggleFavoriteApi, getMyFavoritesApi } from "../apirecipe/userApi.js";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await getMyFavoritesApi(token);
        setFavorites(data.favoriteMeals || []);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  const toggleFavorite = async (mealId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add to favorites 😊");
      return;
    }

    // עדכון אופטימי
    setFavorites((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );

    try {
      const res = await toggleFavoriteApi(mealId, token);
      if (res.favoriteMeals) {
        setFavorites(res.favoriteMeals);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
