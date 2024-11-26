import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";

const libraries = ["places"]; // Load the Places library for search functionality

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749, // Default latitude (e.g., San Francisco)
  lng: -122.4194, // Default longitude
};

const MapWithSearch = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyD3X0SjDZocXb0C9TCtl9xdebH8MyjIwnI", // Replace with your API key
    libraries,
  });

  const [mapCenter, setMapCenter] = useState(center);
  const [selectedPlace, setSelectedPlace] = useState(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  const handlePlaceSelect = (autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;
      setMapCenter({ lat: location.lat(), lng: location.lng() });
      setSelectedPlace({
        name: place.name,
        lat: location.lat(),
        lng: location.lng(),
      });
    }
  };

  return (
    <div>
      <h1>Search and Locate a Place</h1>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.addListener("place_changed", () =>
            handlePlaceSelect(autocomplete)
          );
        }}
      >
        <input
          type="text"
          placeholder="Search for a place"
          style={{ width: "300px", padding: "10px" }}
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={mapCenter}
      >
        {selectedPlace && (
          <Marker
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            title={selectedPlace.name}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default MapWithSearch;
