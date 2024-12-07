import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';
import Cookies from 'js-cookie';
import DisplayPastBookings from './ProfilePageBookings';
import DisplayCurrentBookings from './ProfilePageFutureBookings';

const CustomerDetails = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cust_id = Cookies.get("userId");

    const fetchCustomerDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/fetch-details`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cust_id: cust_id }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to fetch customer details');
            }
            const data = await response.json();
            console.log(data.result);
            if (Array.isArray(data.result) && data.result.length > 0) {
                // Extract the first customer's details
            const customerDetails = data.result[0][0]; // Access the first customer object
            setCustomer(customerDetails);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <Container maxWidth="sm" style={{ marginTop: '20px', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
                Fetch Customer Details
            </Typography>
            <Button variant="contained" color="primary" onClick={fetchCustomerDetails} disabled={loading}>
                {loading ? 'Loading...' : 'Fetch Details'}
            </Button>
            {loading && (
                <div style={{ marginTop: '20px' }}>
                    <CircularProgress />
                    <Typography variant="body1" color="textSecondary" style={{ marginTop: '10px' }}>
                        Loading customer details...
                    </Typography>
                </div>
            )}
            {error && (
                <Typography variant="h6" color="error" style={{ marginTop: '20px' }}>
                    {error}
                </Typography>
            )}
            {customer && (
                <Card style={{ marginTop: '20px' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Customer Details
                        </Typography>
                        <Typography variant="body1">
                            <strong>Username:</strong> {customer.username}
                        </Typography>
                        <Typography variant="body1">
                            <strong>First Name:</strong> {customer.first_name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Last Name:</strong> {customer.last_name}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Password:</strong> {customer.password}
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </Container>
        <Container>
            <DisplayPastBookings></DisplayPastBookings>
        </Container>
        <Container>
            <DisplayCurrentBookings></DisplayCurrentBookings>
        </Container>
        </div>
    );
};

export default CustomerDetails;
