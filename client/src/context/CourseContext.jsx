import React, { createContext, useContext, useState, useEffect } from "react";
import { registerToCourse, unregisterFromCourse } from "../apirecipe/courseApi";
import { getMyCoursesApi } from "../apirecipe/userApi";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]); // user's purchased courses
  const [loading, setLoading] = useState(true);

  // Load purchased courses on initial load and expose reload function
  const loadCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCourses([]);
        setLoading(false);
        return;
      }
      const data = await getMyCoursesApi(token);
      // server could return { courses: [...] } or { userCourses: [...] } — handle both
      const arr = data.courses || data.userCourses || [];
      // normalize: ensure each item has courseId string (older code expects that)
      setCourses(arr.map(c => (c.courseId ? { ...c, courseId: String(c.courseId) } : { ...c, courseId: String(c._id || c.courseId || c.id) })));
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to add a purchased course (register)
  const addCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    console.log("🔵 Registering to course:", courseId);

    // call API (courseApi.registerToCourse returns parsed JSON or throws)
    const result = await registerToCourse(courseId, token);

    console.log("🔵 Server response:", result);
    console.log("🔵 userCourses from server:", result.userCourses);

    // Prefer userCourses field (returned by server). If missing, reload.
    if (result.userCourses) {
      const normalizedCourses = result.userCourses.map(c => (c.courseId ? { ...c, courseId: String(c.courseId) } : { ...c, courseId: String(c._id || c.courseId || c.id) }));
      console.log("🔵 Setting courses to:", normalizedCourses);
      setCourses(normalizedCourses);
    } else {
      // fallback: reload from server
      console.log("🔵 No userCourses in response, reloading...");
      await loadCourses();
    }
    return true;
  };

  // Function to remove a course (unregister)
  const removeCourse = async (courseId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const result = await unregisterFromCourse(courseId, token);

    if (result.userCourses) {
      setCourses(result.userCourses.map(c => (c.courseId ? { ...c, courseId: String(c.courseId) } : { ...c, courseId: String(c._id || c.courseId || c.id) })));
    } else {
      await loadCourses();
    }
    return true;
  };

  return (
    <CourseContext.Provider value={{ courses, loading, addCourse, removeCourse, reloadCourses: loadCourses }}>
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