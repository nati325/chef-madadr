import React, { useState, useEffect } from "react";
import "./AdminDashboard.css"; // Reuse dashboard styles

const AdminAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppt, setSelectedAppt] = useState(null); // For modal

    // Fetch all appointments
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/appointments/get");
            const data = await res.json();
            if (data.appoitment) { // Note the typo from backend "appoitment"
                setAppointments(data.appoitment);
            }
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    // Generate next 30 days
    const getNext30Days = () => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            days.push(nextDay.toISOString().split('T')[0]);
        }
        return days;
    };

    const daysList = getNext30Days();

    // Helper to find appointment for a specific date
    const getApptForDate = (dateStr) => {
        // Backend stores date as ISO Date object usually. 
        // We need to compare specific YYYY-MM-DD.
        return appointments.find(appt => {
            if (!appt.date) return false;
            return appt.date.startsWith(dateStr) || appt.date.split('T')[0] === dateStr;
        });
    };

    return (
        <div className="admin-appointments-section">
            <h2>📅 Scheduled Appointments (Next 30 Days)</h2>

            {loading ? (
                <p>Loading calendar...</p>
            ) : (
                <div className="admin-calendar-grid">
                    {daysList.map((dateStr) => {
                        const appt = getApptForDate(dateStr);
                        const isBooked = !!appt;

                        return (
                            <div
                                key={dateStr}
                                className={`admin-calendar-day ${isBooked ? "booked" : "empty"}`}
                                onClick={() => isBooked && setSelectedAppt(appt)}
                                title={isBooked ? "Click for details" : "Available"}
                            >
                                <div className="day-header">
                                    <span className="day-number">{dateStr.split("-")[2]}</span>
                                    <span className="day-month">{dateStr.split("-")[1]}</span>
                                </div>

                                {isBooked ? (
                                    <div className="booked-mark">
                                        <span className="checkmark">✔</span>
                                        <span className="mini-time">{appt.time}</span>
                                    </div>
                                ) : (
                                    <span className="empty-dash">-</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Details Modal */}
            {selectedAppt && (
                <div className="admin-modal-overlay" onClick={() => setSelectedAppt(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedAppt(null)}>&times;</button>
                        <h3>Appointment Details</h3>
                        <div className="modal-content">
                            <p><strong>Date:</strong> {selectedAppt.date?.split('T')[0]}</p>
                            <p><strong>Time:</strong> {selectedAppt.time}</p>
                            <hr />
                            <p><strong>Client:</strong> {selectedAppt.firstName} {selectedAppt.lastName}</p>
                            <p><strong>Email:</strong> {selectedAppt.email}</p>
                            <p><strong>Phone:</strong> {selectedAppt.phone}</p>
                            <p><strong>Booked At:</strong> {new Date(selectedAppt.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="modal-actions">
                            <a href={`https://wa.me/${selectedAppt.phone}`} target="_blank" rel="noreferrer" className="action-btn whatsapp">
                                Chat (WhatsApp)
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAppointments;
