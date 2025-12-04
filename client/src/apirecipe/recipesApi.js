// recipesApi.js   ⚡ גרסה חדשה

export async function fetchHomeRecipes() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const allMeals = [];

  // לולאה על כל האותיות A-Z
  for (const letter of letters) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
      );
      const data = await res.json();

      if (data.meals) {
        allMeals.push(...data.meals); // מוסיף לרשימה הכללית
      }
    } catch (err) {
      console.error("Error while fetching recipes:", err);
    }
  }

  return allMeals; // Returns full array of recipes!
}
