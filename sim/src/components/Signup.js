import React, {useRef, useState} from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import invertLogo from '../assets/invert-logo.png';
import './Signup.css';


export default function Signup() {
    const fullNameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPasswordRules, setShowPasswordRules] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        numbers: false,
        specialChars: false,
    });

    const navigate = useNavigate();

    function validatePassword(password) {
        setPasswordStrength({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            numbers: (password.match(/\d/g) || []).length >= 2,
            specialChars: (password.match(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/g) || []).length >= 2,
        });
    }

    function handlePasswordChange(e) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if(!fullNameRef.current.value || !phoneRef.current.value) {
            return setError("Full name and phone number are required.")
        }

        if (!Object.values(passwordStrength).every(Boolean)) {
            return setError('Your password does not meet the required strength.');
        }

        try {
            setError('');
            setLoading(true);
            await signup(emailRef.current.value, password, fullNameRef.current.value, phoneRef.current.value);
            alert("Please check your email to verify your account before logging in.");
            navigate("/login"); // Ensure this is called after successful signup
        } catch (error) {
            setError(error.message); // Display the error message
        } finally {
            setLoading(false);
        }
    }



  return (
    <>
        <Card>
            <Card.Body className='body'>
                <div className="logo-container">
                    <img src={invertLogo} alt="Logo" className="invert-lsm-logo" />
                </div>
                <h2 className="sign-up-header">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>

                    <Form.Group id="full-name">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="full name" ref={fullNameRef} required />
                    </Form.Group>

                    <Form.Group id="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="phone number" ref={phoneRef} required/>
                    </Form.Group>

                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>

                    <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                value={password} 
                                onChange={handlePasswordChange} 
                                onFocus={() => setShowPasswordRules(true)} 
                                onBlur={() => password === "" && setShowPasswordRules(false)}
                                required 
                            />
                            {showPasswordRules && (
                                <div className="password-strength">
                                    <p className={passwordStrength.length ? 'valid' : 'invalid'}>✔ At least 8 characters</p>
                                    <p className={passwordStrength.uppercase ? 'valid' : 'invalid'}>✔ At least 1 uppercase letter</p>
                                    <p className={passwordStrength.numbers ? 'valid' : 'invalid'}>✔ At least 2 numbers</p>
                                    <p className={passwordStrength.specialChars ? 'valid' : 'invalid'}>✔ At least 2 special characters</p>
                                </div>
                            )}
                        </Form.Group>

                    <Button disabled={loading} className="submit-btn" type="submit">Sign Up</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="login-div">
            Already have an account? <Link to="/login">Login</Link>
        </div>
    </>
  )
}
