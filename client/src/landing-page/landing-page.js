import React from "react";
import {
  Button,
  Container,
  Grid2,
  Typography,
  Box,
} from "@mui/material";

const LandingPage = () => {
  const handleSignIn = () => {
    window.location.href = '/sign-in';
  };

  const handleCustomerSignUp = () => {
    window.location.href = '/sign-up-customer';
  };

  const handleTransporterSignUp = () => {
    window.location.href = '/sign-up-transporter';
  };

  return (
    <div className="LandingPage" style={{backgroundColor:'#d6d4a0'}}>
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Box textAlign="center" py={5}>
          <Typography variant="h3" gutterBottom style={{}}>
            Welcome to UrbanHub
          </Typography>
          <Typography variant="h4" gutterBottom style={{}} color="#52a2b4">
            Bridging Distances
          </Typography>
          <Typography variant="subtitle1" gutterBottom color='#1e1e1e'>
            Sign in or sign up to get started
          </Typography>

          <Grid2 container spacing={2} justifyContent="center" mt={4}>
            <Grid2 item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </Grid2>

            <Grid2 item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleCustomerSignUp}
              >
                Sign Up as Customer
              </Button>
            </Grid2>

            <Grid2 item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleTransporterSignUp}
              >
                Sign Up as Transporter
              </Button>
            </Grid2>
          </Grid2>
        </Box>
      </Container>
    </div>
    </div>
  );
};

export default LandingPage;
