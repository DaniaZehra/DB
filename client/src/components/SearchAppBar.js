import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import Cookies from 'js-cookie'
import { CardContent } from '@mui/material';
import {Stack} from '@mui/material'
import {Collapse} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import BookingModal from './BookingModal'; 
import FareEstimation from './FareEstimationPopUp'
import TrafficUpdate from './TrafficUpdatePopUp';
import LoyaltyPoints from './LoyaltyPoints';
import WeatherAlerts from '../notifications/WeatherAlerts';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function NavigationAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [routesWithSchedules, setRoutesWithSchedules] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [anchor, setAnchor] = React.useState(null);
  const [Modalopen, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [expandedRoute, setExpandedRoute] = useState(null);
  const [formData, setFormData] = useState({
      origin: ``,
      destination: ``
  })


  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;

  const handleExpandClick = (routeId) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date); // Update the selected date.
  };

  // Permission Handling for Microphone
  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted.');
    } catch (err) {
      console.error('Microphone permission denied:', err);
    }
  };

  recognition.onstart = () => {
    console.log('Speech recognition started');
    setIsListening(true);
  };

  recognition.onend = () => {
    console.log('Speech recognition ended');
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  recognition.onresult = (event) => {
    const recognizedText = Array.from(event.results)
      .map((res) => res[0].transcript)
      .join('');
    setSearchQuery(recognizedText);
    console.log('Recognized Text:', recognizedText);
  };

  const startListening = async () => {
    await checkMicrophonePermission(); // Check permission before starting recognition
    if (!isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (isListening) {
      recognition.stop();
    }
  };

  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };
  const menuItems = [
    { text: 'View Routes', path: '/' },
    { text: 'Book Ride', path: '/profile' },
  ];

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: searchQuery }),
        });
  
        if (response.ok) {
          const data = await response.json();
  
          const formattedRoutes = data.result.reduce((acc, route) => {
            const existingRoute = acc.find((r) => r.route_id === route.route_id);
            if (existingRoute) {
              existingRoute.schedules.push({
                schedule_id: route.schedule_id,
                departure_time: route.departure_time,
                arrival_time: route.arrival_time,
                status: route.status,
              });
            } else {
              acc.push({
                ...route,
                schedules: route.schedule_id
                  ? [
                      {
                        schedule_id: route.schedule_id,
                        departure_time: route.departure_time,
                        arrival_time: route.arrival_time,
                        status: route.status,
                      },
                    ]
                  : [],
              });
            }
            return acc;
          }, []);
  
          setRoutesWithSchedules(formattedRoutes);
          setNoResult(false);
        } else {
          setNoResult(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  
  };
  const handleSubmit = async (ride,date) =>{
    const selectedDate = new Date(date);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const Data = {
      cust_id:parseInt(Cookies.get('userId'),10),
      route_id:ride.route_id,
      rideDate:formattedDate
    }
    console.log("Payload sent to backend:", JSON.stringify(Data));
    try{
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/bookRide`,
        {
          method: "PUT",
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(Data),
          credentials: "include",
        }
      );
      const result = response.json();
      console.log("Response status:", result.status);
      console.log("Response Body",response);
      if(result.ok){
        alert("This Works");
      }
    }
    catch(err){
      alert("Error in booking ride");
    }

  };
  const handleOpenModal = (route) => {
    alert(route.stops);
    if(route?.stops){
      setSelectedRoute(route); // Set the selected route when opening the modal.
      setOpen(true);
    }
    else{
      alert("no route selected");
    }
  };


  const handleConfirmBooking = () => {
    alert("handleConfirmBooking");
    if(selectedDate<new Date()){
      alert("please select a valid date");
      console.log(selectedDate);
      return;
    }
    alert(selectedRoute);
    alert(selectedDate);
    if (selectedRoute) {
      handleSubmit(selectedRoute, selectedDate); // Pass date to the submission handler
      setOpen(false);
    }
  };

  //profile Menu
  const handleProfilePage = () =>{
    window.location.href = '/customer-profile-page'
  };
  const handleLogOut = () =>{

  };

  return (
  <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        {/* Menu Icon (Drawer Trigger) */}
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
  
        {/* Drawer for Navigation */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
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
  
        {/* Title or Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          UrbanHub
        </Typography>
  
        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputProps={{ 'aria-label': 'search' }}
            onKeyDown={handleKeyDown}
            aria-label='Search Bar'
          />
          <IconButton
            color="inherit"
            onClick={isListening ? stopListening : startListening}
            sx={{ ml: 1 }}
            aria-label="voice-search"
          >
            <MicIcon color={isListening ? 'error' : 'inherit'} />
          </IconButton>
        </Search>
  
        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />
  
        {/* Icons on the Right */}
        <Box sx={{ display: 'flex' }}>
  
          <IconButton size="large" aria-label="show notifications" color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <LoyaltyPoints></LoyaltyPoints>
  
          <IconButton
            size="large"
            edge="end"
            aria-label="account"
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  
    {/* Search Results Section */}
    <Box sx={{ marginTop: '20px' }}>
      <Typography variant="h6">Search Results</Typography>
  
      <Box sx={{ display: 'flex' }}>
        {noResult && (
          <Typography variant="h6" sx={{ marginTop: '20px' }}>
            No Result Found
          </Typography>
        )}
  
        {routesWithSchedules && Array.isArray(routesWithSchedules) && routesWithSchedules.length > 0 && (
          <List>
      {routesWithSchedules && routesWithSchedules.length > 0 ? (
        routesWithSchedules.map((route) => (
          <ListItem key={route.route_id}>
            <Card
              sx={{
                width: '100%',
                minHeight: '100px',
                marginTop: '20px',
                marginBottom: '20px',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <CardContent>
                  <Typography variant="h6" aria-label={route.route_id}>{`Route ID: ${route.route_id}`}</Typography>
                  <Typography variant="body2" aria-label={`${route.origin} ${route.stops} ${route.destination}`}>
                    {`${route.origin} → ${route.stops} → ${route.destination}`}
                  </Typography>
                </CardContent>
                <Button
                  aria-label="expand-schedule"
                  variant="contained"
                  endIcon={<ExpandMoreIcon />}
                  onClick={() => handleExpandClick(route.route_id)}
                >
                  {expandedRoute === route.route_id ? 'Collapse' : 'View Schedules'}
                </Button>
                <Button
                      aria-label="book-ride"
                      variant="contained"
                      onClick={() => handleOpenModal(route)}
                    >
                      Book Ride
                </Button>
              </Stack>

              <Collapse in={expandedRoute === route.route_id} timeout="auto" unmountOnExit>
                <CardContent>
                  {route.schedules && route.schedules.length > 0 ? (
                    route.schedules.map((schedule) => (
                      <Typography key={schedule.schedule_id} variant="body2" sx={{ mb: 1 }}>
                        {`Schedule ID: ${schedule.schedule_id}, Departure: ${schedule.departure_time}, Arrival: ${schedule.arrival_time}, Status: ${schedule.status}`}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No schedules found.
                    </Typography>
                  )}
                </CardContent>
              </Collapse>
            </Card>
          </ListItem>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          No routes found.
        </Typography>
      )}
    </List>
        )}
        <FareEstimation></FareEstimation>
        <TrafficUpdate></TrafficUpdate>
        <BookingModal
        Modalopen={Modalopen}
        setOpen={setOpen}
        selectedRoute={selectedRoute}
        handleConfirmBooking={handleConfirmBooking}
        handleDateChange={handleDateChange}
        formData={formData}
        setFormData={setFormData}
        selectedDate={selectedDate}
      />

  
        {searchResult && !Array.isArray(searchResult) && (
          <Card sx={{ width: '100%', minHeight: '100px',marginBottom: '20px' }}>
            <Box>{JSON.stringify(searchResult)}</Box>
          </Card>
        )}
      </Box>
    </Box>
  
    {/* Profile Menu */}
    <Menu
      anchorEl={profileMenuAnchorEl}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={handleProfilePage}>Profile</MenuItem>
    </Menu>
    <WeatherAlerts></WeatherAlerts>
  </Box>
  );
}

