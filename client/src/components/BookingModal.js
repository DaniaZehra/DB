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
