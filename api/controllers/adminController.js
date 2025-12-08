import User from "../models/userModel.js";
import Recipe from "../models/recipeModel.js";
import Course from "../models/courseModel.js";

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Get all users with their favorites and courses
    const users = await User.find({})
      .select("name email favorites courses createdAt")
      .populate("favorites", "title");

    // Calculate engagement stats
    const userEngagement = users.map(user => ({
      name: user.name,
      email: user.email,
      favoritesCount: user.favorites?.length || 0,
      coursesCount: user.courses?.length || 0,
      joinedAt: user.createdAt
    }));

    // Get most favorited recipes (by counting how many users added each recipe to favorites)
    // For community recipes (local MongoDB recipes)
    const allUsersWithFavorites = await User.find({}).select("favorites");

    const recipeFavoriteMap = {};
    allUsersWithFavorites.forEach(user => {
      user.favorites.forEach(recipeId => {
        const id = recipeId.toString();
        if (!recipeFavoriteMap[id]) {
          recipeFavoriteMap[id] = 0;
        }
        recipeFavoriteMap[id]++;
      });
    });

    const topFavoritedRecipeIds = Object.entries(recipeFavoriteMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ id, count }));

    const mostLikedRecipes = await Promise.all(
      topFavoritedRecipeIds.map(async ({ id, count }) => {
        const recipe = await Recipe.findById(id).select("title createdBy");
        return {
          _id: id,
          title: recipe?.title || "Unknown Recipe",
          favoritesCount: count
        };
      })
    );

    // Get most favorited API meals (from favoriteMeals)
    const allUsersWithApiMeals = await User.find({}).select("favoriteMeals");

    const apiMealFavoriteMap = {};
    allUsersWithApiMeals.forEach(user => {
      user.favoriteMeals.forEach(mealId => {
        if (!apiMealFavoriteMap[mealId]) {
          apiMealFavoriteMap[mealId] = 0;
        }
        apiMealFavoriteMap[mealId]++;
      });
    });

    const mostFavoritedApiMeals = await Promise.all(
      Object.entries(apiMealFavoriteMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(async ([mealId, count]) => {
          try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();
            const title = data.meals ? data.meals[0].strMeal : `Unknown Recipe (${mealId})`;
            return {
              mealId,
              title,
              favoritesCount: count
            };
          } catch (err) {
            console.error(`Failed to fetch details for meal ${mealId}:`, err);
            return {
              mealId,
              title: `Recipe #${mealId}`,
              favoritesCount: count
            };
          }
        })
    );

    // Get most enrolled courses
    const allUsers = await User.find({}).select("courses");

    // Count enrollments per course ID
    // Count enrollments per course ID
    const courseEnrollmentMap = {};
    allUsers.forEach(user => {
      user.courses.forEach(course => {
        const courseId = course.courseId;
        if (!courseEnrollmentMap[courseId]) {
          courseEnrollmentMap[courseId] = {
            courseId: courseId,
            title: "Unknown Course", // Will be updated
            enrolledCount: 0
          };
        }
        courseEnrollmentMap[courseId].enrolledCount++;
      });
    });

    // Fetch course titles
    const courseIds = Object.keys(courseEnrollmentMap);
    const courses = await Course.find({ _id: { $in: courseIds } }).select("title");

    courses.forEach(course => {
      const courseIdStr = course._id.toString();
      if (courseEnrollmentMap[courseIdStr]) {
        courseEnrollmentMap[courseIdStr].title = course.title;
      }
    });

    const mostEnrolledCourses = Object.values(courseEnrollmentMap)
      .sort((a, b) => b.enrolledCount - a.enrolledCount)
      .slice(0, 10);

    // Recent activity (last 10 users joined)
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name email createdAt");

    res.json({
      success: true,
      stats: {
        totals: {
          users: totalUsers,
          recipes: totalRecipes,
          courses: totalCourses
        },
        userEngagement,
        mostLikedRecipes,
        mostFavoritedApiMeals,
        mostEnrolledCourses,
        recentUsers
      }
    });
  } catch (error) {
    console.error("Error getting admin stats:", error);
    res.status(500).json({
      message: "Error fetching admin statistics",
      error: error.message
    });
  }
};

// @desc    Get all users with details
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .populate("favorites", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });
  }
};
