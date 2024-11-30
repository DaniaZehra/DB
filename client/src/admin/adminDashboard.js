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
} from '@mui/material';

function AdminDashboard() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [updates, setUpdates] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const API_BASE_URL = `${process.env.REACT_APP_BASE_URL}/admin`;

  // Sign-in function
  const handleSignin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setMessage(`Sign-in successful! Admin ID: ${data.adminId}`);
    } catch (error) {
      setMessage(error.message || 'Sign-in failed');
    }
  };

  // Update function
  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
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

  // Delete function (with confirmation dialog)
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete`, {
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Sign-in form */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleSignin}>
          Sign In
        </Button>
      </Stack>

      {/* Update form */}
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

      {/* Delete button */}
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
    </Box>
  );
}

export default AdminDashboard;
