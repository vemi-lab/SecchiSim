import React, {useRef, useState} from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import invertLogo from '../assets/invert-logo.png';
import './Signup.css';


export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {signup} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        numbers: false,
        specialChars: false,
    });

    function validatePassword(password) {
        setPasswordStrength({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            numbers: (password.match(/\d/g) || []).length >= 2,
            specialChars: (password.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g) || []).length >= 2,
        });
    }

    function handlePasswordChange(e) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    }

    async function handleSubmit(e) {
        e.preventDefault()
        
        if (password !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }
    
        if (!Object.values(passwordStrength).every(Boolean)) {
            return setError('Your password does not meet the required strength.');
        }

        try {
            setError('')
            setLoading(true)
            await signup( emailRef.current.value, password)
            alert("Account created! Please verify your email before loggin in.");

        } catch {
            setError('Failed to create an account')
            setLoading(false)
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
                            required 
                        />
                            <div className="password-strength">
                                <p className={passwordStrength.length ? 'valid' : 'invalid'}>✔ At least 8 characters</p>
                                <p className={passwordStrength.uppercase ? 'valid' : 'invalid'}>✔ At least 1 uppercase letter</p>
                                <p className={passwordStrength.numbers ? 'valid' : 'invalid'}>✔ At least 2 numbers</p>
                                <p className={passwordStrength.specialChars ? 'valid' : 'invalid'}> ✔At least 2 special characters</p>
                            </div>
                    </Form.Group>

                    <Form.Group id="password-confirm">
                        <Form.Label>Password Confirmation</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
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
