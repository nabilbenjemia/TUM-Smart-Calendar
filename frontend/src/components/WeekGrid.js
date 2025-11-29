import React from "react";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({length: 16}).map((_, h) => `${h+8}:00`);

const WeekGrid = ({ weekDays }) => (
  <div className="flex-1 flex flex-col gap-2">
    {/* Day headers */}
    <div className="grid grid-cols-[32px,repeat(7,1fr)] gap-2">
      <div></div>
      {weekDays.map((day, index) => (
        <div key={index} className="text-center border-b-2 pb-2">
          <div className="text-sm font-semibold text-gray-600">{dayNames[index]}</div>
          <div className={`text-2xl font-bold ${
            day.toDateString() === new Date().toDateString() 
              ? 'text-[#0065bd]' 
              : 'text-gray-800'
          }`}>
            {day.getDate()}
          </div>
        </div>
      ))}
    </div>
    {/* Time slots grid */}
    <div className="grid grid-cols-[32px,repeat(7,1fr)] gap-2 flex-1">
      {/* Time column */}
      <div className="grid grid-rows-16">
        {hours.map((hour, idx) => (
          <div
            key={idx}
            className="h-10 relative text-xs text-gray-500 pr-2"
          >
            {/* Hour label with the shift */}
            <div className="flex items-center justify-end -mt-5 h-full">
              {hour}
            </div>

            {/* Extra label that should NOT inherit margin */}
            {idx === hours.length - 1 && (
              <span className="absolute  right-2 text-xs text-gray-500 mt-2">
                00:00
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Day columns */}
      {weekDays.map((day, dayIdx) => (
        <div key={dayIdx} className="grid grid-rows-16">
          {hours.map((hour, hourIdx) => (
            <div
              key={hourIdx}
              className="h-10 border border-gray-200 rounded mb-0.5 hover:bg-gray-50"
            >
              {/* Events for this slot can go here */}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default WeekGrid;