import React, { useState, useEffect } from "react";
import { getAdminStats } from "../apirecipe/adminApi";
import AdminCoursesManager from "./AdminCoursesManager";
import AdminAppointments from "./AdminAppointments";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      console.log("📊 Admin stats received:", data);
      console.log("📊 Stats object:", data.stats);
      console.log("📊 Totals:", data.stats?.totals);
      console.log("📊 Users count:", data.stats?.totals?.users);
      console.log("📊 Most liked recipes:", data.stats?.mostLikedRecipes);
      console.log("📊 User Engagement:", data.stats?.userEngagement);
      console.log("📊 User Engagement length:", data.stats?.userEngagement?.length);
      setStats(data.stats);
    } catch (err) {
      console.error("❌ Error loading stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="admin-error">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="admin-error">No data available</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "popular" ? "active" : ""}
          onClick={() => setActiveTab("popular")}
        >
          Popular Content
        </button>
        <button
          className={activeTab === "courses" ? "active" : ""}
          onClick={() => setActiveTab("courses")}
        >
          Manage Courses
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          Scheduled Appointments
        </button>
      </div>
      {activeTab === "appointments" && (
        <AdminAppointments />
      )}
      {activeTab === "courses" && (
        <AdminCoursesManager />
      )}

      {activeTab === "overview" && (
        <div className="overview-section">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>👥 Total Users</h3>
              <p className="stat-number">{stats.totals.users}</p>
            </div>
            <div className="stat-card">
              <h3>🍳 Community Recipes</h3>
              <p className="stat-number">{stats.totals.recipes}</p>
            </div>
            <div className="stat-card">
              <h3>📚 Total Courses</h3>
              <p className="stat-number">{stats.totals.courses}</p>
            </div>
          </div>

          <div className="recent-users">
            <h2>Recent Users</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="users-section">
          <h2>User Engagement</h2>
          {console.log("🔵 Rendering users, count:", stats.userEngagement?.length)}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Favorites</th>
                <th>Courses</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Test</td>
                <td>test@email.com</td>
                <td>5</td>
                <td>2</td>
                <td>2025-12-04</td>
              </tr>
              {stats.userEngagement?.map((user, index) => {
                console.log("🔵 Rendering user:", user);
                return (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.favoritesCount}</td>
                    <td>{user.coursesCount}</td>
                    <td>{new Date(user.joinedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "popular" && (
        <div className="popular-section">
          <div className="popular-recipes">
            <h2>Most Favorited API Recipes</h2>
            <table>
              <thead>
                <tr>
                  <th>Recipe Title</th>
                  <th>Favorites</th>
                </tr>
              </thead>
              <tbody>
                {stats.mostFavoritedApiMeals?.map((meal) => (
                  <tr key={meal.mealId}>
                    <td>{meal.title}</td>
                    <td>❤️ {meal.favoritesCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="popular-courses">
            <h2>Most Enrolled Courses</h2>
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Enrollments</th>
                </tr>
              </thead>
              <tbody>
                {stats.mostEnrolledCourses.map((course) => (
                  <tr key={course.courseId}>
                    <td>{course.title}</td>
                    <td>📚 {course.enrolledCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
