import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

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
          body: JSON.stringify({ transporterId: sessionStorage.getItem('userId') }),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (!data || data.length === 0) {
            alert('No analytics available');
          }
          setAnalyticsData({
            profit: data.profit || 0,
            average_rating: Number(data.average_rating) || 0,
            total_revenue: data.total_revenue || 0,
            total_bookings: data.total_bookings || 0,
            completed_bookings: data.completed_bookings || 0,
            pending_bookings: data.pending_bookings || 0,
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
        <Grid container spacing={3}>
          {/* Metric Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6">Profit</Typography>
                <Typography variant="h4">${analyticsData.profit}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6">Average Rating</Typography>
                <Typography variant="h4">{analyticsData.average_rating.toFixed(1)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">${analyticsData.total_revenue}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar Chart for Bookings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bookings Overview
                </Typography>
                <Bar
                  data={{
                    labels: ['Completed', 'Pending'],
                    datasets: [
                      {
                        label: 'Bookings',
                        data: [analyticsData.completed_bookings, analyticsData.pending_bookings],
                        backgroundColor: ['#44A1A0', '#E16F7C'],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Bookings Overview' },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Pie Chart for Revenue Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Distribution
                </Typography>
                <Pie
                  data={{
                    labels: ['Profit', 'Other Revenue'],
                    datasets: [
                      {
                        label: 'Revenue',
                        data: [analyticsData.profit, analyticsData.total_revenue - analyticsData.profit],
                        backgroundColor: ['#44A1A0', '#DFAEB4'],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: true, text: 'Revenue Distribution' },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          Loading analytics data...
        </Typography>
      )}
    </Box>
  );
}

export default AnalyticsCard;
