import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, updateRecipe } from '../apirecipe/userRecipesApi';
import './EditRecipe.css';

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        readyInMinutes: '',
        servings: '',
        category: '',
        instructions: '',
        ingredients: []
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipe = await getRecipeById(id);

                // Format ingredients if they are strings or objects
                let formattedIngredients = [];
                if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
                    formattedIngredients = recipe.ingredients.map(ing => ({
                        name: ing.name || '',
                        amount: ing.amount || ''
                    }));
                }

                setFormData({
                    title: recipe.title || '',
                    description: recipe.description || '',
                    image: recipe.image || '',
                    readyInMinutes: recipe.readyInMinutes || '',
                    servings: recipe.servings || '',
                    category: recipe.category || '',
                    instructions: recipe.instructions || '',
                    ingredients: formattedIngredients.length > 0 ? formattedIngredients : [{ name: '', amount: '' }]
                });
            } catch (err) {
                setError('Failed to load recipe');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', amount: '' }]
        }));
    };

    const removeIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to update a recipe');
                return;
            }

            // Filter out empty ingredients
            const validIngredients = formData.ingredients.filter(
                ing => ing.name.trim() !== '' || ing.amount.trim() !== ''
            );

            const dataToSubmit = {
                ...formData,
                ingredients: validIngredients
            };

            await updateRecipe(token, id, dataToSubmit);
            navigate('/community-recipes');
        } catch (err) {
            setError(err.message || 'Failed to update recipe');
        }
    };

    if (loading) return <div className="edit-recipe-page"><div className="loading">Loading...</div></div>;

    return (
        <div className="edit-recipe-page">
            <div className="edit-recipe-container">
                <h1 className="edit-recipe-title">Edit Recipe</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Ready in (minutes)</label>
                            <input
                                type="number"
                                name="readyInMinutes"
                                value={formData.readyInMinutes}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Servings</label>
                            <input
                                type="number"
                                name="servings"
                                value={formData.servings}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ingredients</label>
                        <div className="ingredients-list">
                            {formData.ingredients.map((ing, index) => (
                                <div key={index} className="ingredient-row">
                                    <input
                                        type="text"
                                        placeholder="Amount (e.g., 2 cups)"
                                        value={ing.amount}
                                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ingredient name"
                                        value={ing.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="add-btn" onClick={addIngredient}>
                            + Add Ingredient
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Instructions</label>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => navigate('/community-recipes')}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
