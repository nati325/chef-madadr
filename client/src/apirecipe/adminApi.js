const API_BASE_URL = "http://localhost:5000";

export const getAdminStats = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token ? "exists" : "missing");
    
    if (!token) {
      throw new Error("No token found. Please login.");
    }

    console.log("📡 Fetching admin stats from:", `${API_BASE_URL}/api/admin/stats`);
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    console.log("📡 Response status:", response.status);
    const data = await response.json();
    console.log("📡 Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch admin stats");
    }

    return data;
  } catch (error) {
    console.error("❌ Error getting admin stats:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("No token found. Please login.");
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    return data;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};
