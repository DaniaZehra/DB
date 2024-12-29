import React, { useState, useMemo } from 'react';
import { Box, Typography, Switch, FormControlLabel, Button, Slider, Select, MenuItem } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a function for generating the theme based on user preference
const generateTheme = (mode, largerText, highContrast, zoomLevel) => {
  return createTheme({
    palette: {
      primary: {
        main: '#44A1A0',
      },
      secondary: {
        main: '#5D5D81',
      },
      background: {
        default: mode === 'dark' ? '#333' : '#fff',
        paper: mode === 'dark' ? '#424242' : '#f4f4f4',
      },
    },
    typography: {
      fontSize: largerText ? 18 : 14,
    },
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            ...(highContrast && {
              color: '#fff',
              backgroundColor: '#000',
            }),
          },
        },
      },
    },
    spacing: zoomLevel * 8, // Adjust spacing based on zoom level
  });
};

function SettingsPage() {
  const [largerText, setLargerText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [language, setLanguage] = useState('en');

  const theme = useMemo(
    () => generateTheme(isDarkMode ? 'dark' : 'light', largerText, highContrast, zoomLevel),
    [isDarkMode, largerText, highContrast, zoomLevel]
  );

  const handleLargerTextChange = (event) => {
    setLargerText(event.target.checked);
  };

  const handleHighContrastChange = (event) => {
    setHighContrast(event.target.checked);
  };

  const handleDarkModeChange = (event) => {
    setIsDarkMode(event.target.checked);
  };

  const handleZoomChange = (event, newValue) => {
    setZoomLevel(newValue);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify({
      largerText,
      highContrast,
      isDarkMode,
      zoomLevel,
      language,
    }));
    alert('Preferences saved!');
  };

  const handleResetPreferences = () => {
    setLargerText(false);
    setHighContrast(false);
    setIsDarkMode(false);
    setZoomLevel(1);
    setLanguage('en');
    alert('Preferences reset to default!');
  };

  React.useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const { largerText, highContrast, isDarkMode, zoomLevel, language } = JSON.parse(savedPreferences);
      setLargerText(largerText);
      setHighContrast(highContrast);
      setIsDarkMode(isDarkMode);
      setZoomLevel(zoomLevel);
      setLanguage(language);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
        <Typography variant="h4" gutterBottom>
          Settings Page
        </Typography>

        {/* Larger Text Option */}
        <FormControlLabel
          control={<Switch checked={largerText} onChange={handleLargerTextChange} />}
          label="Larger Text"
        />

        {/* High Contrast Mode */}
        <FormControlLabel
          control={<Switch checked={highContrast} onChange={handleHighContrastChange} />}
          label="High Contrast Mode"
        />

        {/* Dark Mode */}
        <FormControlLabel
          control={<Switch checked={isDarkMode} onChange={handleDarkModeChange} />}
          label="Dark Mode"
        />

        {/* Zoom Level Slider */}
        <Typography variant="body2">Zoom Level</Typography>
        <Slider
          value={zoomLevel}
          onChange={handleZoomChange}
          min={0.5}
          max={2}
          step={0.1}
          aria-labelledby="zoom-slider"
        />

        {/* Language Selector */}
        <Typography variant="body2">Language</Typography>
        <Select
          value={language}
          onChange={handleLanguageChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Language Selector' }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="de">German</MenuItem>
        </Select>

        {/* Save and Reset Buttons */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetPreferences}>
            Reset to Default
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SettingsPage;
