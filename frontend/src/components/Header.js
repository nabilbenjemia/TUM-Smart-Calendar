import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleModal from "./ModuleModal";
import EventModal from "./EventModal";

const Header = ({ timeslots, setTimeslots, onLogout }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [modules, setModules] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddEvent = () => {
        setIsEventModalOpen(true);
    };

    const handleLogout = () => {
        console.log("User clicked on logout");
        onLogout();
        navigate("/login");
    };

    const saveEvent = (event) => {
      /**
       * add POST call to backend here to save event
       */
        console.log("Event saved:", event);
        const newEvent = {
            date: event.startTime.slice(0, 10),       // "2025-12-15"
            startTime: event.startTime.slice(11, 16), // "12:00"
            endTime: event.endTime.slice(11, 16),     // "14:00"
            text: event.title
        };
        setTimeslots([...timeslots, newEvent]);
        setIsEventModalOpen(false);
    };

    const saveModules = () => {
        console.log("Modules saved:", modules);
        setIsModalOpen(false);
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
