import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom';
import './ForgotPassword.css';


export default function ForgotPassword() {
    const emailRef = useRef()
    const {resetPassword} = useAuth()
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for further instructions')
        } catch {
            setError('Failed to reset password')
        }

        setLoading(false)
    }

  return (
    <>
        <Card>
            <Card.Body className='body'>
                <h2 className="password-header">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>

                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>

                    <Button disabled={loading} className="submit-btn" type="submit">Reset Password</Button>
                </Form>

                <div className='login-btn'>
                    <Link to="/login">Login</Link>
                </div>
            </Card.Body>
        </Card>
        <div className="sign-up-div">
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
    </>
  )
}