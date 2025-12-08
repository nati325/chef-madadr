import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./details.css";

function CourseDetails() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  // שליפת נתוני קורס מהשרת
  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
        setMessage("Error loading course");
      }
    }

    fetchCourse();
  }, [courseId]);

  // פונקציית רישום לקורס
  const handleRegister = async () => {
    try {
      if (!token) {
        setMessage("You must be logged in to register for a course");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/courses/${courseId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({})
        }
      );

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error registering for course");
    }
  };

  if (!course) return <p style={{ color: "white", padding: "20px" }}>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>{course.title}</h1>

        {course.image && (
          <div style={styles.imageWrapper}>
            <img src={course.image} alt={course.title} style={styles.image} />
          </div>
        )}

        <div style={styles.details}>
          <p style={styles.description}>{course.description}</p>
          <p style={styles.info}>📍 Location: {course.location}</p>
          <p style={styles.info}>📅 Date: {new Date(course.date).toLocaleDateString('en-IL')}</p>
          {course.price && <p style={styles.info}>💰 Price: {course.price}</p>}
          <p style={styles.info}>👥 Registered: {course.participants?.length || 0} / {course.maxSeats || 20}</p>
        </div>

        {message && (
          <p style={styles.message}>{message}</p>
        )}

        <button
          className="details-action-button"
          style={{
            opacity: !token ? 0.5 : 1,
            cursor: !token ? "not-allowed" : "pointer"
          }}
          onClick={handleRegister}
          disabled={!token}
        >
          {token ? "Register for Course" : "Login to Register"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)",
    padding: "calc(var(--nav-height, 70px) + 20px) 20px 20px",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#ffc947",
    marginBottom: "20px",
    textAlign: "center",
    fontFamily: "'Playfair Display', serif",
  },
  imageWrapper: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto 20px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
  },
  image: {
    width: "100%",
    height: "auto",
    maxHeight: "400px",
    objectFit: "cover",
    display: "block",
  },
  details: {
    background: "rgba(45, 24, 16, 0.5)",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 140, 66, 0.2)",
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#f5e6d3",
    marginBottom: "16px",
  },
  info: {
    fontSize: "15px",
    color: "#ff8c42",
    marginBottom: "8px",
  },
  message: {
    padding: "12px 16px",
    background: "rgba(255, 201, 71, 0.2)",
    border: "1px solid #ffc947",
    borderRadius: "8px",
    color: "#ffc947",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "20px",
  },
};

export default CourseDetails;