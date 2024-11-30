import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid2 } from '@mui/material';
import Cookies from 'js-cookie'

function AnalyticsCard({ transporterId }) {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/transporter/analytics`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({transporterId:Cookies.get("userId")}),
            credentials: "include" // Include transporterId in the body
          });
        if (response.ok) {
          const data = await response.json();
          if(!data || data.length===0){
            alert("No analytics available");
          }
          setAnalyticsData({
            profit: data.profit || 0,
            average_rating: data.average_rating || 0,
            total_revenue: data.total_revenue || 0,
          });
        } else {
          console.error('Failed to fetch analytics data.');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error.message);
      }
    };

    fetchAnalytics();
  }, [transporterId]);

  return (
    <Box sx={{ p: 3 }}>
      {analyticsData ? (
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} sm={6} md={3}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6">Profit</Typography>
                <Typography variant="h4">${analyticsData.profit}</Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={3}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6">Average Rating</Typography>
                <Typography variant="h4">{analyticsData.average_rating.toFixed(1)}</Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={3}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">${analyticsData.total_revenue}</Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Loading analytics data...
        </Typography>
      )}
    </Box>
  );
}

export default AnalyticsCard;
