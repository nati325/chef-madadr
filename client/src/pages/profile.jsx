import React, { useEffect, useState } from "react";
import { useCourses } from "../context/CourseContext";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null); // Here we'll save the user from the server
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { courses, removeCourse } = useCourses(); // ← Courses from Context!
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
        try{
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
        }catch(e){ console.warn('recipes load failed',e) }

        // prepare hero images: prefer explicit user.heroImages, then favorites' images, then course images, then defaults
        try{
          const imgs = [];
          if (Array.isArray(data.heroImages) && data.heroImages.length) imgs.push(...data.heroImages);
          if (!imgs.length && Array.isArray(data.favorites) && data.favorites.length){
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
        }catch(e){ console.warn('hero setup failed', e) }
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
  useEffect(()=>{
    if(!heroImages || heroImages.length <= 1) return;
    const t = setInterval(()=>{
      setHeroIndex(i => (i+1) % heroImages.length)
    }, 4500);
    return ()=> clearInterval(t);
  },[heroImages])

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
            {courses.length === 0 && <div className="fav-sub">No courses purchased yet</div>}
            {courses.map((c) => {
              // Find course details by courseId
              const courseDetails = [
                { id: 1, title: "Gluten-Free Cooking", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=250&fit=crop" },
                { id: 2, title: "Yemenite Cuisine", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=250&fit=crop" },
                { id: 3, title: "Healthy Cooking", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop" }
              ].find(course => course.id === c.courseId);

              if (!courseDetails) return null;

              return (
                <div key={c.courseId} className="course-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
                  <div
                    className="fav-thumb"
                    style={{ 
                      backgroundImage: `url(${courseDetails.image})`, 
                      backgroundSize: 'cover',
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      marginRight: '1rem'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="fav-title" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {courseDetails.title}
                    </div>
                    <div className="fav-sub" style={{ 
                      color: c.status === 'paid' ? '#4caf50' : '#ff9800',
                      fontWeight: '600'
                    }}>
                      {c.status === 'paid' ? '✅ Paid' : '⏳ Pending Payment'}
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      console.log("🔴 Removing course from profile:", c.courseId);
                      const success = await removeCourse(c.courseId);
                      if (success) {
                        console.log("✅ Course removed successfully from profile");
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #d32f2f, #b71c1c)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
                      e.currentTarget.style.transform = 'scale(1)';
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
