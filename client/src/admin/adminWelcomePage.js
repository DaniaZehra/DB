import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  IconButton 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#D6D4A0',
        textAlign: 'center',
      }}
    >
      {/* Menu Button */}
      <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ position: 'absolute', top: 16, left: 16, color: '#44A1A0' }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <List sx={{marginTop: '20px',
          backgroundColor:'44A1A0'}}>
          <Box sx={{ flexGrow: 1 }} />
            <ListItem>
              <ListItemButton onClick={() => handleNavigation('/admin-crud')}>
                <ListItemText primary="CRUD Operations" />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => handleNavigation('/admin-analytics')}>
                <ListItemText primary="Analytics" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Welcome Content */}
      <Typography variant="h2" gutterBottom sx={{ color: '#5D5D81' }}>
        Welcome to the Admin Portal
      </Typography>
      <Typography variant="h5" sx={{ color: '#1E1E1E  ' }}>
        Manage your system efficiently with our easy-to-use tools.
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, color: '#1E1E1E' }}>
        Use the menu icon in the top-left corner to navigate.
      </Typography>
    </Box>
  );
}

export default WelcomePage;
