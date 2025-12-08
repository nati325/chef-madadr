import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe } from '../apirecipe/userRecipesApi';
import { useRecipes } from '../context/RecipesContext.jsx';
import RecipeCard from '../components/RecipeCard';
import './CommunityRecipes.css';

export default function CommunityRecipes() {
  const { recipes, loading, removeRecipe } = useRecipes();
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to parse user:', err);
      }
    }
  }, []);

  const handleDelete = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    // 👇 עדכון אופטימי - מוחק מיידית מה-Context
    removeRecipe(recipeId);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete recipes');
        return;
      }

      await deleteRecipe(token, recipeId);
      alert('Recipe deleted successfully!');
    } catch (err) {
      alert(err.message || 'Failed to delete recipe');
      // במקרה של שגיאה, ניתן לטעון מחדש את כל המתכונים
    }
  };

  const isOwnerOrAdmin = (recipe) => {
    if (!currentUser) return false;

    // Check if admin
    if (currentUser.isAdmin) return true;

    // Check if owner
    const recipeUserId = recipe.userId?._id || recipe.userId;
    return recipeUserId === currentUser._id || recipeUserId === currentUser.id;
  };

  if (loading) {
    return (
      <div className="community-page">
        <div className="loading">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="header-section">
          <h1 className="page-title">Community Recipes</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {recipes.length === 0 ? (
          <div className="empty-state">
            <p>No recipes yet.</p>
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => {
              return (
                <div key={recipe._id} className="recipe-card-wrapper">
                  <RecipeCard recipe={recipe} />

                  {isOwnerOrAdmin(recipe) && (
                    <div className="recipe-actions">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/edit-recipe/${recipe._id}`);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(recipe._id);
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
