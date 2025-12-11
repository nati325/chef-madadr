import mongoose from "mongoose";

const AppoitmentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    date: Date,
    time: {
        type: String,
        enum: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Appoitment", AppoitmentSchema);
