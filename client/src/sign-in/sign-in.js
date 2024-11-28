import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Cookies from 'js-cookie'
import { Container, FloatingLabel, Row } from 'react-bootstrap';
import './signin.css';

function SignIn() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.password || !formData.username) {
            alert('All fields are required');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include', 
            });
    
            if (response.ok) {
                const userType = Cookies.get('userType');
                const userId = Cookies.get('userId');
    
                if (userType && userId) {
                    alert(`Login Successful! User Type: ${userType}, User ID: ${userId}`);
    
                    if (userType === 'customer') {
                        window.location.href = '/navigation-app-bar';
                    } else if (userType === 'transporter') {
                        window.location.href = '/dashboard';
                    } else {
                        alert('Unknown user type');
                    }
                } else {
                    alert('Login successful, but userType or userId cookie is missing');
                }
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            console.error(err);
            alert(`An error occurred while logging in: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='form-wrapper'>
            <Form onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>
                    Sign-In
                </h2>
                <Container fluid>
                    <Row>
                        <FloatingLabel controlId='username' label='Username'>
                            <Form.Control 
                                type='text' 
                                placeholder='username' 
                                name='username' 
                                value={formData.username} 
                                onChange={handleChange} 
                            />
                        </FloatingLabel>
                    </Row>
                    <Row>
                        <FloatingLabel controlId='password' label='Password'>
                            <Form.Control 
                                type='password' 
                                placeholder='password' 
                                name='password' 
                                value={formData.password} 
                                onChange={handleChange} 
                            />
                        </FloatingLabel>
                    </Row>
                    <Button variant='primary' type='submit' disabled={loading}>
                        {loading ? 'Logging In...' : 'Log In'}
                    </Button>
                </Container>
            </Form>
        </div>
    );
}

export default SignIn;
