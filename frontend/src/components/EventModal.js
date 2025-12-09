import React, { useState } from "react";

const EventModal = ({ isOpen, onClose, onSave }) => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: ""
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!eventData.title || !eventData.date || !eventData.startTime || !eventData.endTime) {
      alert("Please fill in all fields");
      return;
    }

    const event = {
      title: eventData.title,
      startTime: eventData.date + "T" + eventData.startTime,
      endTime: eventData.date + "T" + eventData.endTime
    };

    onSave(event);
    setEventData({ title: "", date: "", startTime: "", endTime: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4 text-[#0065bd]">Add Event</h2>

        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={eventData.title}
          onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
          className="w-full border rounded px-2 py-1 mt-1 mb-3"
          placeholder="e.g. Team Meeting"
        />

        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={eventData.date}
          onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
          className="w-full border rounded px-2 py-1 mt-1 mb-3"
        />

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <label className="block text-sm font-medium">From</label>
            <input
              type="time"
              value={eventData.startTime}
              onChange={(e) => setEventData({ ...eventData, startTime: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">To</label>
            <input
              type="time"
              value={eventData.endTime}
              onChange={(e) => setEventData({ ...eventData, endTime: e.target.value })}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#0065bd] text-white"
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;