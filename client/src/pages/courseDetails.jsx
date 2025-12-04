import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function CourseDetails() {
  const { id: courseId } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState("");

  // שליפת נתוני קורס מהשרת
  useEffect(() => {
    async function fetchCourse() {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`
        );
        setCourse(data);
      } catch (err) {
        console.error(err);
        setMessage("בעיה בטעינת הקורס");
      }
    }

    fetchCourse();
  }, [courseId]);

  // פונקציית רישום לקורס – כאן שמנו את axios.post ישירות
  const handleRegister = async () => {
    try {
      if (!token) {
        setMessage("You must be logged in to register for a course");
        return;
      }

      const { data } = await axios.post(
        `http://localhost:5000/api/courses/${courseId}/register`,
        {}, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(data.message); // למשל: "Registered successfully"
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "שגיאה בהרשמה לקורס");
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
          <p style={styles.info}>📅 Date: {new Date(course.date).toLocaleString()}</p>
        </div>

        {message && (
          <p style={styles.message}>{message}</p>
        )}

        <button
          style={{
            ...styles.button,
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
    background: "linear-gradient(180deg, #1f1410, #2a1915)",
    padding: "20px 10px",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "100vw",
    overflowX: "hidden",
  },
  container: {
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    fontWeight: "700",
    color: "#ffc947",
    marginBottom: "20px",
    textAlign: "center",
    wordWrap: "break-word",
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
    wordWrap: "break-word",
  },
  info: {
    fontSize: "15px",
    color: "#ff8c42",
    marginBottom: "8px",
    wordWrap: "break-word",
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
    wordWrap: "break-word",
  },
  button: {
    width: "100%",
    maxWidth: "200px",
    display: "block",
    margin: "0 auto",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a0f0a",
    background: "linear-gradient(135deg, #ffc947, #ff8c42)",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(255, 140, 66, 0.4)",
    transition: "all 0.3s ease",
  },
};

export default CourseDetails;