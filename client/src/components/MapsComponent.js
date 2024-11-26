import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const MapComponent = ({ selectedLocation }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyD3X0SjDZocXb0C9TCtl9xdebH8MyjIwnI">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedLocation || { lat: 37.7749, lng: -122.4194 }} // Default to San Francisco
        zoom={selectedLocation ? 12 : 2}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
};

const SearchAndResults = () => {
  const mockResults = [
    { id: 1, name: 'Central Park', details: 'A large public park in New York City.' },
    { id: 2, name: 'Eiffel Tower', details: 'A wrought-iron lattice tower in Paris, France.' },
    { id: 3, name: 'Colosseum', details: 'An ancient amphitheater in Rome, Italy.' },
  ];

  const [results, setResults] = useState(mockResults);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationName
        )}&key=AIzaSyD3X0SjDZocXb0C9TCtl9xdebH8MyjIwnI`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        setSelectedLocation({ lat, lng });
      } else {
        console.error('Geocoding error:', data.status);
      }
    } catch (err) {
      console.error('Error fetching geocoding data:', err);
    }
  };

  return (
    <div>
      {/* Predefined Results Message */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Testing with Predefined Locations
      </Typography>

      {/* Table for Results */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Location Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(row.id)}>
                      {expandedRow === row.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    onClick={() => geocodeLocation(row.name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {row.name}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="body2">{row.details}</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Map */}
      <MapComponent selectedLocation={selectedLocation} />
    </div>
  );
};

export default SearchAndResults;
