import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is admin from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.isAdmin === true);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, [location]);

  return (
    <header>
      <nav className="nav-left">
        <NavLink to="/">home</NavLink>
        <NavLink to="/profile">profile</NavLink>
        <NavLink to="/courses">courses</NavLink>
        <NavLink to="/community-recipes">community</NavLink>
        {isAdmin && <NavLink to="/admin">📊 Admin</NavLink>}
        <NavLink to="/res">Research</NavLink>
        <NavLink to="/ai">Recipe Generator</NavLink>
        <NavLink to="/about">about</NavLink>
      </nav>

      <div className="nav-center">
        <NavLink to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1>
            <span className="title-long">The Crazy Website of </span>
            <span className="title-short">Chef Madar</span>
          </h1>
        </NavLink>
      </div>

      <nav className="nav-right">
        <NavLink to="/login">log in</NavLink>
        <NavLink to="/register">register</NavLink>
      </nav>
    </header>
  );
};

export default Header;
