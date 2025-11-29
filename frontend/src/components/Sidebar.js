import MonthView from "./MonthView";
import React, { useState } from "react";

const Sidebar = ({ selectedDate, setSelectedDate }) => {
    const [viewedDate, setViewedDate] = new useState(selectedDate);
    const handleMonthChange = (newYear, newMonth) => {
      setViewedDate(new Date(newYear, newMonth, 1));
    };

  return (
    <div className="bg-[#0065bd] text-white p-4 rounded-lg shadow-md w-[20%]">
      <MonthView 
        year={viewedDate.getFullYear()} 
        month={viewedDate.getMonth()} 
        onMonthChange={handleMonthChange}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

export default Sidebar;