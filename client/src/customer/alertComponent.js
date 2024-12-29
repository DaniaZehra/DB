// client/src/components/AlertComponent.js
import React, { useEffect, useState } from 'react';
import { listenForWeatherAlerts } from '../services/socketService';

const AlertComponent = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Listen for weather alerts when the component mounts
    listenForWeatherAlerts((alertData) => {
      setAlert(alertData);
    });
  }, []);

  return (
    <div>
      {alert ? (
        <div className="alert">
          <h2>Weather Alert</h2>
          <p>{alert.message}</p>
          <p><strong>Type:</strong> {alert.alertType}</p>
          <p><strong>Severity:</strong> {alert.severity}</p>
          <p><strong>Region:</strong> {alert.region}</p>
        </div>
      ) : (
        <p>No active alerts</p>
      )}
    </div>
  );
};

export default AlertComponent;
