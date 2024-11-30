import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import Collapsible from 'react-collapsible';
import DatePicker from './DatePicker'; // Assuming DatePicker is your custom date picker component.
import AddToCalendar from './AddToCalendar';

function BookingModal({
  Modalopen,
  setOpen,
  handleConfirmBooking,
  handleEstimate,
  handleDateChange,
  selectedDate,
}) {
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

        <AddToCalendar></AddToCalendar>

        {/* Fare Estimation Section */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEstimate}
            sx={{ width: '100%' }}
          >
            Get Fare Estimate
          </Button>
      </Box>
    </Modal>
  );
}

export default BookingModal;
