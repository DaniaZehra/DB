import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdminSignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error(await response.text());

      setMessage('Sign-in successful!');
      navigate('/adminDashboard'); // Navigate to Admin Dashboard on success
    } catch (error) {
      setMessage(error.message || 'Sign-in failed');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Sign-In
      </Typography>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
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

export default AdminSignIn;
