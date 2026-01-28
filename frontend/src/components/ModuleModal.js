import React, { useEffect, useRef, useState } from "react";

const ModuleModal = ({ isOpen, onClose, modules, setModules, onSave }) => {
  const hasCleanedUp = useRef(false);
  const scrollContainerRef = useRef(null);
  const [step, setStep] = useState(1); // 1 = modules, 2 = free timeslots
  const [freeSlots, setFreeSlots] = useState([]);

  // Clean up empty modules only when modal opens for the first time
  useEffect(() => {
    if (isOpen && !hasCleanedUp.current) {
      const filtered = modules.filter(
        (m) => m.courseName.trim() !== "" || m.ects.trim() !== ""
      );
      if (filtered.length !== modules.length) {
        setModules(filtered);
      }
      hasCleanedUp.current = true;
    }

    // Reset flag and step when modal closes
    if (!isOpen) {
      hasCleanedUp.current = false;
      setStep(1);
      setFreeSlots([]);
    }
  }, [isOpen, modules, setModules]);

  if (!isOpen) return null;
  const updateField = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const addModule = () => {
    // Check if the last module has all required fields filled
    if (modules.length > 0) {
      const lastModule = modules[modules.length - 1];
      if (!lastModule.courseName.trim() || !lastModule.ects.trim() || !lastModule.examDateTime.trim() || !lastModule.durationMinutes.toString().trim()) {
        alert("Please fill in all fields of the current module before adding a new one.");
        return;
      }
    }
    setModules([...modules, { courseName: "", ects: "", examDateTime: "", durationMinutes: "" }]);
    
    // Scroll to bottom after adding module
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  const deleteModule = (index) => {
    const updated = modules.filter((_, idx) => idx !== index);
    setModules(updated);
  };

  const handleSave = () => {
    // Filter out empty modules before saving
    const filtered = modules.filter(
      (m) => m.courseName.trim() !== "" || m.ects.trim() !== ""
    );
    setModules(filtered);
    onSave();
  };

  const handleContinue = () => {
    const filtered = modules.filter(
      (m) => m.courseName.trim() !== "" || m.ects.trim() !== ""
    );
    setModules(filtered);
    setStep(2);
  };

  const updateFreeSlot = (index, field, value) => {
    const updated = [...freeSlots];
    updated[index][field] = value;
    setFreeSlots(updated);
  };

  const addFreeSlot = () => {
    // Check if the last time slot has all fields filled
    if (freeSlots.length > 0) {
      const lastSlot = freeSlots[freeSlots.length - 1];
      if (!lastSlot.startTime || !lastSlot.startTime.trim() || !lastSlot.endTime || !lastSlot.endTime.trim()) {
        alert("Please fill in all fields of the current time slot before adding a new one.");
        return;
      }
    }
    setFreeSlots([...freeSlots, { startTime: "", endTime: "" }]);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  const deleteFreeSlot = (index) => {
    const updated = freeSlots.filter((_, idx) => idx !== index);
    setFreeSlots(updated);
  };

  const handleFinalSave = () => {
    const filteredSlots = freeSlots.filter(
      (s) => s.startTime && s.startTime.trim() !== "" && s.endTime && s.endTime.trim() !== ""
    );
    
    const data = {
      exams: modules,
      freeSlots: filteredSlots.map(slot => ({
        startTime: slot.startTime,  
        endTime: slot.endTime        
      }))
    };
    
    console.log("Saving data:", JSON.stringify(data, null, 2));
    onSave(data);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-h-[80%] flex flex-col">
        <h2 className="text-lg font-bold mb-4 text-[#0065bd]">
          {step === 1 ? "Add Modules" : "Add Free Time Slots"}
        </h2>

        {step === 1 ? (
          <>
            {/* Scrollable modules area */}
            <div ref={scrollContainerRef} className="overflow-y-auto flex-1 mb-4">
              {modules.map((m, idx) => (
                <div key={idx} className="mb-4 border p-3 rounded-lg bg-gray-50 relative">
                  {/* Delete button */}
                  <button
                    onClick={() => deleteModule(idx)}
                    className="absolute top-0 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                    title="Delete module"
                  >
                    ×
                  </button>

                  <label className="block text-sm font-medium">Module Name</label>
                  <input
                    type="text"
                    value={m.courseName}
                    onChange={(e) => updateField(idx, "courseName", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                    placeholder="e.g. Algorithms"
                  />

                  <label className="block text-sm font-medium mt-2">ECTS</label>
                  <input
                    type="number"
                    value={m.ects}
                    onChange={(e) => updateField(idx, "ects", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                    placeholder="e.g. 5"
                  />

                  <label className="block text-sm font-medium mt-2">Exam Date & Time</label>
                  <input
                    type="datetime-local"
                    value={m.examDateTime}
                    onChange={(e) => updateField(idx, "examDateTime", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                  />

                  <label className="block text-sm font-medium mt-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={m.durationMinutes}
                    max={180}
                    min={60}
                    onChange={(e) => updateField(idx, "durationMinutes", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                    placeholder="e.g. 120"
                    step="30"
                  />
                </div>
              ))}
            </div>

            {/* Fixed buttons at bottom */}
            <button
              onClick={addModule}
              className="bg-[#0065bd] text-white px-3 py-1 rounded-lg w-full mb-4"
            >
              + Add Module
            </button>

            <div className="flex justify-between">
              <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleContinue}
                className="px-4 py-2 rounded-lg bg-[#0065bd] text-white"
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Scrollable free slots area */}
            <div ref={scrollContainerRef} className="overflow-y-auto flex-1 mb-4">
              {freeSlots.map((slot, idx) => (
                <div key={idx} className="mb-4 border p-3 rounded-lg bg-gray-50 relative">
                  <button
                    onClick={() => deleteFreeSlot(idx)}
                    className="absolute top-0 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                    title="Delete time slot"
                  >
                    ×
                  </button>

                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => updateFreeSlot(idx, "date", e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1 mb-2"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium">From</label>
                      <input
                        type="time"
                        value={slot.startTime ? slot.startTime.split("T")[1] || "" : ""}
                        onChange={(e) => {
                          const dateValue = slot.date || "";
                          updateFreeSlot(idx, "startTime", dateValue + "T" + e.target.value);
                        }}
                        className="w-full border rounded px-2 py-1 mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">To</label>
                      <input
                        type="time"
                        value={slot.endTime ? slot.endTime.split("T")[1] || "" : ""}
                        onChange={(e) => {
                          const dateValue = slot.date || "";
                          updateFreeSlot(idx, "endTime", dateValue + "T" + e.target.value);
                        }}
                        className="w-full border rounded px-2 py-1 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addFreeSlot}
              className="bg-[#0065bd] text-white px-3 py-1 rounded-lg w-full mb-4"
            >
              + Add Time Slot
            </button>

            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <button onClick={handleBack} className="px-4 py-2 rounded-lg bg-gray-300">
                  Back
                </button>
                <button
                  onClick={handleFinalSave}
                  className="px-4 py-2 rounded-lg bg-gray-300"
                >
                  Save
                </button>
              </div>
              <button
                onClick={handleFinalSave}
                className="px-4 py-2 rounded-lg bg-[#C29700] text-white"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleModal;
