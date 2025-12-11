import AppoitmentModel from "../models/AppoitmentModel.js";

export const createAppoitment = async (req, res) => {
    const { firstName, lastName, email, phone, date, time } = req.body;

    // Validate Time against Enum (since checking against Model schema enum isn't automatic in simple controller checks without saving)
    const validTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
    if (!validTimes.includes(time)) {
        return res.status(400).json({ message: "Invalid time selected. Valids: " + validTimes.join(", ") });
    }

    // Validate Date (Future only)
    const choosenDate = new Date(date);
    const now = new Date();
    // Reset time to midnight for fair date comparison
    now.setHours(0, 0, 0, 0);
    // Be careful with choosenDate timezone, but client sends YYYY-MM-DD which usually parses to UTC midnight.
    // Safest is to compare date strings if we want to allow "Today".

    // Better Approach:
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
        return res.status(400).json({ message: "Invalid date. Please choose a future date." });
    }

    // Check collision strictness if needed (currently strictly one per day?)
    // User logic: const exsist = await AppoitmentModel.findOne({ date });
    // This looks for EXACT match. Client sends "2025-12-09".
    // DB stores Date object. 
    // If we save `date: "2025-12-09"`, Mongo might cast it to Date.
    // If Model says `date: Date`, it saves as ISODate("2025-12-09T00:00:00Z").
    // So findOne({date: "2025-12-09"}) might work if casted, or might fail if time differs.
    // Let's ensure we are querying correctly. 



    // Check availability (Date AND Time)
    // The user originally checked only DATE, which would block the whole day.
    // But since they added TIME selection, surely they want to allow multiple appts per day at different times?
    // I will check { date, time } to be smart.
    const exsist = await AppoitmentModel.findOne({ date, time });
    if (exsist) {
        return res.status(200).json({ message: "This time slot is already taken." });
    }

    const appoitment = await AppoitmentModel.create({ firstName, lastName, email, phone, date, time });
    return res.status(200).json({ message: "success", appoitment });
};

export const deleteAppoitment = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(200).json({ message: "please provide id" });
    }
    const appoitment = await AppoitmentModel.findByIdAndDelete(id);
    if (!appoitment) {
        return res.status(200).json({ message: "its not found" });
    }
    return res.status(200).json({ message: "its deleted", appoitment });
};

export const getAppoitment = async (req, res) => {
    const appoitment = await AppoitmentModel.find();
    return res.status(200).json({ message: "success", appoitment });
};

export const getOccupiedDates = async (req, res) => {
    try {
        const appointments = await AppoitmentModel.find({}, 'date'); // Fetch only dates
        const occupiedDates = appointments.map(app => app.date.toISOString().split('T')[0]);
        // Remove duplicates if any (though logic says 1 per day currently)
        const uniqueDates = [...new Set(occupiedDates)];
        return res.status(200).json({ success: true, occupiedDates: uniqueDates });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch occupied dates" });
    }
};