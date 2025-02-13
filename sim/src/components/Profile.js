import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { auth, db } from "../firebase";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import UserIcon from '../assets/UserIcon.png';
import './Profile.css';

export default function Profile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [volunteerRoles, setVolunteerRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchUserProfile = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.email);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        emailRef.current.value = auth.currentUser.email;
        setSelectedRoles(userData.volunteerRoles || []);
      } else {
        console.log("No profile found, creating one...");
        await setDoc(userDocRef, { email: auth.currentUser.email, volunteerRoles: [] });
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!auth.currentUser) return;

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        prompt("Please enter your password for re-authentication:")
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      const userDocRef = doc(db, "users", auth.currentUser.email);

      // Update email if changed
      if (emailRef.current.value !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, emailRef.current.value);
        await updateDoc(userDocRef, { email: emailRef.current.value });
      }

      // Update password if changed
      if (passwordRef.current.value) {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          throw new Error("Passwords do not match");
        }
        await updatePassword(auth.currentUser, passwordRef.current.value);
      }

      // Update volunteer roles in Firestore
      await updateDoc(userDocRef, { volunteerRoles: selectedRoles });

      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(role) ? prevRoles.filter((r) => r !== role) : [...prevRoles, role]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
      navigate("/login");
    } catch (error) {
      setError("Error logging out.");
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="profile-container">
        <Card className="profile-card">
            <Card.Body>
            <h2>Update Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleUpdateProfile} className="profile-form">
                <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required defaultValue={auth.currentUser?.email} />
                </Form.Group>

                <Form.Group id="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                </Form.Group>

                <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                </Form.Group>

                <div className="select-role">
                    <h3 className="volunteer-header">Select Volunteer Roles</h3>
                    {["Clean-up Volunteer", "Organizer Volunteer", "Decorator Volunteer"].map((role) => (
                    <Form.Check
                        key={role}
                        type="checkbox"
                        label={role}
                        checked={selectedRoles.includes(role)}
                        onChange={() => handleRoleChange(role)}
                        className="volunteer-roles"
                    />
                    ))}
                </div>

                <Button disabled={loading} className="profile-btn" type="submit">
                Update Profile
                </Button>
            </Form>
            </Card.Body>
        </Card>

        <div className="logout-container">
            <Button className="logout-btn" onClick={handleLogout}>Logout</Button>
        </div>

    </div>

  );
}
