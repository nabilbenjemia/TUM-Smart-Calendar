import "./App.css";
import Sidebar from "./components/Sidebar";
import CalendarView from "./components/CalendarView";

function App() {
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/*<div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg m-4">
        Hello!
      </div>*/}
      <h1 className="text-4xl font-bold text-center py-8 text-[#0065bd]">TUM Smart Calendar</h1>
      
      <div className="flex mx-8 mb-2 gap-2 flex-auto">
        <Sidebar />
        <CalendarView />
      </div>

    </div>
  );
}

export default App;
