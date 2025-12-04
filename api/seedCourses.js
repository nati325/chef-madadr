// Usage: node seedCourses.js <ADMIN_TOKEN>
// Example: node seedCourses.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = "http://localhost:5000";
const adminToken = process.argv[2];

if (!adminToken) {
  console.error("Please provide your admin JWT token as an argument.");
  process.exit(1);
}

const courses = [
  {
    title: "Gluten-Free Cooking",
    description: "Learn to create delicious gluten-free dishes without compromising on taste. Master alternative flours, binding techniques, and creative recipes suitable for gluten-sensitive diets.",
    duration: "8 weeks",
    schedule: "Starting January 5th, Sundays 10:00-13:00",
    price: "₪280",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=250&fit=crop",
    maxSeats: 20
  },
  {
    title: "Yemenite Cuisine",
    description: "Discover the rich flavors and traditional techniques of Yemenite cooking. From jachnun and malawach to aromatic spice blends and slow-cooked stews.",
    duration: "6 weeks",
    schedule: "Starting January 12th, Tuesdays 17:00-20:00",
    price: "₪195",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=250&fit=crop",
    maxSeats: 20
  },
  {
    title: "Healthy Cooking",
    description: "Transform your cooking with nutritious ingredients and balanced recipes. Learn meal prep, portion control, and how to make healthy food taste amazing.",
    duration: "10 weeks",
    schedule: "Starting January 8th, Thursdays 18:00-21:00",
    price: "₪250",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
    maxSeats: 20
  }
];

async function deleteAllCourses() {
  const res = await fetch(`${API_BASE_URL}/api/courses`, { method: "GET" });
  const allCourses = await res.json();
  for (const course of allCourses) {
    await fetch(`${API_BASE_URL}/api/courses/${course._id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    console.log(`Deleted course: ${course.title}`);
  }
}

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

(async () => {
  await deleteAllCourses();
  await addCourses();
  console.log("Done!");
})();
