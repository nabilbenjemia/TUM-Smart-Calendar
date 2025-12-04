import "./App.css";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      {<div className="flex mx-2 mb-2 gap-2 flex-auto">
        <Sidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <CalendarView selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      </div>}

    </div>
  );
}

export default App;
