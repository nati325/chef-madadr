import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, updateRecipe } from '../api/userRecipesApi.js';
import { useRecipes } from '../context/RecipesContext.jsx';
import './AddRecipe.css';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateRecipe: updateRecipeInContext } = useRecipes();
  
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [readyInMinutes, setReadyInMinutes] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(id);
        
        // Populate form with existing data
        setTitle(recipe.title || '');
        setImage(recipe.image || '');
        setDescription(recipe.description || '');
        setReadyInMinutes(recipe.readyInMinutes || '');
        setDifficulty(recipe.difficulty || 'Easy');
        setIngredients(recipe.ingredients && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : [{ name: '', amount: '' }]);
        setInstructions(recipe.instructions && recipe.instructions.length > 0 
          ? recipe.instructions 
          : ['']);
        setCategories(recipe.categories || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading recipe:', err);
        setError('Failed to load recipe');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Ingredient functions
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Instruction functions
  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  // Category functions
  const addCategory = () => {
    setCategories([...categories, '']);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  // Validation
  const validate = () => {
    if (!title.trim()) {
      setError('Please enter a title for the recipe.');
      return false;
    }
    if (!image.trim()) {
      setError('Please enter an image URL.');
      return false;
    }
    if (ingredients.length === 0 || ingredients.every(ing => !ing.name.trim() && !ing.amount.trim())) {
      setError('Please enter at least one ingredient with name and amount.');
      return false;
    }
    if (instructions.length === 0 || instructions.every(inst => !inst.trim())) {
      setError('Please enter at least one instruction step.');
      return false;
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to edit a recipe.');
        setSaving(false);
        return;
      }

      const recipeData = {
        title: title.trim(),
        image: image.trim(),
        description: description.trim(),
        readyInMinutes: readyInMinutes ? Number(readyInMinutes) : undefined,
        difficulty: difficulty,
        ingredients: ingredients.filter(ing => ing.name.trim() && ing.amount.trim()),
        instructions: instructions.filter(inst => inst.trim()),
        categories: categories.filter(cat => cat.trim())
      };

      console.log('Updating recipe with data:', recipeData);
      const result = await updateRecipe(token, id, recipeData);
      console.log('Recipe updated successfully:', result);
      
      // עדכון אופטימי - מעדכן מיידית ב-Context
      updateRecipeInContext(id, result.recipe || result);
      
      setSuccess('Recipe updated successfully!');
      
      // Navigate back to community recipes after 1 second
      setTimeout(() => {
        navigate('/community-recipes');
      }, 1000);

    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(err.message || 'Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">Loading recipe...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Edit Recipe</h1>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit} className="form">
          
          {/* Title */}
          <label className="label">
            Recipe Title *
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </label>

          {/* Image URL */}
          <label className="label">
            Image URL *
            <input 
              type="url" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input"
              required
            />
          </label>

          {/* Description */}
          <label className="label">
            Description
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea"
              rows={4}
            />
          </label>

          {/* Ready in Minutes */}
          <label className="label">
            Ready in Minutes
            <input 
              type="number" 
              value={readyInMinutes}
              onChange={(e) => setReadyInMinutes(e.target.value)}
              className="input"
              min="1"
            />
          </label>

          {/* Difficulty */}
          <label className="label">
            Difficulty
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="select"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>

          {/* Ingredients */}
          <div className="section">
            <h3 className="sectionTitle">Ingredients *</h3>
            {ingredients.map((ing, index) => (
              <div key={index} className="ingredientRow">
                <input 
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  className="inputSmall"
                />
                <input 
                  type="text"
                  placeholder="Amount (e.g., 2 cups)"
                  value={ing.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  className="inputSmall"
                />
                {ingredients.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="removeBtn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              onClick={addIngredient}
              className="addBtn"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="section">
            <h3 className="sectionTitle">Instructions *</h3>
            {instructions.map((inst, index) => (
              <div key={index} className="instructionRow">
                <span className="stepNumber">{index + 1}.</span>
                <textarea 
                  placeholder="Instruction step"
                  value={inst}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  className="instructionInput"
                  rows={2}
                />
                {instructions.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="removeBtn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button"
              onClick={addInstruction}
              className="addBtn"
            >
              + Add Step
            </button>
          </div>

          {/* Categories */}
          <div className="section">
            <h3 className="sectionTitle">Categories (Optional)</h3>
            {categories.length === 0 ? (
              <button 
                type="button"
                onClick={addCategory}
                className="addBtn"
              >
                + Add Category
              </button>
            ) : (
              <>
                {categories.map((cat, index) => (
                  <div key={index} className="categoryRow">
                    <input 
                      type="text"
                      placeholder="e.g., Italian, Vegan, Dessert"
                      value={cat}
                      onChange={(e) => updateCategory(index, e.target.value)}
                      className="input"
                    />
                    <button 
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="removeBtn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addCategory}
                  className="addBtn"
                >
                  + Add Another Category
                </button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button 
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/community-recipes')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submitBtn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Recipe"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
