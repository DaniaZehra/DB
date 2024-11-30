import React from 'react';
import { Button } from '@mui/material';

const AddToCalendar = () => {
  const date = new Date(2024, 8, 8, 15, 0); // Example date (September 8, 2024, 15:00)
  const eventTitle = 'Ride Booking';
  const eventDescription = 'Ride from A to B';
  const eventLocation = 'Pickup Location';

  const formatDateForICS = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  };

  const addToGoogleCalendar = () => {
    const startDate = date.toISOString().replace(/[-:]/g, '').split('.')[0]; // Format as YYYYMMDDTHHMMSSZ
    const endDate = new Date(date.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]; // One hour later

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}&dates=${startDate}/${endDate}&sf=true&output=xml`;

    window.open(url, '_blank');
  };

  const downloadICSFile = () => {
    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
LOCATION:${eventLocation}
DTSTART:${formatDateForICS(date)}
DTEND:${formatDateForICS(new Date(date.getTime() + 60 * 60 * 1000))}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
DESCRIPTION:Reminder
TRIGGER:-PT10M
END:VALARM
END:VEVENT
END:VCALENDAR
    `;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={addToGoogleCalendar} style={{ marginRight: '10px' }}>
        Add to Google Calendar
      </Button>
      <Button onClick={downloadICSFile}>
        Add to Calendar (Download .ics)
      </Button>
    </div>
  );
};

export default AddToCalendar;
