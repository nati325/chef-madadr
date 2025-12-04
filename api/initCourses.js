import fetch from "node-fetch";

const API_BASE_URL = "http://localhost:5000";
const adminToken = process.env.ADMIN_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzA0MDJkZTllYWExZDE0ZTZmMjQxZCIsImVtYWlsIjoibHVsdUBnbWFpbC5jb20iLCJpYXQiOjE3NjQ4MzMxNjAsImV4cCI6MTc2NDkxOTU2MH0.fdw2HzGBS9Ej2VxMrDgRxjft93PHY6B9qUufzy9Haog";

const courses = [
  {
    title: "Gluten-Free Cooking",
    description: "Learn to create delicious gluten-free dishes without compromising on taste. Master alternative flours, binding techniques, and creative recipes suitable for gluten-sensitive diets.",
    price: 280,
    location: "Tzahal 24, Beit Dagan",
    date: "2026-01-05T10:00:00",
    maxSeats: 20
  },
  {
    title: "Yemenite Cuisine",
    description: "Discover the rich flavors and traditional techniques of Yemenite cooking. From jachnun and malawach to aromatic spice blends and slow-cooked stews.",
    price: 195,
    location: "Tzahal 24, Beit Dagan",
    date: "2026-01-12T17:00:00",
    maxSeats: 20
  },
  {
    title: "Healthy Cooking",
    description: "Transform your cooking with nutritious ingredients and balanced recipes. Learn meal prep, portion control, and how to make healthy food taste amazing.",
    price: 250,
    location: "Tzahal 24, Beit Dagan",
    date: "2026-01-08T18:00:00",
    maxSeats: 20
  }
];

async function addCourses() {
  for (const course of courses) {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify(course)
    });
    const data = await res.json();
    console.log(`Added course: ${data.course?.title || course.title}`);
  }
}

addCourses();
