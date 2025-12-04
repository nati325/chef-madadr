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
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import CommunityRecipes from "./pages/CommunityRecipes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoursesManager from "./pages/AdminCoursesManager";

// 👇 ייבוא הקונטקסט
import { FavoritesProvider } from "./context/FavoritesContext";
import { CourseProvider } from "./context/CourseContext";

function App() {
  return (
    // 👇 Here we wrap everything that needs access to favorites and courses
    <CourseProvider>
      <FavoritesProvider>
        <>
          <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/res" element={<RecipesAZ />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/community-recipes" element={<CommunityRecipes />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-courses" element={<AdminCoursesManager />} />
        </Routes>
      </>
    </FavoritesProvider>
    </CourseProvider>
  );
}

export default App;
