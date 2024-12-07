import React, { useState } from 'react';
import { Button,Box, 
    Container, Card, CardContent, CircularProgress,
    Modal, 
    Rating,
    TextField,Typography } from '@mui/material';
import Cookies from 'js-cookie';

const DisplayCurrentBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const cust_id = parseInt(Cookies.get("userId"));
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState('');
    const [rating, setRating] = useState(0);

    const handleFetchBookings = async (e) => {
        setLoading(true);
        setError('');
        console.log("Payload: ", JSON.stringify({cust_id: cust_id }))
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/fetch-bookings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({cust_id: cust_id }),
                credentials:'include',
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);

            }
            else{
                const data = await response.json();
                console.log(data.result[0]);
                setBookings(data.result[0] || []); 
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleOpen = (bookingId) => {
        setSelectedBookingId(bookingId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setComments('');
        setRating(0);
    };

    const handleFeedback = async (e) =>{
        if (!comments || rating === 0) {
            alert("Please provide comments and a rating.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/submit-feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: selectedBookingId,
                    comments: comments,
                    rating: rating
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit feedback");
            }

            alert("Feedback submitted successfully!");
            handleClose();
        } catch (error) {
            console.error(error);
            alert("An error occurred while submitting feedback.");
        }
    }
    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Past Bookings
            </Typography>
           <Button variant="contained" color="primary" onClick={handleFetchBookings}>
                Fetch
           </Button>
            {loading && (
                <Container style={{ textAlign: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                    <Typography variant="body1" color="textSecondary" style={{ marginTop: '10px' }}>
                        Loading bookings...
                    </Typography>
                </Container>
            )}
            {error && (
                <Typography variant="h6" color="error" style={{ marginTop: '20px' }}>
                    {error}
                </Typography>
            )}
            {!loading && bookings.length > 0 && (
                bookings.map((booking, index) => (
                    <Card key={index} style={{ marginBottom: '15px' }}>
                        <CardContent>
                            <Typography variant="h6">
                                Booking ID: {booking.booking_id}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Route:</strong> {booking.route_id}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Booking Date:</strong> {new Date(booking.ride_date).toLocaleString()}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong> {booking.status}
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => handleOpen(booking.booking_id)}>
                                Give Feedback
                            </Button>
                        </CardContent>
                    </Card>
                ))
            )}
            {!loading && bookings.length === 0 && !error && (
                <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center' }}>
                    No bookings found.
                </Typography>
            )}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px'
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Submit Feedback
                    </Typography>
                    <TextField
                        fullWidth
                        label="Comments"
                        multiline
                        rows={4}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    />
                    <Typography variant="body1" gutterBottom>
                        Rating:
                    </Typography>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(e, newValue) => setRating(newValue)}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: 2
                        }}
                    >
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleFeedback}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default DisplayCurrentBookings;
