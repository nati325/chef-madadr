import React from "react";
import { getCourses } from "../apirecipe/courseApi";
import { registerToCourseApi, unregisterFromCourseApi, getMyFavoritesApi } from "../apirecipe/userApi";
import { useCourses } from "../context/CourseContext";
import "./courses.css";

function Courses() {
  const { courses: registeredCourses, addCourse, removeCourse, loading: contextLoading } = useCourses();
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(""); // courseId of action in progress
  const [error, setError] = React.useState(null);

  const loadCourses = React.useCallback(() => {
    setLoading(true);
    getCourses()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        setError("שגיאה בטעינת הקורסים");
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // The main return block
  return (
    <div className="courses-page">
      <h1 style={{
        textAlign: "center",
        fontSize: "2.5rem",
        color: "#ffc947",
        marginTop: "0",
        marginBottom: "2rem",
        fontWeight: "900",
        fontFamily: "'Playfair Display', serif"
      }}>
        🍳 הקורסים שלנו
      </h1>
      <div className="courses-list">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.3rem" }}>טוען קורסים...</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>{error}</div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>לא נמצאו קורסים להצגה</div>
        ) : (
          courses.map(course => {
            const isRegistered = registeredCourses.some(rc => {
              const rcId = String(rc.courseId || rc._id);
              const courseId = String(course._id);
              return rcId === courseId;
            });
            return (
              <div key={course._id} className="course-card-wrapper">
                <div
                  className="course-card"
                  onClick={() => window.location.href = `/course/${course._id}`}
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,0,0,0.10)";
                  }}
                >
                  <img src={course.image || '/public/default-course.jpg'} alt={course.title} style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderTopLeftRadius: "18px",
                    borderTopRightRadius: "18px",
                    flexShrink: 0
                  }} />
                  <div className="course-card-content" style={{ padding: "1rem", paddingBottom: "0.5rem", width: "100%" }}>
                    <h2 style={{ marginBottom: "0.5rem", fontSize: "1.2rem", color: "#ff8c42", flexShrink: 0 }}>{course.title}</h2>
                    <p style={{
                      marginBottom: "0.8rem",
                      color: "#333",
                      fontSize: "0.95rem",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>{course.description}</p>

                    {/* Course Details */}
                    <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#555", flexShrink: 0 }}>
                      {course.location && (
                        <div style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>📍</span>
                          <span><strong>מיקום:</strong> {course.location}</span>
                        </div>
                      )}
                      {course.date && (
                        <div style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>📅</span>
                          <span><strong>תאריך:</strong> {new Date(course.date).toLocaleDateString('he-IL')}</span>
                        </div>
                      )}
                      {course.price && (
                        <div style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>💰</span>
                          <span><strong>מחיר:</strong> {course.price}</span>
                        </div>
                      )}
                      <div style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span>👥</span>
                        <span><strong>נרשמו:</strong> {course.participants?.length || 0} / {course.maxSeats || 20}</span>
                      </div>
                    </div>
                    <button
                      style={{
                        width: "100%",
                        padding: "0.9rem 0",
                        background: isRegistered
                          ? "linear-gradient(135deg, #4caf50, #81c784)"
                          : "linear-gradient(135deg, #ffc947, #ff8c42)",
                        color: isRegistered ? "#fff" : "#1a0f0a",
                        border: "none",
                        borderRadius: "12px",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        cursor: actionLoading === course._id ? "not-allowed" : "pointer",
                        boxShadow: isRegistered
                          ? "0 2px 8px rgba(76,175,80,0.10)"
                          : "0 2px 8px rgba(255,201,71,0.10)",
                        marginTop: "auto",
                        marginBottom: "0.5rem"
                      }}
                      onClick={async () => {
                        setActionLoading(course._id);
                        try {
                          await addCourse(course._id);
                          loadCourses(); // Reload courses to show updated participant count
                        } catch (e) {
                          if (e.message) {
                            alert(e.message);
                          } else {
                            alert('שגיאה בהרשמה לקורס');
                          }
                        }
                        setActionLoading("");
                      }}
                      disabled={actionLoading === course._id || isRegistered}
                    >{isRegistered ? "נרשמת ✅" : "להרשמה לקורס"}</button>
                    {isRegistered && (
                      <>
                        <button
                          style={{
                            width: "100%",
                            padding: "0.9rem 0",
                            background: "linear-gradient(135deg, #ff6b6b, #d32f2f)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            cursor: actionLoading === course._id ? "not-allowed" : "pointer",
                            marginBottom: "0.5rem",
                            boxShadow: "0 2px 8px rgba(211,47,47,0.10)",
                            letterSpacing: "1px",
                            transition: "all 0.2s"
                          }}
                          onClick={async () => {
                            setActionLoading(course._id);
                            try {
                              await removeCourse(course._id);
                              loadCourses(); // Reload courses to show updated participant count
                            } catch (e) {
                              alert('שגיאה בביטול הרשמה');
                            }
                            setActionLoading("");
                          }}
                          disabled={actionLoading === course._id}
                        >בטל הרשמה</button>
                        <a
                          href="https://www.bitpay.co.il/app/me/A20C168F-A701-741B-B47D-9A8C54510966D8DA"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "center",
                            background: "linear-gradient(135deg, #2196f3, #1565c0)",
                            color: "#fff",
                            padding: "0.7rem 0",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "1rem",
                            border: "none",
                            textDecoration: "none",
                            marginBottom: "0.5rem",
                            boxShadow: "0 2px 8px rgba(33,150,243,0.10)",
                            letterSpacing: "0.5px",
                            transition: "all 0.2s"
                          }}
                        >לתשלום בביט</a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Contact Info */}
      <div className="contact-section">
        <h3 className="contact-title">יש לך שאלות?</h3>
        <p className="contact-description">פנה לשף מדאר למידע נוסף על הקורסים</p>
        <div className="contact-buttons">
          <button
            onClick={() => { navigator.clipboard.writeText('netaneldama@gmail.com'); alert('Email copied to clipboard! ✅'); }}
            className="contact-button email"
          >
            {'[email]'} netaneldama@gmail.com
          </button>
          <a
            href="https://wa.me/972535378985?text=Hello%20Chef%20Madar%2C%20I%20would%20like%20to%20know%20more%20about%20the%20courses"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-button whatsapp"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default Courses;
