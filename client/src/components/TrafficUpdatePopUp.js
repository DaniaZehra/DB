import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import MapDisplay from './MapDisplay';
const TrafficUpdate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleTrafficUpdate = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTrafficUpdate = async () => {
    if (!origin || !destination) {
      alert('Please provide both origin and destination.');
      return;
    }

    const userMessage = {
      type: 'user',
      content: `Origin: ${origin}, Destination: ${destination}`,
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      const traffic_updates = await fetch(
        `${process.env.REACT_APP_BASE_URL}/customer/traffic-updates`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin: origin, destination: destination }),
        }
      );

      console.log('Payload sent to backend:', {
        origin: origin,
        destination: destination,
      });

      if(!traffic_updates.ok){
        alert("error occurred",traffic_updates.status);
        return;
      }
      const result = await traffic_updates.json();
      console.log('Response status:', traffic_updates.status);
      console.log('Full Response:', result);

      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: `Traffic-Updates: \nDistance:${result.trafficData.distance}
             \nDuration: ${result.trafficData.duration}\n
             \nDuration In Traffic: ${result.trafficData.duration_in_traffic}\n
             \nSummary:${result.trafficData.summary} ` },
        
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: 'Failed to fetch traffic data. Please try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
    setOrigin('');
    setDestination('');
  };

  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      right: '200px',
      zIndex: 1000,
    },
    button: {
      backgroundColor: '#0078d4',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    TrafficUpdate: {
      width: '350px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#0078d4',
      color: 'white',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    content: {
      padding: '10px',
      flexGrow: 1,
      overflowY: 'auto',
      maxHeight: '300px',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    footer: {
      padding: '10px',
      textAlign: 'center',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      fontSize: '16px',
    },
    message: {
      user: {
        textAlign: 'right',
        margin: '5px 0',
        padding: '10px',
        backgroundColor: '#e0f7fa',
        borderRadius: '10px',
      },
      bot: {
        textAlign: 'left',
        margin: '5px 0',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
      },
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={toggleTrafficUpdate}>
        {isOpen ? 'Close' : 'Traffic Updates'}
      </button>
      {isOpen && (
        <div style={styles.TrafficUpdate}>
          <div style={styles.header}>
            <h4>Traffic Updates</h4>
            <button style={styles.closeButton} onClick={toggleTrafficUpdate}>
              ✖
            </button>
          </div>
          <div style={styles.content}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={
                  message.type === 'user' ? styles.message.user : styles.message.bot
                }
              >
                {message.content}
              </div>
            ))}
            {origin && destination && (
  <MapDisplay origin={origin} destination={destination} />
)}         
            {isTyping && <div style={styles.message.bot}>...</div>}
            <p>Enter your Origin and Destination to get traffic updates:</p>
            <Row>
              <Col>
                <input
                  type="text"
                  placeholder="Origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  style={styles.input}
                />
              </Col>
              <Col>
                <input
                  type="text"
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={styles.input}
                />
              </Col>
            </Row>
          </div>
          <div style={styles.footer}>
            <Button
              style={{ ...styles.button, width: '100%' }}
              onClick={handleTrafficUpdate}
            >
              Get Update
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficUpdate;
