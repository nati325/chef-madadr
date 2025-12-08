// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/home";      // כמו אצלך
import RecipesAZ from "./pages/RecipesAZ";
import Profile from "./pages/profile";
import Login from "./pages/login";
import Register from "./pages/register";
import RecipeDetails from "./pages/RecipeDetails";
import About from "./pages/about";
import Courses from "./pages/courses";
import CourseDetails from "./pages/CourseDetails";

import CommunityRecipes from "./pages/CommunityRecipes";
import EditRecipe from "./pages/EditRecipe";
import AdminDashboard from "./pages/AdminDashboard";

// 👇 ייבוא הקונטקסט
import { FavoritesProvider } from "./context/FavoritesContext";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    <FavoritesProvider>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/res" element={<RecipesAZ />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/community-recipes" element={<CommunityRecipes />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </>
    </FavoritesProvider>
  );
}

export default App;
