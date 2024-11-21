import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, FloatingLabel, Row} from 'react-bootstrap';
import './signin.css';

function SignIn() {
    return (
        <div className='form-wrapper'>
            <Form>
                <h2 style={{ marginBottom: '15px', textAlign: 'center'}}>
                    Sign-In
                </h2>
                <Container fluid>
                    <Row>
                        <FloatingLabel controlId='username' label = 'Username'>
                            <Form.Control type='text' placeholder='username'/>
                        </FloatingLabel>
                    </Row>
                    <Row>
                        <FloatingLabel controlId='password' label = 'password'>
                            <Form.Control type='text' placeholder='password'/>
                        </FloatingLabel>
                    </Row>
                    <Button variant='primary' type='submit'>
                        Sign In
                    </Button>
                </Container>
            </Form>
        </div>
    );
}

export default SignIn;