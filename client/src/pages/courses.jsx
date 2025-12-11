import React from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../apirecipe/courseApi";
import { useCourses } from "../context/CourseContext";
import { translations } from "../translations";
import "./courses.css";

const lang = "en"; // Language setting

function Courses() {
  const navigate = useNavigate();
  const { courses: registeredCourses, addCourse, removeCourse, loading: contextLoading } = useCourses();
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(""); // courseId of action in progress
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    getCourses()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        setError(translations[lang].error);
        setLoading(false);
      });
  }, []);

  // The main return block
  return (
    <div className="courses-page">
      <div className="courses-header">
        <h1 className="courses-title" style={{ marginTop: 0 }}>{translations[lang].coursesTitle}</h1>
      </div>
      <div className="courses-list">
        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.3rem" }}>{translations[lang].loading}</div>
        ) : error ? (
          <div style={{ color: "red", textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>{error}</div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>{translations[lang].noCourses}</div>
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
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <img src={course.image || '/public/default-course.jpg'} alt={course.title} />
                  <div className="course-card-content">
                    <h2>{course.title}</h2>
                    <p className="course-description">{course.description}</p>

                    <div className="course-info-row">
                      <span className="course-price">{course.price ? `₪${course.price}` : ""}</span>

                      {/* Button or Registered Status */}
                      {!isRegistered ? (
                        <button
                          onClick={async (e) => {
                            e.stopPropagation(); // Prevent card navigation
                            setActionLoading(course._id);
                            try {
                              if (!isRegistered) {
                                await addCourse(course._id);
                              }
                            } catch (err) {
                              console.error("Failed to register/unregister", err);
                              if (err.message) {
                                alert(err.message);
                              } else {
                                alert(translations[lang].registrationError);
                              }
                            } finally {
                              setActionLoading("");
                            }
                          }}
                          disabled={actionLoading === course._id}
                        >
                          {actionLoading === course._id ? "..." : "Register Now"}
                        </button>
                      ) : (
                        <div className="registered-badge">
                          <span>✓</span>
                        </div>
                      )}
                    </div>

                    {isRegistered && (
                      <>
                        <button
                          style={{
                            width: "85%",
                            padding: "0.8rem 0",
                            background: "linear-gradient(135deg, #FF9F1C 0%, #D35400 100%)",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "1rem",
                            cursor: actionLoading === course._id ? "not-allowed" : "pointer",
                            marginBottom: "0.5rem",
                            boxShadow: "0 4px 15px rgba(184, 134, 11, 0.3)",
                            letterSpacing: "1px",
                            transition: "all 0.2s",
                            marginLeft: "auto",
                            marginRight: "auto",
                            display: "block"
                          }}
                          onClick={async (e) => {
                            e.stopPropagation(); // Prevent card navigation
                            setActionLoading(course._id);
                            try {
                              await removeCourse(course._id);
                            } catch (e) {
                              alert(translations[lang].unregistrationError);
                            }
                            setActionLoading("");
                          }}
                          disabled={actionLoading === course._id}
                        >{translations[lang].cancelRegistration}</button>

                        <a
                          href="https://www.bitpay.co.il/app/me/A20C168F-A701-741B-B47D-9A8C54510966D8DA"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()} // Prevent card navigation
                          style={{
                            display: "block",
                            width: "85%",
                            textAlign: "center",
                            background: "linear-gradient(135deg, #FF9F1C 0%, #D35400 100%)",
                            color: "#FFFFFF",
                            padding: "0.7rem 0",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                            border: "none",
                            textDecoration: "none",
                            marginBottom: "0.5rem",
                            boxShadow: "0 4px 15px rgba(184, 134, 11, 0.3)",
                            letterSpacing: "0.5px",
                            transition: "all 0.2s",
                            marginLeft: "auto",
                            marginRight: "auto"
                          }}
                        >{translations[lang].payment}</a>
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
        <h3 className="contact-title">{translations[lang].contactTitle}</h3>
        <p className="contact-description">{translations[lang].contactDescription}</p>
        <div className="contact-buttons">
          <button onClick={() => { navigator.clipboard.writeText('netaneldama@gmail.com'); alert(translations[lang].emailCopied); }} style={{ padding: "1rem 2rem", background: "linear-gradient(135deg, #FF9F1C 0%, #D35400 100%)", color: "#FFFFFF", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "1.1rem", transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(255, 159, 28, 0.3)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 159, 28, 0.5)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 159, 28, 0.3)"; }}>📧 netaneldama@gmail.com</button>
          <a href="https://wa.me/972535378985?text=Hello%20Chef%20Madar%2C%20I%20would%20like%20to%20know%20more%20about%20the%20courses" target="_blank" rel="noopener noreferrer" style={{ padding: "1rem 2rem", background: "linear-gradient(135deg, #FF9F1C 0%, #D35400 100%)", color: "white", borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "1.1rem", transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(255, 159, 28, 0.3)" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 159, 28, 0.5)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 159, 28, 0.3)"; }}>💬 WhatsApp</a>
        </div>
      </div>
    </div>
  );
}

export default Courses;
