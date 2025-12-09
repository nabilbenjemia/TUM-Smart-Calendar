import React, { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import Header from "./components/Header";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeslots, setTimeslots] = useState([
    { date: "2025-12-04", startTime: "08:00", endTime: "10:00", text: "Team Meeting" },
    { date: "2025-12-04", startTime: "10:00", endTime: "11:00", text: "Pause" },
    { date: "2025-12-05", startTime: "12:00", endTime: "17:00", text: "Introduction to AI Lecture" },
    { date: "2025-12-09", startTime: "12:00", endTime: "19:00", text: "Introduction to ML Lecture" },
    { date: "2025-12-09", startTime: "19:00", endTime: "20:00", text: "Pause" }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header timeslots={timeslots} setTimeslots={setTimeslots} />
      <div className="flex mx-2 mb-2 gap-2 flex-auto">
        <Sidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <CalendarView 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}
          timeslots={timeslots}
        />
      </div>
    </div>
  );
}

export default App;
