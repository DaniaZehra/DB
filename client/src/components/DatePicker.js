// DatePicker.js
import React, { useState } from 'react';

function DatePicker() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const generateOptions = (start, end) => { 
    const options = [];
    for (let i = start; i <= end; i++) { 
      options.push(<option key={i} value={i}>{i}</option>); 
    } 
    return options;
  };

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
        {generateOptions(1900, 2024)} 
      </select>
    </div>
  );
}

export default DatePicker;
