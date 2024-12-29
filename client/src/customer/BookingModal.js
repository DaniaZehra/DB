import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import DatePicker from './DatePicker'; 
import 'add-to-calendar-button';

function BookingModal({
  Modalopen,
  setOpen,
  handleConfirmBooking,
  handleDateChange,
  selectedDate,
  selectedRoute,
  origin,
  destination,
  setOrigin,
  setDestination,
}) {
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal open={Modalopen} onClose={() => setOpen(false)}>
      <Box
        sx={{
          padding: '20px',
          backgroundColor: 'white',
          margin: '50px auto',
          maxWidth: '400px',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select a Date for the Ride
        </Typography>

        {/* Date Picker */}
        <DatePicker onDateChange={handleDateChange} />

        {/*origin and destination picker*/}

        <Typography variant="h6" gutterBottom>
          Select a Stops for the Ride
        </Typography>
        <Box>
  <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
    <option value="">Origin</option>
    {selectedRoute?.stops ? (
      selectedRoute.stops
        .split(',') // Convert the string to an array
        .map((stop, index) => (
          <option key={index} value={stop.trim()}>
            {stop.trim()}
          </option>
        ))
    ) : (
      <option value="" disabled>
        No stops available
      </option>
    )}
  </select>

  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
    <option value="">Destination</option>
    {selectedRoute?.stops ? (
      selectedRoute.stops
        .split(',') // Convert the string to an array
        .map((stop, index) => (
          <option key={index} value={stop.trim()}>
            {stop.trim()}
          </option>
        ))
    ) : (
      <option value="" disabled>
        No stops available
      </option>
    )}
  </select>
</Box>

        
        {/* Confirm Booking Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleConfirmBooking(selectedDate)}
          sx={{ marginTop: '20px', width: '100%' }}
        >
          Confirm Booking
        </Button>

        <add-to-calendar-button
          name="[Reminder] Add Booking Date to Calendar"
          startDate={formatDate(selectedDate)}
          location="World Wide Web"
          description="Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
          options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
          lightMode="bodyScheme"
        ></add-to-calendar-button>

      </Box>
    </Modal>
  );
}

export default BookingModal;
