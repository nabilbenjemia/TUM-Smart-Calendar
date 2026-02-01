import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import CalendarView from "../components/CalendarView";
import Header from "../components/Header";

function CalendarPage({ onLogout }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from backend
  const fetchEvents = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId") || "1";
      console.log("Fetching events for user:", userId);

      const response = await fetch(`/api/calendar/${userId}/events`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const events = await response.json();
      console.log("Fetched events:", events);

      // Transform backend events to frontend format
      const formattedEvents = events.map(event => ({
        id: event.id,                             // Include the ID for deletion
        date: event.startTime.slice(0, 10),           // "2026-01-29"
        startTime: event.startTime.slice(11, 16),     // "10:00"
        endTime: event.endTime.slice(11, 16),         // "12:00"
        text: event.title,
        type: event.type,
        color: event.color
      }));

      setTimeslots(formattedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      // Keep empty array on error
      setTimeslots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Callback to refresh after saving schedule
  const handleScheduleSaved = () => {
    console.log("Schedule saved, refreshing events...");
    fetchEvents();
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId, eventType) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const userId = localStorage.getItem("userId") || "1";
      // We only support deleting STUDY slots for now as per backend implementation
      // But we can check type if needed. Backend endpoint is /api/calendar/{userId}/timeslots/{slotId}
      const endpoint = `/api/calendar/${userId}/timeslots/${eventId}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Event deleted successfully");
      fetchEvents(); // Refresh list
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        onLogout={onLogout}
        onScheduleSaved={handleScheduleSaved}
      />
      <div className="flex mx-2 mb-2 gap-2 flex-auto">
        <Sidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <CalendarView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          timeslots={timeslots}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  );
}

export default CalendarPage;