import React, { useEffect, useState } from "react";
import { useCourses } from "../context/CourseContext";
import { getCourses } from "../apirecipe/courseApi";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null); // Here we'll save the user from the server
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { courses: purchasedCourses, removeCourse } = useCourses(); // ← Purchased course objects from context
  const [allCourses, setAllCourses] = useState([]); // All courses from DB
  const [heroImages, setHeroImages] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // The token we saved in login/register

        if (!token) {
          setError("No token – please login first");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json(); // Read json once

        if (!res.ok) {
          throw new Error(data.message || "Error fetching profile");
        }

        setUser(data);

        // After we have the profile - load favorites and courses (client-side filtering)
        // Favorites are recipe IDs from TheMealDB API, need to load each one by idMeal
        try {
          const favArray = data.favoriteMeals || data.favorites || [];
          if (Array.isArray(favArray) && favArray.length) {
            const favPromises = favArray.map(async (mealId) => {
              try {
                const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
                const json = await res.json();
                return json.meals ? json.meals[0] : null;
              } catch (err) {
                console.warn('Failed to load meal:', mealId, err);
                return null;
              }
            });
            const loadedMeals = await Promise.all(favPromises);
            const validMeals = loadedMeals.filter(m => m !== null);
            setFavorites(validMeals);
          }
        } catch (e) { console.warn('recipes load failed', e) }

        // prepare hero images: prefer explicit user.heroImages, then favorites' images, then course images, then defaults
        try {
          const imgs = [];
          if (Array.isArray(data.heroImages) && data.heroImages.length) imgs.push(...data.heroImages);
          if (!imgs.length && Array.isArray(data.favorites) && data.favorites.length) {
            // use first favorite images (filled from favs if available)
            // note: favorites state may not be set synchronously here; try to extract from fetched favs above
            // fallback - we will set heroImages below after favorites state updated
          }
          // lastly fallback defaults
          if (!imgs.length) {
            imgs.push('/public/hero1.jpg');
            imgs.push('/public/hero2.jpg');
            imgs.push('/public/hero3.jpg');
          }
          setHeroImages(imgs);
        } catch (e) { console.warn('hero setup failed', e) }
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // rotate hero images
  useEffect(() => {
    // Load all courses from DB for display
    async function loadAllCourses() {
      try {
        const data = await getCourses();
        setAllCourses(data);
      } catch (err) {
        // ignore
      }
    }
    loadAllCourses();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <p style={{ color: "white" }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="card-empty">
          <p style={{ color: "#ff9b9b" }}>{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="card-empty">
          <p>User data not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">{getInitials(user.name)}</div>

          <div className="profile-info">
            <h2 className="profile-name">Hello, {user.name}</h2>
            <p className="profile-email">Email: {user.email}</p>

            <p className="profile-row">
              <strong>Join Date: </strong>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </p>

            {user.isAdmin && (
              <div className="admin-badge">🛡 Admin User</div>
            )}
          </div>

          <aside className="profile-side">
            <div className="side-block">
              <h4>Favorites</h4>
              {favorites.length === 0 && <div className="fav-sub">No favorite items</div>}
              {favorites.map((f) => (
                <a key={f.idMeal} className="fav-item" href={`/recipe/${f.idMeal}`}>
                  {f.strMealThumb ? (
                    <img className="fav-thumb" src={f.strMealThumb} alt={f.strMeal || 'recipe'} />
                  ) : (
                    <div className="fav-thumb" />
                  )}
                  <div>
                    <div className="fav-title">{f.strMeal}</div>
                    <div className="fav-sub">{f.strCategory} • {f.strArea}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="side-block">
              <h4>Purchased Courses</h4>
              {purchasedCourses.length === 0 && <div className="fav-sub">No courses purchased yet</div>}
              {purchasedCourses.map((c) => {
                // Match by courseId or _id
                const courseDetails = allCourses.find(course => String(course._id) === String(c.courseId || c._id));
                if (!courseDetails) return null;
                return (
                  <div key={c.courseId || c._id} className="course-item">
                    <div
                      className="course-thumb"
                      style={{ backgroundImage: `url(${courseDetails.image})` }}
                    />
                    <div className="course-info">
                      <div className="course-title">
                        {courseDetails.title}
                      </div>
                      <div className="course-status">
                        ✅ Registered
                      </div>
                    </div>
                    <button
                      className="course-cancel-btn"
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to cancel this course?')) {
                          await removeCourse(c.courseId || c._id);
                        }
                      }}
                    >
                      🗑️ Cancel
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        {/* floating hero outside the card on the right */}
        {heroImages && heroImages.length > 0 && (
          <a
            className="floating-hero"
            href={'/'}
            style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
          >
            <div className="overlay">Start Cooking Now</div>
          </a>
        )}
      </div>
    </div>
  );
}

export default Profile;
