import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LSMLogo from '../assets/lsm-logo.png';
import './Login.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Renamed history → navigate (best practice)

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/instructions'); // Redirect to main screen after login
        } catch {
            setError('Failed to log in');
        }

        setLoading(false);
    }

    return (
        <>
            <Card>
                <Card.Body className='body'>
                    <div className="logo-container">
                        <img src={LSMLogo} alt="Logo" className="lsm-logo" />
                    </div>

                    <h2 className="log-in-header">Log In</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>

                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>

                        <Button disabled={loading} className="submit-btn" type="submit">
                            Login
                        </Button>
                    </Form>

                    <div className="forgor">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="sign-up-div">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    );
}
