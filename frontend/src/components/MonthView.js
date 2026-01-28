// src/components/MonthView.js
import React from "react";
import DayCell from "./DayCell";
import { getMonthDays } from "../utils/dateUtils";

const MonthView = ({ year, month, onMonthChange, setSelectedDate }) => {
  const days = getMonthDays(year, month);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={handlePrevMonth}
          className="p-2 hover:bg-blue-500 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-xl font-bold">
          {monthNames[month]} {year}
        </div>
        
        <button 
          onClick={handleNextMonth}
          className="p-2 hover:bg-blue-500 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-x-1 justify-items-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="font-semibold text-white py-2">{d}</div>
        ))}
      </div>

      {/* Day cells grid */}
      <div className="grid grid-cols-7 gap-x-2  text-center">
        {days.map((day, index) => (
          <DayCell key={index} day={day} month={month} year={year} setSelectedDate={setSelectedDate} />
        ))}
      </div>
    </div>
  );
};

export default MonthView;

