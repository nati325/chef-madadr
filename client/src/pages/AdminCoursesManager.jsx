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
    <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "2.5rem", background: "white", borderRadius: 20, boxShadow: "0 12px 48px rgba(10,17,40,0.1)", border: "2px solid rgba(255,159,28,0.25)" }}>
      <h2 style={{ color: "#0A1128", fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, borderBottom: "3px solid #D35400", paddingBottom: "1rem" }}>Manage Courses</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", padding: "2rem", background: "rgba(255,159,28,0.05)", borderRadius: 16, border: "1px solid rgba(255,159,28,0.2)" }}>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(255,159,28,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          required
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(184,134,11,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(184,134,11,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(184,134,11,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(184,134,11,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Date"
          required
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(184,134,11,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <input
          name="maxSeats"
          type="number"
          min="1"
          value={form.maxSeats}
          onChange={handleChange}
          placeholder="Max Participants"
          required
          style={{ padding: "0.9rem 1rem", borderRadius: 10, border: "2px solid rgba(184,134,11,0.3)", background: "white", color: "#0A1128", fontWeight: 500, fontSize: "0.95rem", outline: "none" }}
        />
        <button
          type="submit"
          style={{ padding: "0.9rem 1.5rem", borderRadius: 12, background: "linear-gradient(135deg, #FF9F1C, #D35400)", color: "#0A1128", fontWeight: 700, border: "none", fontSize: "1rem", cursor: "pointer", boxShadow: "0 4px 12px rgba(211,84,0,0.3)", gridColumn: "span 2" }}
        >
          Add Course
        </button>
      </form>

      {error && <div style={{ color: "#d32f2f", textAlign: "center", marginBottom: "1.5rem", padding: "0.75rem", background: "rgba(244,67,54,0.1)", borderRadius: 8, border: "1px solid rgba(244,67,54,0.3)" }}>{error}</div>}

      {loading ? (
        <div style={{ color: "#4A5568", textAlign: "center", fontSize: "1.2rem", padding: "2rem" }}>Loading...</div>
      ) : (
        <div style={{ overflowX: "auto", borderRadius: 12, border: "2px solid rgba(184,134,11,0.2)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #1E2749, #0A1128)", color: "white" }}>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Image</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Title</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Description</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Price</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Location</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Date</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Seats</th>
                <th style={{ padding: "1rem", fontWeight: 600, fontSize: "0.95rem", borderBottom: "2px solid #D35400" }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr
                  key={course._id}
                  style={{
                    color: "#2C2C2C",
                    fontWeight: 500,
                    textAlign: "center",
                    background: index % 2 === 0 ? "white" : "rgba(184,134,11,0.03)",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(184,134,11,0.08)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "white" : "rgba(184,134,11,0.03)"}
                >
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,159,28,0.15)" }}>
                    {course.image && (
                      <img
                        src={course.image}
                        alt={course.title}
                        style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8, border: "2px solid rgba(255,159,28,0.3)", boxShadow: "0 2px 8px rgba(10,17,40,0.1)" }}
                      />
                    )}
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: 600, color: "#0A1128", borderBottom: "1px solid rgba(255,159,28,0.15)" }}>{course.title}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,159,28,0.15)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.description}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 600, color: "#D35400", borderBottom: "1px solid rgba(255,159,28,0.15)" }}>{course.price}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,159,28,0.15)" }}>{course.location}</td>
                  <td style={{ padding: "0.75rem", fontSize: "0.9rem", borderBottom: "1px solid rgba(255,159,28,0.15)" }}>{course.date ? new Date(course.date).toLocaleDateString() : ""}</td>
                  <td style={{ padding: "0.75rem", fontWeight: 600, borderBottom: "1px solid rgba(255,159,28,0.15)" }}>{course.maxSeats}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid rgba(255,159,28,0.15)" }}>
                    <button
                      onClick={() => handleDelete(course._id)}
                      style={{ background: "linear-gradient(135deg, #d32f2f, #c62828)", color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1.2rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(211,47,47,0.2)", fontSize: "0.9rem" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesManager;
