import React, { useState } from "react";
import ModuleModal from "./ModuleModal";

const AISchedulePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modules, setModules] = useState([{ courseName: "", ects: "", examDateTime: "", durationMinutes: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (data) => {
    console.log("Sending to Calendar API:", data);
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId") || "1";

      // Build payload for the calendar schedule endpoint
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

      // Call calendar API which will:
      // 1. Fetch exams from DB
      // 2. Call GenAI service
      // 3. Save generated timeslots to DB
      // 4. Return success/failure
      console.log("=== SENDING TO CALENDAR API ===");
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

      setIsOpen(false);
    } catch (err) {
      console.error("Error calling Calendar API:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#C29700] text-white px-4 py-2 rounded-lg shadow"
        disabled={loading}
      >
        {loading ? "Processing..." : "Add Modules"}
      </button>

      {error && (
        <p className="text-red-500 mt-2">Error: {error}</p>
      )}

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
