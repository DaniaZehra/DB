import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';
import DisplayPastBookings from './ProfilePageBookings';
import DisplayCurrentBookings from './ProfilePageFutureBookings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemText} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

const CustomerDetails = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const menuItems = [
        { text: 'View Past Bookings', path: '/' },
        { text: 'View Future Bookings', path: '/profile' },
      ];

    const cust_id = sessionStorage.getItem('userId')

    const fetchCustomerDetails = async () => {
        setLoading(true);
        setIsClicked(true);
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

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerOpen(open);
    };

    return (
        <div>
         <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer>
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6" sx={{ p: 2 }}>
              Navigation
            </Typography>
            <Divider />
            <List>
              {menuItems.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
        <Container maxWidth="sm" style={{ marginTop: '20px', textAlign: 'center' }}>
            {!isClicked && (
                <div>
                    <Typography variant="h5" gutterBottom>
                        Fetch Customer Details
                    </Typography>
                    <Button variant="contained" color="primary" onClick={fetchCustomerDetails} disabled={loading}>
                        {loading ? 'Loading...' : 'Fetch Details'}
                    </Button>
                </div>
            )}
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
                        <Container max-width="sm" style={{ marginTop: '20px', Align:'center', 
                        display:'flex', justifyContent:'center', vertical:'100vh'}}>
                              <AccountCircleIcon style={{fontSize:'100px'}}/>
                        </Container>
                        <Typography variant="h5" gutterBottom>
                            Customer Details
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Username:</strong> {customer.username}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>First Name:</strong> {customer.first_name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Last Name:</strong> {customer.last_name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Email:</strong> {customer.cust_email}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>LoyaltyPoints:</strong> {customer.loyalty_points}
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
