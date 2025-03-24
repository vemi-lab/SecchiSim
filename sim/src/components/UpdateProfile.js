import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { updateEmail as updateEmailAuth, updatePassword as updatePasswordAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'


export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const {currentUser} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Password do not match')
        }

        const promises = []
        setLoading(true)
        setError("")

        const credential = EmailAuthProvider.credential(currentUser.email, prompt('Please enter your old password for re-authentication:'));
        try {
            await reauthenticateWithCredential(currentUser, credential);

            //update email if changed
            if (emailRef.current.value !== currentUser.email){
                promises.push(updateEmailAuth(currentUser, emailRef.current.value))
            }
    
            //update password if changed
            if (passwordRef.current.value){
                return promises.push(updatePasswordAuth(currentUser, passwordRef.current.value))
            }
    
            await Promise.all(promises);
            history('/dashboard')
        } catch (err) {
                setError('Failed to update account')
        } finally{
                setLoading(false)
        }
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>

                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef}  placeholder='Leave blank to keep the same' />
                        </Form.Group>

                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
                        </Form.Group>

                        <Button disabled={loading} classname="w-100" type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/dashboard">Cancel</Link>
            </div>
        </>
  );
}
