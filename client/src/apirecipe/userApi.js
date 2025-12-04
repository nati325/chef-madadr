const API_URL = "http://localhost:5000/api/users"; // תתאים לנתיב שלך

export async function getMyFavoritesApi(token) {
  const res = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load favorites");
  }

  return res.json();
}

export async function toggleFavoriteApi(mealId, token) {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ idMeal: mealId }),
  });

  if (!res.ok) {
    throw new Error("Failed to toggle favorite");
  }

  return res.json();
}
 