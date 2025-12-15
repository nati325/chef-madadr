import React, { useState } from "react";
import "./RecipeGenerator.css"; // Adding a CSS file for styling

function RecipeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from server:", errorData);
        alert(`Failed to generate recipe: ${errorData.error || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-generator">
      <h1 className="title">Recipe Generator</h1>
      <textarea
        className="input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a list of ingredients separated by commas (e.g., tomato, onion, garlic)"
      />
      <button className="generate-button" onClick={generateRecipe} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
      {recipe && (
        <div className="recipe-output">
          <h2 className="recipe-title">Generated Recipe:</h2>
          <pre className="recipe-text">{recipe}</pre>
        </div>
      )}
    </div>
  );
}

export default RecipeGenerator;