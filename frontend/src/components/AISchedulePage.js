import React, { useState } from "react";
import ModuleModal from "./ModuleModal";

const AISchedulePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modules, setModules] = useState([{ courseName: "", ects: "" }]);

  const handleSave = () => {
    console.log("Modules:", modules);
    // ✨ Send modules to backend using fetch/axios here
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#C29700] text-white px-4 py-2 rounded-lg shadow"
      >
        Add Modules
      </button>

      <ModuleModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        modules={modules}
        setModules={setModules}
        onSave={handleSave}
      />
    </div>
  );
};

export default AISchedulePage;
