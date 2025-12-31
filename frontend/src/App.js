import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  // Check if user is authenticated on mount
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem("authToken") !== null;
  });
  
  const [user, setUser] = React.useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (authToken, userData) => {
    // Store token and user data
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
        <Route 
          path="/calendar" 
          element={
            isAuthenticated 
              ? <CalendarPage user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          } 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/calendar" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/calendar" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
