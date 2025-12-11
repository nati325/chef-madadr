import mongoose from "mongoose";
import Course from "./models/courseModel.js";
import User from "./models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/project";

const newCourses = [
    {
        title: "Sous Vide Mastery",
        description: "Unlock the secrets of precision cooking. Learn how to cook steak, fish, and vegetables to perfection every single time using the sous vide technique. Includes equipment guide and safety tips.",
        price: 350,
        location: "Chef Madar Studio, Tel Aviv",
        date: new Date("2024-02-15T18:00:00"),
        maxSeats: 15,
        image: "https://images.unsplash.com/photo-1627916576852-706bb17300c1?w=500&h=300&fit=crop",
    },
    {
        title: "The Art of Chocolate",
        description: "Dive into the world of tempering, molding, and ganache. Create professional-grade truffles, pralines, and chocolate decorations in this hands-on workshop for sweet tooths.",
        price: 400,
        location: "Chef Madar Studio, Tel Aviv",
        date: new Date("2024-02-22T17:00:00"),
        maxSeats: 12,
        image: "https://images.unsplash.com/photo-1606312619070-d48b706521bf?w=500&h=300&fit=crop",
    }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB.");

        // Find an admin or any user to assign as creator
        const admin = await User.findOne();
        if (!admin) {
            console.error("No users found to assign as creator. Please register a user first.");
            process.exit(1);
        }

        const coursesWithCreator = newCourses.map(c => ({
            ...c,
            createdBy: admin._id
        }));

        await Course.insertMany(coursesWithCreator);
        console.log(`Successfully added ${coursesWithCreator.length} new courses!`);

        process.exit();
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seed();
