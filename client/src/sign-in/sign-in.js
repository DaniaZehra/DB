import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { Container, FloatingLabel, Row } from 'react-bootstrap';
import './signin.css';
import HCaptcha from '@hcaptcha/react-hcaptcha';

function SignIn() {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleVerify = (token) => {
        setToken(token);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setError('Please complete the CAPTCHA');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/captcha/verify-captcha`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        });

        const captchaResult = await response.json();
        if (!captchaResult.success) {
            setError('CAPTCHA verification failed');
            return;
        }
        if (!formData.password || !formData.username) {
            alert('All fields are required');
            return;
        }
        console.log("Payload : " ,JSON.stringify(formData));
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include', 
            });
            console.log("Payload : " ,JSON.stringify(formData));
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('userType', data.userType);
                sessionStorage.setItem('userId', data.userId);

                if (data.userType && data.userId) {
                    alert(`Login Successful! User Type: ${data.userType}, User ID: ${data.userId}`);
    
                    if (data.userType === 'customer') {
                        window.location.href = '/navigation-app-bar';
                    } else if (data.userType === 'transporter') {
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
                    <Row>
                        <HCaptcha
                            sitekey={process.env.REACT_APP_HCAPTCHA_SITE_KEY}
                            onVerify={handleVerify}
                        />
                        {error && <p style={{color:'red'}}>{error}</p>}
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
