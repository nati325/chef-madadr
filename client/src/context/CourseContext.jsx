import React, { createContext, useContext, useState, useEffect } from "react";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load purchased courses on initial load
  useEffect(() => {
    async function loadCourses() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  // Function to add a purchased course
  const addCourse = async (courseId) => {
    try {
      console.log("🔵 Adding course:", courseId);
      const token = localStorage.getItem("token");
      console.log("🔵 Token exists:", !!token);
      
      if (!token) {
        console.error("🔴 No token found - user not logged in");
        return;
      }

      console.log("🔵 Sending request to:", `http://localhost:5000/api/users/courses/${courseId}`);
      const response = await fetch(`http://localhost:5000/api/users/courses/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔵 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 Error response:", errorText);
        throw new Error("Failed to add course");
      }

      const data = await response.json();
      console.log("🟢 Course added successfully:", data);
      setCourses(data.courses);
      return true;
    } catch (error) {
      console.error("🔴 Error adding course:", error);
      return false;
    }
  };

  // Function to remove a course
  const removeCourse = async (courseId) => {
    try {
      console.log("🔵 Removing course:", courseId);
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("🔴 No token found - user not logged in");
        return;
      }

      console.log("🔵 Sending DELETE request to:", `http://localhost:5000/api/users/courses/${courseId}`);
      const response = await fetch(`http://localhost:5000/api/users/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("🔵 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 Error response:", errorText);
        throw new Error("Failed to remove course");
      }

      const data = await response.json();
      console.log("🟢 Course removed successfully:", data);
      setCourses(data.courses);
      return true;
    } catch (error) {
      console.error("🔴 Error removing course:", error);
      return false;
    }
  };

  return (
    <CourseContext.Provider value={{ courses, loading, addCourse, removeCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

// Convenient Hook for use
export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within CourseProvider");
  }
  return context;
}

export default CourseContext;