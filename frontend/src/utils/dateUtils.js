// src/utils/dateUtils.js

export const getMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  let startingDayOfWeek = firstDay.getDay();
  
  // Adjust so Monday = 0, Sunday = 6
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
  
  const daysInMonth = lastDay.getDate();
  const days = [];

  // Add empty cells for days before the 1st
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ date: null });
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ date: day });
  }

  return days;
};

// Get the start of the current week (Monday)
export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
  return new Date(d.setDate(diff));
};

// Generate 7 days starting from Monday
export const getWeekDays = (date) => {
  const weekStart = getWeekStart(date);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
};
