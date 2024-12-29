import React, { useEffect, useRef } from 'react';

const MapDisplay = ({ origin, destination }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: 24.8607, lng: 67.0011 }, // Centered at Karachi by default
    });

    directionsRenderer.setMap(map);

    // Fetch and display the route
    directionsService.route(
      {
        origin: `${origin}, Karachi`,
        destination: `${destination}, Karachi`,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [origin, destination]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '400px', borderRadius: '8px' }}
    ></div>
  );
};

export default MapDisplay;
