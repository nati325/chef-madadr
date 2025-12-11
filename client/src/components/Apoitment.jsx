import React, { useState, useEffect } from "react";
import "./Apoitment.css";

function Apoitment({ onClose }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [occupiedDates, setOccupiedDates] = useState([]); // Store occupied dates

    // Fetch occupied dates on mount
    useEffect(() => {
        const fetchOccupied = async () => {
            try {
                // Fetch from our new endpoint
                const res = await fetch("http://localhost:5000/api/appointments/occupied");
                const data = await res.json();
                if (data.success && Array.isArray(data.occupiedDates)) {
                    setOccupiedDates(data.occupiedDates);
                }
            } catch (err) {
                console.error("Failed to load occupied dates", err);
            }
        };
        fetchOccupied();
    }, []);

    // Helper to generate next 30 days
    const getNext30Days = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            days.push(nextDay.toISOString().split('T')[0]); // Format YYYY-MM-DD
        }
        return days;
    };

    const availableDates = getNext30Days();

    async function submit(e) {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("http://localhost:5000/api/appointments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName, lastName, email, phone, date, time }),
            });
            const data = await response.json();
            if (response.ok || data.success) {
                setStatus({ type: "success", message: "Appointment scheduled successfully! 📅" });
                setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setDate(""); setTime("");
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setStatus({ type: "error", message: data.message || "Failed to schedule." });
            }
        } catch (err) {
            setStatus({ type: "error", message: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="appointment-overlay" onClick={onClose}>
            <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
                <button className="appointment-close-btn" onClick={onClose}>&times;</button>
                <h2>Schedule a Meeting</h2>
                <p className="appointment-subtitle">Let's cook up something great together.</p>

                {status.message && (
                    <div className={`appointment-status ${status.type}`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={submit} className="appointment-form">
                    <div className="form-group-row">
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                    {/* Calendar Grid UI */}
                    <div className="calendar-section">
                        <label className="section-label">Select Date:</label>
                        <div className="calendar-grid">
                            {availableDates.map((d) => {
                                const isOccupied = occupiedDates.includes(d);
                                const isSelected = date === d;
                                return (
                                    <div
                                        key={d}
                                        className={`calendar-day ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                                        onClick={() => !isOccupied && setDate(d)}
                                        title={isOccupied ? "Fully Booked" : d}
                                    >
                                        <div className="day-number">{d.split('-')[2]}</div> {/* Show Day Number */}
                                        <div className="day-month">{d.split('-')[1]}</div> {/* Show Month Number */}
                                        {isOccupied && <div className="occupied-mark">&times;</div>}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Hidden input to satisfy required attribute logic if needed, or handled by state validation */}
                    </div>

                    <div className="time-section">
                        <label className="section-label">Select Time:</label>
                        <select value={time} onChange={(e) => setTime(e.target.value)} required disabled={!date}>
                            <option value="" disabled>Select Time</option>
                            {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={`submit-btn ${status.type === 'success' ? 'success' : ''}`} disabled={loading || !date || !time || status.type === 'success'}>
                        {status.type === 'success' ? "Meeting Scheduled Successfully! ✅" : (loading ? "Scheduling..." : "Confirm Meeting")}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Apoitment;
