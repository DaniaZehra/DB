import React, { useState } from 'react';
import { Button,
    Container, Card, CardContent, CircularProgress,
    Typography } from '@mui/material';
import Cookies from 'js-cookie';

const DisplayPastBookings = () => {
    const [bookings1, setBookings1] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const cust_id = parseInt(Cookies.get("userId"));
    const handleFetchBookings = async (e) => {
        setLoading(true);
        setError('');
        console.log("Payload: ", JSON.stringify({cust_id: cust_id }))
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/fetch-curr-bookings`, {
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
                setBookings1(data.result[0] || []); 
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Future Bookings
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
            {!loading && bookings1.length > 0 && (
                bookings1.map((booking, index) => (
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
                        </CardContent>
                    </Card>
                ))
            )}
            {!loading && bookings1.length === 0 && !error && (
                <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center' }}>
                    No bookings found.
                </Typography>
            )}
        </Container>
    );
};

export default DisplayPastBookings;
