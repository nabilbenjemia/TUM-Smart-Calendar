// src/components/DayCell.js
import React from "react";

const DayCell = ({ day, month, year, setSelectedDate }) => {
  return (
    <div className="flex items-center justify-center p-2">
      {day.date ? (
        <div
          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-blue-100 hover:text-black cursor-pointer flex-shrink-0 text-sm"
          onClick={() => setSelectedDate(new Date(year, month, day.date))}
        >
          {day.date}
        </div>
      ) : null}
    </div>
  );
};

export default DayCell;