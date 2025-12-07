const API_URL = "http://localhost:5000/api";

// ⭐ FAVORITES API
export async function getMyFavoritesApi(token) {
  const res = await fetch(`${API_URL}/users/favorites`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load favorites");
  return res.json();
}

export async function toggleFavoriteApi(mealId, token) {
  const res = await fetch(`${API_URL}/users/favorites/${mealId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error("Failed to toggle favorite");
  return res.json();
}

// ⭐ COURSES API
export async function getMyCoursesApi(token) {
  const res = await fetch(`${API_URL}/users/courses`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load courses");
  return res.json();
}

export async function registerToCourseApi(courseId, token) {
  const res = await fetch(`${API_URL}/courses/${courseId}/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error("Failed to register");
  return res.json();
}

export async function unregisterFromCourseApi(courseId, token) {
  const res = await fetch(`${API_URL}/courses/${courseId}/unregister`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });
  if (!res.ok) throw new Error("Failed to unregister");
  return res.json();
}
