import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Analytics from './analytics';

function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState('CRUD');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [updates, setUpdates] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sign-in function
  // const handleSignin = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/signin`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(await response.text());
  //     }

  //     const data = await response.json();
  //     setMessage(`Sign-in successful! Admin ID: ${data.adminId}`);
  //   } catch (error) {
  //     setMessage(error.message || 'Sign-in failed');
  //   }
  // };

  // Create Admin function
  const handleCreateAdmin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/create`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      alert("Admin created");
      setMessage(`Admin created successfully! Admin ID: ${data.adminId}`);
    } catch (error) {
      setMessage(error.message || 'Failed to create admin');
    }
  };

  // Update Admin function
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, updates }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setMessage(`Update successful! Updated Admin: ${data.username}`);
    } catch (error) {
      setMessage(error.message || 'Update failed');
    }
  };

  // Delete Admin function
  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message || 'Delete failed');
    } finally {
      setShowDialog(false);
    }
  };

  // Drawer navigation
  const drawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <List>
        <ListItem button onClick={() => setCurrentPage('CRUD')}>
          <ListItemText primary="CRUD Operations" />
        </ListItem>
        <ListItem button onClick={() => setCurrentPage('Analytics')}>
          <ListItemText primary="Analytics" />
        </ListItem>
      </List>
    </Drawer>
  );

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
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
        <IconButton
        onClick={() => setDrawerOpen(true)}
        sx={{ position: 'absolute', top: 16, left: 16, color: '#44A1A0' }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      {drawer}
      <Box sx={{ p: 3 }}>
        {currentPage === 'CRUD' ? (
          <>
            <Typography variant="h4" gutterBottom>
              CRUD Operations
            </Typography>

            {/* Create Admin form */}
            <Typography variant="h6" gutterBottom>
              Create Admin
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="New Admin Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              />
              <TextField
                label="New Admin Password"
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
              <Button variant="contained" color="primary" onClick={handleCreateAdmin}>
                Create Admin
              </Button>
            </Stack>

            {/* Update Admin form */}
            <Typography variant="h6" gutterBottom>
              Update Admin Details
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="New Username"
                value={updates.username}
                onChange={(e) => setUpdates({ ...updates, username: e.target.value })}
              />
              <TextField
                label="New Password"
                type="password"
                value={updates.password}
                onChange={(e) => setUpdates({ ...updates, password: e.target.value })}
              />
              <Button variant="contained" onClick={handleUpdate}>
                Update
              </Button>
            </Stack>

            {/* Delete Admin button */}
            <Button variant="outlined" color="error" onClick={() => setShowDialog(true)}>
              Delete Admin
            </Button>

            {/* Confirmation dialog for deletion */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this admin account?
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button color="error" onClick={handleDelete}>
                  Confirm Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* Display message */}
            {message && (
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="body1" color="textSecondary">
                    {message}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Analytics />
        )}
      </Box>
      </Box>
  );
}

export default AdminDashboard;
