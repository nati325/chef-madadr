import React, { useEffect, useState } from "react";
import { getCourses, createCourse, deleteCourse } from "../apirecipe/courseApi";

const AdminCoursesManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", price: "", location: "", date: "", maxSeats: 20 });

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
      // בתור ברירת מחדל, אחרי יצירה, תחזיר את כל השדות כולל maxSeats:
      setForm({ title: "", description: "", price: "", location: "", date: "", maxSeats: 20 });
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
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 12 }}>
      <h2>Admin Courses Manager</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "2rem" }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required style={{ marginRight: 8 }} />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required style={{ marginRight: 8 }} />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" required style={{ marginRight: 8 }} />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required style={{ marginRight: 8 }} />
        <input name="date" value={form.date} onChange={handleChange} placeholder="Date" required style={{ marginRight: 8 }} />
        <input name="maxSeats" type="number" min="1" value={form.maxSeats} onChange={handleChange} placeholder="Max Seats" required style={{ marginRight: 8, width: 90 }} />
        <button type="submit">Add Course</button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Location</th>
              <th>Date</th>
              <th>Max Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.price}</td>
                <td>{course.location}</td>
                <td>{course.date ? new Date(course.date).toLocaleString() : ""}</td>
                <td>{course.maxSeats}</td>
                <td>
                  <button onClick={() => handleDelete(course._id)} style={{ color: "red" }}>Delete</button>
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
