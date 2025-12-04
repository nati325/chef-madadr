import React from "react";
import { getCourses } from "../apirecipe/courseApi";
import "./courses.css";

function Courses() {
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError("שגיאה בטעינת הקורסים");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="courses-page">
      <div className="courses-container">
        {/* Header */}
        <div className="courses-header">
          <h1 className="courses-title">
            Cooking Courses
          </h1>
          <p className="courses-subtitle">
            Join Chef Madar's hands-on cooking courses in Beit Dagan
          </p>
          <div className="courses-location">
            <span style={{ fontSize: "1.5rem" }}>📍</span>
            <span>Tzahal 24, Beit Dagan</span>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              style={{
                background: "linear-gradient(135deg, #2d1810, #3d2415)",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                transition: "all 0.4s ease",
                border: "2px solid rgba(255, 140, 66, 0.3)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-12px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(255, 140, 66, 0.4)";
                e.currentTarget.style.borderColor = "#ff8c42";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.5)";
                e.currentTarget.style.borderColor = "rgba(255, 140, 66, 0.3)";
              }}
            >
              {/* Course Image */}
              <div
                style={{
                  width: "100%",
                  height: "220px",
                  backgroundImage: `url(${course.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  borderBottom: "3px solid #ff8c42",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    background: "rgba(255, 201, 71, 0.95)",
                    color: "#1a0f0a",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "1.3rem",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  {course.price}
                </div>
              </div>

              {/* Course Content */}
              <div style={{ padding: "2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontFamily: "'Playfair Display', serif",
                    color: "#ffc947",
                    marginBottom: "1rem",
                    fontWeight: "900",
                    letterSpacing: "1px",
                  }}
                >
                  {course.title}
                </h2>

                <p
                  style={{
                    fontSize: "1rem",
                    color: "#f5e6d3",
                    lineHeight: "1.7",
                    marginBottom: "1.5rem",
                    minHeight: "80px",
                    opacity: 0.9,
                  }}
                >
                  {course.description}
                </p>

                {/* Course Details */}
                <div style={{ marginBottom: "1.5rem", marginTop: "auto" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.7rem",
                      marginBottom: "0.7rem",
                      color: "#ff8c42",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>⏱️</span>
                    <span>{course.duration}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.7rem",
                      marginBottom: "0.7rem",
                      color: "#ff8c42",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    <span style={{ fontSize: "1.3rem" }}>📅</span>
                    <span>{course.schedule}</span>
                  </div>
                </div>

                {/* Enroll Button */}
                <a
                  href="https://www.bitpay.co.il/app/me/A20C168F-A701-741B-B47D-9A8C54510966D8DA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #ffc947, #ff8c42)",
                    color: "#1a0f0a",
                    padding: "1rem 1.5rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px rgba(255, 201, 71, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #ff8c42, #ff6b35)";
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 140, 66, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #ffc947, #ff8c42)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 201, 71, 0.4)";
                  }}
                >
                  💳 Pay with Bit
                </a>
                {(() => {
                  const isPurchased = purchasedCourses.some(c => c.courseId === course.id);
                  return (
                    <div>
                      <button
                        onClick={() => !isPurchased && addCourse(course.id)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "center",
                          background: isPurchased 
                            ? "linear-gradient(135deg, #4caf50, #2e7d32)" 
                            : "linear-gradient(135deg, #ffc947, #ff8c42)",
                          color: "white",
                          padding: "1rem 1.5rem",
                          borderRadius: "12px",
                          border: "none",
                          cursor: isPurchased ? "default" : "pointer",
                          marginTop: "0.7rem",
                          fontWeight: "700",
                          fontSize: "1.1rem",
                          transition: "all 0.3s ease",
                          opacity: isPurchased ? 1 : 1,
                          boxShadow: isPurchased ? "0 4px 15px rgba(76, 175, 80, 0.5)" : "0 4px 15px rgba(255, 201, 71, 0.4)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isPurchased) {
                            e.currentTarget.style.background = "linear-gradient(135deg, #ff8c42, #ff6b35)";
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 140, 66, 0.6)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isPurchased) {
                            e.currentTarget.style.background = "linear-gradient(135deg, #ffc947, #ff8c42)";
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 201, 71, 0.4)";
                          }
                        }}
                      >
                        {isPurchased ? "✅ Purchased" : "➕ Mark as Purchased"}
                      </button>
                      {isPurchased && (
                        <button
                          onClick={async (e) => {
                            console.log("🔴 Removing course:", course.id);
                            e.currentTarget.style.background = "linear-gradient(135deg, #b71c1c, #7f0000)";
                            e.currentTarget.textContent = "⏳ Removing...";
                            e.currentTarget.disabled = true;
                            
                            const success = await removeCourse(course.id);
                            
                            if (success) {
                              console.log("✅ Course removed successfully");
                              e.currentTarget.style.background = "linear-gradient(135deg, #4caf50, #45a049)";
                              e.currentTarget.textContent = "✅ Removed!";
                              setTimeout(() => {
                                // הכפתור ייעלם אוטומטית כי isPurchased ישתנה
                              }, 500);
                            } else {
                              e.currentTarget.style.background = "linear-gradient(135deg, #f44336, #d32f2f)";
                              e.currentTarget.textContent = "🗑️ Cancel Course";
                              e.currentTarget.disabled = false;
                            }
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "center",
                            background: "linear-gradient(135deg, #f44336, #d32f2f)",
                            color: "white",
                            padding: "1rem 1.5rem",
                            borderRadius: "12px",
                            border: "none",
                            cursor: "pointer",
                            marginTop: "0.7rem",
                            fontWeight: "700",
                            fontSize: "1.1rem",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(244, 67, 54, 0.4)",
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.background = "linear-gradient(135deg, #d32f2f, #b71c1c)";
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = "0 6px 20px rgba(244, 67, 54, 0.6)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.background = "linear-gradient(135deg, #f44336, #d32f2f)";
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "0 4px 15px rgba(244, 67, 54, 0.4)";
                            }
                          }}
                        >
                          🗑️ Cancel Course
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>


        {/* Contact Info */}
        <div className="contact-section">
          <h3 className="contact-title">
            Have Questions?
          </h3>
          <p className="contact-description">
            Contact Chef Madar for more information about our courses
          </p>
          <div className="contact-buttons">
            <button
              onClick={() => {
                navigator.clipboard.writeText('netaneldama@gmail.com');
                alert('Email copied to clipboard! ✅');
              }}
              style={{
                padding: "1rem 2rem",
                background: "linear-gradient(135deg, #ffc947, #ff8c42)",
                color: "#1a0f0a",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(255, 201, 71, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 201, 71, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 201, 71, 0.4)";
              }}
            >
              📧 netaneldama@gmail.com
            </button>
            <a
              href="https://wa.me/972535378985?text=Hello%20Chef%20Madar%2C%20I%20would%20like%20to%20know%20more%20about%20the%20courses"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "1rem 2rem",
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "1.1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(37, 211, 102, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 211, 102, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(37, 211, 102, 0.4)";
              }}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
