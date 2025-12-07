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
      <NavLink to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>the crazy recipe of chef madar</h1>
      </NavLink>
      <nav>
        <NavLink to="/">home</NavLink>
        <NavLink to="/profile">profile</NavLink>
        <NavLink to="/courses">courses</NavLink>
        <NavLink to="/community-recipes">community recipes</NavLink>
        {isAdmin && <NavLink to="/admin">📊 Admin</NavLink>}
        <NavLink to="/login">log in</NavLink>
        <NavLink to="/res">Res</NavLink>
        <NavLink to="/register">register</NavLink>
        <NavLink to="/about">about</NavLink>
      </nav>
    </header>
  );
};

export default Header;
