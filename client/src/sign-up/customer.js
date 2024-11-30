import 'bootstrap/dist/css/bootstrap.min.css';
import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, FloatingLabel, Row, Col } from 'react-bootstrap';


function SignUpCustomer() {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    cust_email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/auth/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Registration successful');
        window.location.href = '/navigation-app-bar'
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while registering.');
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='form-wrapper'>
      <Form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>
          Sign up a new user
        </h2>
        <Container fluid>
          <Row>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='firstnamLabel' label='First name'>
                <Form.Control 
                  type='text' 
                  placeholder='First name'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange} />
              </FloatingLabel>
            </Col>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='lastnameLabel' label='Last name'>
                <Form.Control 
                  type='text' 
                  placeholder='Last name'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange} />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Form.Group className='mb-3' controlId='username'>
              <FloatingLabel controlId='usernameLabel' label='Username'>
                <Form.Control 
                  type='text' 
                  placeholder='Username'
                  name='username'
                  value={formData.username}
                  onChange={handleChange} />
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Row>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='emailLabel' label='Email'>
                <Form.Control 
                  type='text' 
                  placeholder='Email'
                  name='cust_email'
                  value={formData.cust_email}
                  onChange={handleChange} />
              </FloatingLabel>
            </Col>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='phoneno' label='Phone'>
                <Form.Control 
                  type='text' 
                  placeholder='Phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange} />
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel controlId='passwordLabel' label='Password'>
                <Form.Control 
                  type='password' 
                  placeholder='Password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange} />
              </FloatingLabel>
              <Form.Text className='text-muted'>
                Must be 8 characters long, contain a number, an uppercase letter, and a special character.
              </Form.Text>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className='mb-3' controlId='confirmPassword'>
              <FloatingLabel controlId='confirmationLabel' label='Confirm Password'>
                <Form.Control 
                  type='password' 
                  placeholder='Confirm Password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange} />
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Button variant='primary' type='submit' disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Container>
      </Form>
    </div>
  );
}

export default SignUpCustomer;
