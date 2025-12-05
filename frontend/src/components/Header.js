import React, { useState } from "react";
import ModuleModal from "./ModuleModal";

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modules, setModules] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
        <button className="bg-[#0065bd] hover:bg-[#005aab] text-white px-4 py-2 rounded-lg shadow">
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
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow">
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
    </header>
  );
};

export default Header;
