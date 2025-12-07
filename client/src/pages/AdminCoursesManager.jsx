import React, { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../apirecipe/courseApi";

const AdminCoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", price: "", location: "", date: "", maxSeats: 20, image: "" });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCourse(form);
      // Reset all fields including image to avoid undefined values
      setForm({ title: "", description: "", price: "", location: "", date: "", maxSeats: 20, image: "" });
      await loadCourses();
    } catch (err) {
      setError("Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteCourse(id);
      await loadCourses();
    } catch (err) {
      setError("Failed to delete course");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "2.5rem", background: "#232323", borderRadius: 18, boxShadow: "0 8px 32px rgba(0,0,0,0.25)", direction: "rtl" }}>
      <h2 style={{ color: "#ffc947", fontSize: "2.2rem", marginBottom: "1.5rem", textAlign: "center", fontFamily: "Playfair Display, serif" }}>ניהול קורסים</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
          <input name="image" value={form.image} onChange={handleChange} placeholder="קישור לתמונה" style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 180 }} />
        <input name="title" value={form.title} onChange={handleChange} placeholder="שם הקורס" required style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 140 }} />
        <input name="description" value={form.description} onChange={handleChange} placeholder="תיאור" required style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 180 }} />
        <input name="price" value={form.price} onChange={handleChange} placeholder="מחיר" required style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 90 }} />
        <input name="location" value={form.location} onChange={handleChange} placeholder="מיקום" required style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 120 }} />
        <input name="date" value={form.date} onChange={handleChange} placeholder="תאריך" required style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 140 }} />
        <input name="maxSeats" type="number" min="1" value={form.maxSeats} onChange={handleChange} placeholder="מספר משתתפים" required style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid #ffc947", background: "#2d1810", color: "#ffc947", fontWeight: 600, width: 90 }} />
        <button type="submit" style={{ padding: "0.7rem 1.5rem", borderRadius: 8, background: "#ffc947", color: "#2d1810", fontWeight: 700, border: "none", fontSize: "1rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(255,201,71,0.15)" }}>הוסף קורס</button>
      </form>
      {error && <div style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}
      {loading ? <div style={{ color: "#ffc947", textAlign: "center", fontSize: "1.2rem" }}>טוען...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#2d1810", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
          <thead>
            <tr style={{ background: "#ffc947", color: "#2d1810", fontWeight: 700 }}>
              <th style={{ padding: "1rem" }}>תמונה</th>
              <th style={{ padding: "1rem" }}>שם</th>
              <th style={{ padding: "1rem" }}>תיאור</th>
              <th style={{ padding: "1rem" }}>מחיר</th>
              <th style={{ padding: "1rem" }}>מיקום</th>
              <th style={{ padding: "1rem" }}>תאריך</th>
              <th style={{ padding: "1rem" }}>משתתפים</th>
              <th style={{ padding: "1rem" }}>מחיקה</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} style={{ color: "#ffc947", fontWeight: 500, textAlign: "center" }}>
                <td style={{ padding: "0.7rem" }}>
                  {course.image && (
                    <img src={course.image} alt={course.title} style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 8, border: "1px solid #ffc947" }} />
                  )}
                </td>
                <td style={{ padding: "0.7rem" }}>{course.title}</td>
                <td style={{ padding: "0.7rem" }}>{course.description}</td>
                <td style={{ padding: "0.7rem" }}>{course.price}</td>
                <td style={{ padding: "0.7rem" }}>{course.location}</td>
                <td style={{ padding: "0.7rem" }}>{course.date ? new Date(course.date).toLocaleString() : ""}</td>
                <td style={{ padding: "0.7rem" }}>{course.maxSeats}</td>
                <td style={{ padding: "0.7rem" }}>
                  <button onClick={() => handleDelete(course._id)} style={{ background: "#ff4d4d", color: "#fff", border: "none", borderRadius: 6, padding: "0.5rem 1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(255,77,77,0.15)" }}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCoursesManager;
