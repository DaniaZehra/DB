import 'bootstrap/dist/css/bootstrap.min.css';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container, FloatingLabel, Row, Col } from 'react-bootstrap';

function SignUpCustomer() {
  return (
    <div className='form-wrapper'>
      <Form>
        <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>
          Sign up a new user
        </h2>
        <Container fluid>
          <Row>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='firstnamLabel' label='First name'>
                <Form.Control type='text' placeholder='First name' />
              </FloatingLabel>
            </Col>
            <Col sm={6} style={{ marginBottom: '10px' }}>
              <FloatingLabel controlId='lastnameLabel' label='Last name'>
                <Form.Control type='text' placeholder='Last name' />
              </FloatingLabel>
            </Col>
          </Row>

          <Row>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel controlId='emailLabel' label='Enter email'>
                <Form.Control type='email' placeholder='Enter email' />
              </FloatingLabel>
              {/* <Form.Text className='text-muted' focus>
                We'll (hopefully) never share your email with anyone else.
              </Form.Text> */}
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel controlId='passwordLabel' label='Phone no.'>
                <Form.Control type='password' placeholder='Password' />
              </FloatingLabel>
            </Form.Group>
          </Row>
                
          <Row>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel controlId='passwordLabel' label='Password'>
                <Form.Control type='password' placeholder='Password' />
              </FloatingLabel>
              <Form.Text className='text-muted' focus>
                Must be 8 characters long, contain a number, an uppercase letter
                and a special character.
              </Form.Text>
            </Form.Group>
          </Row>

          <Row>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <FloatingLabel controlId='confirmationLabel' label='Confirmation'>
                <Form.Control type='password' placeholder='Confirmation' />
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Button variant='primary' type='submit'>
            Register
          </Button>
        </Container>
      </Form>
    </div>
  );
}

export default SignUpCustomer;