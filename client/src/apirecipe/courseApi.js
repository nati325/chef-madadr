
const API_BASE_URL = "http://localhost:5000";

export const getCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses`);
  if (!response.ok) throw new Error("Failed to fetch courses");
  return response.json();
};

export const createCourse = async (courseData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/courses`, {
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
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Failed to delete course");
  return response.json();
};

export const registerToCourse = async (courseId, token) => {
  return fetch(`${API_BASE_URL}/api/courses/${courseId}/register`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({})
  });
};