import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
//import { sendEmailVerification } from 'firebase/auth';
import LSMLogo from '../assets/lsm-logo.png';
import './Login.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // const [showResend, setShowResend] = useState(false);
    const navigate = useNavigate(); // Renamed history → navigate (best practice)

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(emailRef.current.value, passwordRef.current.value);
            await new Promise((resolve) => setTimeout(resolve, 500)); // Give Firebase time to update auth state
            const user = auth.currentUser;

            if (user) {
                await user.reload(); //reload only if user is logged in
            }
            
            if (!user || !user.emailVerified) {
                setError("Please verify your email before logging in.");
                // setShowResend(true);
                setLoading(false);
                return;
            }

            navigate('/dashboard'); //allow access if only had verified

        } catch {
            console.error("Login Error:", error);
            setError('Failed to log in');
        }

        setLoading(false);
    }

    // async function handleResendVerification() {
    //     if (auth.currentUser) {
    //         try {
    //             await sendEmailVerification(auth.currentUser);
    //             alert("Verification email sent! Check your inbox.");
    //         } catch (error) {
    //             setError("Error sending verification email. Try again later.");
    //             console.error("Resend Verification Error:", error);
    //         }
    //     }
    // }

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

                    {/* {showResend && (
                        <div className="resend-verification">
                            <p>Didn't receive the email?</p>
                            <Button onClick={handleResendVerification} className="resend-btn">
                                Resend Verification Email
                            </Button>
                        </div>
                    )} */}

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
