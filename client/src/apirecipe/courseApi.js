// client/src/apirecipe/courseApi.js
const API_BASE_URL = "http://localhost:5000/api";

export const getCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/courses`);
  if (!response.ok) throw new Error("Failed to fetch courses");
  return response.json();
};

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });
  if (!response.ok) throw new Error("Failed to create course");
  return response.json();
};

export const deleteCourse = async (courseId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Failed to delete course");
  return response.json();
};

// NOTE: these are low-level helpers that return parsed JSON
export const registerToCourse = async (courseId, token) => {
  console.log("📤 Calling API: POST /courses/" + courseId + "/register");
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({})
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("❌ Server error:", err);
    throw new Error(err.message || "Failed to register to course");
  }
  const data = await res.json();
  console.log("✅ Server response:", data);
  return data;
};

export const unregisterFromCourse = async (courseId, token) => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/unregister`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({})
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to unregister from course");
  }
  return res.json();
};