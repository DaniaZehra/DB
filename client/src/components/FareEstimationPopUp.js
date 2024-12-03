import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const FareEstimation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const toggleFareEstimate = () => {
    setIsOpen((prev) => !prev);
  };

  const handleEstimate = async () => {
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
      const fare_estimate = await fetch(
        `${process.env.REACT_APP_BASE_URL}/customer/estimate-fare`,
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

      const result = await fare_estimate.json();
      console.log('Response status:', fare_estimate.status);
      console.log('Full Response:', result);

      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: `Estimated Fare: ${result.estimatedFare}` },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: 'Failed to fetch fare estimate. Please try again.' },
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
      right: '20px',
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
    FareEstimate: {
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
      <button style={styles.button} onClick={toggleFareEstimate}>
        {isOpen ? 'Close' : 'Fare Estimation'}
      </button>
      {isOpen && (
        <div style={styles.FareEstimate}>
          <div style={styles.header}>
            <h4>Fare Estimation</h4>
            <button style={styles.closeButton} onClick={toggleFareEstimate}>
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
            {isTyping && <div style={styles.message.bot}>...</div>}
            <p>Enter your Origin and Destination to get a fare estimate:</p>
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
              onClick={handleEstimate}
            >
              Estimate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareEstimation;
