import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CourseContext";
import { useFavorites } from "../context/FavoritesContext";

function Login() {
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
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login error");
      }

      // 👈 Here we save the token in local storage
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

      // Optional – also save name
      if (data.name) {
        localStorage.setItem("userName", data.name);
      }

      // Reload courses context to ensure fresh data for the new user
      await reloadCourses();
      await reloadFavorites();

      // Navigate to profile page
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {error && <p style={styles.error}>{error}</p>}

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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;

// 🎨 Premium clean style - Navy & Gold theme
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    padding: "24px 28px",
    borderRadius: 16,
    width: "340px",
    boxShadow: "0 10px 40px rgba(10, 17, 40, 0.15)",
    border: "2px solid rgba(255, 159, 28, 0.3)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    margin: "0 0 8px",
    textAlign: "center",
    color: "#0A1128",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.75rem",
    fontWeight: 700,
  },
  label: {
    fontSize: 15,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#2C2C2C",
    fontWeight: 500,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "2px solid rgba(255, 159, 28, 0.25)",
    backgroundColor: "white",
    color: "#0A1128",
    fontSize: 14,
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  button: {
    marginTop: 8,
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #FF9F1C, #D35400)",
    color: "#0A1128",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
    boxShadow: "0 4px 12px rgba(255, 159, 28, 0.3)",
    transition: "all 0.3s ease",
  },
  error: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    color: "#d32f2f",
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14,
    textAlign: "center",
    border: "1px solid rgba(244, 67, 54, 0.3)",
  },
};
