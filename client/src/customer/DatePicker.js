import React, { useState, useEffect } from 'react';

function DatePicker({ onDateChange }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Generate options for select dropdowns
  const generateOptions = (start, end) => {
    const options = [];
    for (let i = start; i <= end; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }
    return options;
  };

  // Update the parent component whenever a full date is selected
  useEffect(() => {
    if (day && month && year) {
      const selectedDate = new Date(year, month - 1, day); // Months are 0-indexed in JS
      onDateChange(selectedDate);
    }
  }, [day, month, year, onDateChange]);

  return (
    <div>
      <select value={day} onChange={e => setDay(e.target.value)}>
        <option value="">Day</option>
        {generateOptions(1, 31)}
      </select>

      <select value={month} onChange={e => setMonth(e.target.value)}>
        <option value="">Month</option>
        {generateOptions(1, 12)}
      </select>

      <select value={year} onChange={e => setYear(e.target.value)}>
        <option value="">Year</option>
        {generateOptions(2024,2024)}
      </select>
    </div>
  );
}

export default DatePicker;
