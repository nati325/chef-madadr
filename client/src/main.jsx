// src/main.jsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { RecipesProvider } from "./context/RecipesContext.jsx";
import "./index.css";
import App from "./App.jsx";

console.log("Spoonacular Key:", import.meta.env.VITE_SPOONACULAR_KEY);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <RecipesProvider>
          <App />
        </RecipesProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>
);