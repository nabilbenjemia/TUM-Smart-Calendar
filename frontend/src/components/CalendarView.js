import { getWeekDays } from "../utils/dateUtils";
import WeekGrid from "./WeekGrid";

function CalendarView({ selectedDate, setSelectedDate, timeslots, onDeleteEvent }) {

  const weekDays = getWeekDays(selectedDate);

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="flex-1 p-4 bg-white rounded-lg shadow-md flex flex-col">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleToday}
            className="px-4 py-2 bg-[#0065bd] text-white rounded hover:bg-blue-700 transition"
          >
            Today
          </button>
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-gray-200 rounded transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-200 rounded transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold">
          {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      {/* Week view grid */}
      <div className="flex-1 flex flex-col gap-2">

        {/* Day columns with time slots */}
        <WeekGrid weekDays={weekDays} timeslots={timeslots} onDeleteEvent={onDeleteEvent} />
      </div>
    </div>
  );
}

export default CalendarView;