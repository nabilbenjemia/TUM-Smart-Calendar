import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleModal from "./ModuleModal";
import EventModal from "./EventModal";

const Header = ({ timeslots, setTimeslots, onLogout, onScheduleSaved }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);

  const openModal = () => {
    setModules([{ courseName: "", ects: "", examDateTime: "", durationMinutes: "" }]);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleAddEvent = () => {
    setIsEventModalOpen(true);
  };

  const handleLogout = () => {
    console.log("User clicked on logout");
    onLogout();
    navigate("/login");
  };

  const saveEvent = async (event) => {
    try {
      const userId = localStorage.getItem("userId") || "1";
      console.log("Saving manual event:", event);

      const payload = {
        userId: userId,
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        type: "STUDY", // Default for manual events
        source: "MANUAL"
      };

      const response = await fetch(`/api/calendar/${userId}/timeslots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Event saved to backend successfully");

      // Refresh events from backend to ensure consistency
      if (onScheduleSaved) {
        onScheduleSaved();
      }

      setIsEventModalOpen(false);
    } catch (err) {
      console.error("Error saving manual event:", err);
      alert("Failed to save event: " + err.message);
    }
  };

  const saveModules = async (data) => {
    console.log("=== SENDING TO CALENDAR API ===");
    console.log("Received data:", data);

    if (!data || !data.exams) {
      console.log("No data provided, just closing modal");
      setIsModalOpen(false);
      return;
    }

    setIsAILoading(true);
    try {
      const userId = localStorage.getItem("userId") || "1";

      const payload = {
        exams: data.exams.map((exam, idx) => ({
          id: String(idx + 1),
          courseName: exam.courseName,
          ects: parseInt(exam.ects, 10) || 0,
          examDateTime: exam.examDateTime,
          durationMinutes: parseInt(exam.durationMinutes, 10) || 0
        })),
        freeSlots: data.freeSlots || []
      };

      console.log("URL:", `/api/calendar/${userId}/schedule`);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`/api/calendar/${userId}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log("Calendar API Response:", result);
      alert(result);

      // Refresh calendar events
      if (onScheduleSaved) {
        onScheduleSaved();
      }

    } catch (err) {
      console.error("Error calling Calendar API:", err);
      alert("Error: " + err.message);
    } finally {
      setIsAILoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 mb-2 bg-white shadow">
      {/* Left: Buttons */}
      <div className="flex items-center space-x-2">
        <button className="bg-[#0065bd] hover:bg-[#005aab] text-white px-4 py-2 rounded-lg shadow">
          Import Calendar
        </button>
        <button className="bg-[#0065bd] hover:bg-[#005aab] text-white px-4 py-2 rounded-lg shadow"
          onClick={() => handleAddEvent()}>
          Add Event
        </button>
        <button className="bg-[#EFBF04] hover:bg-[#C29700] text-white px-4 py-2 rounded-lg shadow relative"
          onClick={() => setIsModalOpen(true)}>
          <img
            src="/new_logo2.png"
            alt="AI Logo"
            className="w-8 h-8 absolute -top-2 -right-3 bg-white rounded-full p-0.4"
          />
          AI Schedule
        </button>
      </div>

      {/* Center: Logo + Title */}
      <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
        <img
          src="/TUM_Logo.svg"
          alt="TUM Logo"
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold text-[#0065bd]">
          Smart Calendar
        </h1>
      </div>

      {/* Right: Logout */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>



      {/* Module Modal */}
      <ModuleModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modules={modules}
        setModules={setModules}
        onSave={saveModules}
        isLoading={isAILoading}
      />

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={saveEvent}
      />
    </header>
  );
};

export default Header;
