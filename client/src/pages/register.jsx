import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useFavorites } from "../context/FavoritesContext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { reloadCourses } = useCourses();
  const { reloadFavorites } = useFavorites();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration error");
      }

      // Save token like in login
      localStorage.setItem("token", data.token);

      // Save complete user object for later use
      if (data._id || data.id) {
        localStorage.setItem("user", JSON.stringify({
          _id: data._id || data.id,
          id: data.id || data._id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin || false
        }));
      }

      if (data.name) {
        localStorage.setItem("userName", data.name);
      }

      // After successful registration → go to profile
      await reloadCourses();
      await reloadFavorites();
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Register</h2>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>
          Full Name
          <input
            type="text"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label style={styles.label}>
          Email
          <input
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;

// Using the same styles as in login
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#111",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "white",
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: "24px 28px",
    borderRadius: 14,
    width: "320px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    margin: "0 0 10px",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  input: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #444",
    backgroundColor: "#111",
    color: "white",
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg, #ff6a00, #ff944d)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
  },
  error: {
    backgroundColor: "#5c1b1b",
    color: "#ffe5e5",
    padding: "6px 8px",
    borderRadius: 6,
    fontSize: 13,
    textAlign: "center",
  },
};
