import React from "react";

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 16 }).map((_, h) => `${h + 8}:00`);

const getHourIdx = (time) => parseInt(time.split(":")[0], 10) - 8;

const WeekGrid = ({ weekDays, timeslots, onDeleteEvent }) => {
  return (
    <div className="h-full flex flex-col">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th className="w-16 h-12"></th>
            {weekDays.map((day, index) => (
              <th key={index} className="text-center p-2">
                <div className="text-sm font-semibold text-gray-600">{dayNames[index]}</div>
                <div className={`text-2xl font-bold ${day.toDateString() === new Date().toDateString()
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
                      className="align-top border border-gray-200 relative p-0"
                      style={{
                        height: cellHeight,
                        backgroundImage: 'repeating-linear-gradient(to bottom, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent 2.1rem)',
                        backgroundSize: '100% 2.1rem',
                        backgroundPosition: '0 -1px'
                      }}
                    >
                      <div
                        className="flex items-center justify-center h-full px-2 py-0.5 bg-[#5E94D4] h-[95%] rounded-lg w-[95%] border-2 border-white cursor-pointer hover:bg-red-500 transition-colors group"
                        onClick={() => onDeleteEvent && onDeleteEvent(slot.id, slot.type)}
                        title="Click to delete"
                      >
                        <div className="w-full h-full text-sm text-left break-words overflow-hidden rounded-lg line-clamp-3 group-hover:hidden">
                          {slot.text}
                        </div>
                        <div className="hidden group-hover:block text-white font-bold">
                          Delete
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
                if (covered) {
                  return null;
                }

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
