import React from "react";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 16 }).map((_, h) => `${h + 8}:00`);

const timeslots = [
  { date: "2025-12-04", startTime: "08:00", endTime: "10:00", text: "Team Meeting" },
  { date: "2025-12-04", startTime: "10:00", endTime: "11:00", text: "Pause" },
  { date: "2025-12-05", startTime: "12:00", endTime: "17:00", text: "Introduction to AI Lecture  to AI Lecture I to AI Lecture I to AI Lecture IIntroduction to AI Lecture Introduction to AI Lecture Introduction to AI Lecture Introduction to AI Lecture" },
  { date: "2025-12-09", startTime: "12:00", endTime: "19:00", text: "Introducuuuuuuuuuuuuuution to ML Lecture" }
];

const getHourIdx = (time) => parseInt(time.split(":")[0], 10) - 8;

const WeekGrid = ({ weekDays }) => {
  return (
    <div className="h-full flex flex-col">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="w-16 h-12"></th>
            {weekDays.map((day, index) => (
              <th key={index} className="text-center p-2">
                <div className="text-sm font-semibold text-gray-600">{dayNames[index]}</div>
                <div className={`text-2xl font-bold ${
                  day.toDateString() === new Date().toDateString() 
                    ? 'text-[#0065bd]' 
                    : 'text-gray-800'
                }`}>
                  {day.getDate()}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {hours.map((hour, hIdx) => (
            <tr key={hIdx}>
              {/* Time column */}
              <td className="text-right pr-2 align-top text-sm font-mono text-gray-400 h-8">
                {hour}
              </td>

              {/* Day columns */}
              {weekDays.map((day, dIdx) => {
                const dayISO = day.toISOString().slice(0, 10);

                // Check if a slot starts at this hour
                const slot = timeslots.find(ts => ts.date === dayISO && getHourIdx(ts.startTime) === hIdx);
                if (slot) {
                  const rowSpan = getHourIdx(slot.endTime) - getHourIdx(slot.startTime);
                  const cellHeight = `${rowSpan * 2.1}rem`;
                  return (
                    <td
                      key={dIdx}
                      rowSpan={rowSpan}
                      className="align-top"
                      style={{ height: cellHeight }}
                    >
                      <div className="flex items-center justify-center h-full p-1">
                        <div className="bg-[#5E94D4] h-[95%] rounded-lg w-[95%]">
                          <div className="w-full h-full text-sm text-left break-words overflow-hidden px-2 py-0.5 rounded-lg line-clamp-3">
                            {slot.text}
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                }

                // Skip cell if covered by a rowSpan
                const covered = timeslots.some(ts =>
                  ts.date === dayISO &&
                  getHourIdx(ts.startTime) < hIdx &&
                  getHourIdx(ts.endTime) > hIdx
                );
                if (covered) return null;

                // Empty cell
                return <td key={dIdx} className="border border-gray-200"></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeekGrid;
