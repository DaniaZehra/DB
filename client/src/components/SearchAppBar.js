import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Card from '@mui/material/Card';
import Cookies from 'js-cookie'
import { CardContent } from '@mui/material';
import DatePicker from './DatePicker';
import {Stack} from '@mui/material'
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Unstable_Popup as BasePopup } from '@mui/base';
import Collapsible from 'react-collapsible';
import Form from 'react-bootstrap/Form';
import { Row, FloatingLabel } from 'react-bootstrap';



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
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [formData, setFormData] = useState({
      origin: ``,
      destination: ``
  })


  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;

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
  const handleLoyaltyOpen = (event) => {
    setAnchor(anchor ? null : event.currentTarget);
  };
  const open = Boolean(anchor);
  const id = open ? 'simple-popper' : undefined;
  const handleKeyDown = async (e) => {
    if(e.key==='Enter'){
      try{
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/search`, 
            { method: 'POST', 
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({input:searchQuery})
              //credentials: 'include' 
      });
      if(response.ok){
        const data = await response.json();
        alert(JSON.stringify(data));
        if(data.result.length>0 && data.result){
          setSearchResult(data.result);
          setRoutesWithSchedules(searchResult);
          setNoResult(false);
        }
        else{
          setNoResult(true);
          setSearchResult(null);
        }
      }
        } catch(err){

        }
    }
  };
  const handleSubmit = async (ride,date) =>{
    const Data = {
      cust_id:Cookies.get('userId'),
      route_id:ride.route_id,
      rideDate:date
    }
    alert(Data.cust_id);
    alert(Data.rideDate);
    alert(Data.route_id);
    try{
      const result = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/bookRide`,
        {
          method: 'PUT',
          headers: { 'Content-Type': `application/json`},
          body: JSON.stringify(Data),
          credentials: 'include'
        }
      );
      if(result.ok){
        alert("This Works");
      }
    }
    catch(err){
      alert("Error in booking ride");
    }
  };
  const handleOpenModal = (ride) => {
    setSelectedRide(ride);
    setOpen(true);
  };
  //Fare Estimation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleEstimate = async() => {
    try{
      const result = await fetch(`${process.env.REACT_APP_BASE_URL}/customer/estimate-fare`,
        {
          method:'POST',
          headers:{'Content-type':`application/json`},
          body: JSON.stringify(formData)
        }
      )
      if(result.ok){
        const data = await result.json();
        alert(data.estimatedFare);
      }
    }
    catch(error){
      alert(error.message);
    }
  }

  const handleConfirmBooking = () => {
    if (selectedRide) {
      handleSubmit(selectedRide, selectedDate); // Pass date to the submission handler
      setOpen(false);
    }
  };

  return (<Box sx={{ flexGrow: 1 }}>
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
          <IconButton
            size="large"
            aria-label="view loyalty points"
            color="inherit"
            onClick={handleLoyaltyOpen}
          >
            <EmojiEventsIcon />
            <BasePopup id={id} open={open} anchor={anchor}>
              <PopupBody>The content of the Popup.</PopupBody>
            </BasePopup>
          </IconButton>
  
          <IconButton size="large" aria-label="show notifications" color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
  
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
            {routesWithSchedules.map((result, index) => (
              <ListItem key={index}>
                <Card
                  sx={{ width: '100%', minHeight: '100px', marginTop: '20px', marginBottom: '20px' }}
                >
                  <Stack spacing={2} direction="row">
                    <CardContent>
                      <ListItemText
                        primary={result.route_id}
                        secondary={`${result.origin}, ${result.stops}, ${result.destination}`}
                      />
                    </CardContent>
                    <Button
                      aria-label="book-ride"
                      variant="contained"
                      onClick={() => handleOpenModal(result)}
                    >
                      Book Ride
                    </Button>
                  </Stack>
                </Card>
              </ListItem>
            ))}
          </List>
        )}
  
        <Modal open={Modalopen} onClose={() => setOpen(false)}>
          <Box sx={{ padding: '20px', backgroundColor: 'white', margin: '50px auto', maxWidth: '400px' }}>
            <Typography variant="h6">Select a Date for the Ride</Typography>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />

            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </Button>
            <Collapsible trigger="Fare Estimation">
              <Row>
                <FloatingLabel controlId='origin' label='origin'>
                    <Form.Control 
                      type='text' 
                        placeholder='origin' 
                        name='origin' 
                        value={formData.origin} 
                        onChange={handleChange} 
                  />
                </FloatingLabel>
                <FloatingLabel controlId='stopB' label='stopB'>
                    <Form.Control 
                      type='text' 
                      placeholder='destination' 
                      name='destination' 
                      value={formData.destination} 
                      onChange={handleChange} 
                  />
                </FloatingLabel>
              </Row>
              <Button
              variant="contained"
              color="primary"
              onClick={handleEstimate}>
                Get estimate
              </Button>              
            </Collapsible>
          </Box>
        </Modal>


  
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
      <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>My Account</MenuItem>
      <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
    </Menu>
  </Box>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  z-index: 1;
`,
);
