import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { auth, db } from "../firebase";
import { updatePassword, signOut } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import './Profile.css';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [volunteerRoles, setVolunteerRoles] = useState({});
  const [isAdmin, setIsAdmin] = useState(false); //track if user is an admin
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ length: false, uppercase: false, numbers: false, specialChars: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, "users", auth.currentUser.email);

    // Listen for real-time changes from Firestore
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);
        setVolunteerRoles(userData.volunteerRoles || {}); 
        setIsAdmin(userData.isAdmin || false); // Check if the user is an admin
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const validatePassword = (password) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      numbers: (password.match(/\d/g) || []).length >= 2,
      specialChars: (password.match(/[^A-Za-z0-9]/g) || []).length >= 2,
    };
    setPasswordStrength(strength);
  };

  const isPasswordStrong = () => {
    return Object.values(passwordStrength).every((rule) => rule === true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!auth.currentUser) return;

    try {
      // Update password if changed
      if (passwordRef.current.value) {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          throw new Error("Passwords do not match");
        }
        if (!isPasswordStrong()) {
          throw new Error("Password does not meet strength requirements.");
        }
        await updatePassword(auth.currentUser, passwordRef.current.value);
      }

      // // Update volunteer roles in Firestore
      // await updateDoc(userDocRef, { volunteerRoles: volunteerRoles });

      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };


// Admin-only function to update volunteer roles
  const handleRoleChange = async (role) => {
    if (!isAdmin) return; // Prevent users from updating roles

    const updatedRoles = {
      ...volunteerRoles,
      [role]: !volunteerRoles[role], // Toggle the role
    };

    setVolunteerRoles(updatedRoles);

    try {
      const userDocRef = doc(db, "users", auth.currentUser.email);
      await updateDoc(userDocRef, { volunteerRoles: updatedRoles });
    } catch (error) {
      console.error("Error updating roles:", error);
    }
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
            <h2>Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            { userData ? (
            <Form onSubmit={handleUpdateProfile} className="profile-form">
              <Form.Group id="full-name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={userData.fullName} disabled />
              </Form.Group>

                <Form.Group id="phone-number">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" value={userData.phoneNumber} disabled />
                </Form.Group>

                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={auth.currentUser.email} disabled />
                </Form.Group>

                <Form.Group id="password" className="form-group">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control 
                    type="password"
                    ref={passwordRef} 
                    placeholder="Leave blank to keep the same" 
                    onChange={(e) => validatePassword(e.target.value)} />
                </Form.Group>

                <Form.Group id="password-confirm" className="form-group">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                </Form.Group>

                <div className="password-strength">
                  <p>Password must contain:</p>
                  <ul className="password-container-list">
                    <li style={{ color: passwordStrength.length ? "green" : "red" }}>✔ 8 characters minimum</li>
                    <li style={{ color: passwordStrength.uppercase ? "green" : "red" }}>✔ At least 1 uppercase letter</li>
                    <li style={{ color: passwordStrength.numbers ? "green" : "red" }}>✔ At least 2 numbers</li>
                    <li style={{ color: passwordStrength.specialChars ? "green" : "red" }}>✔ At least 2 special characters</li>
                  </ul>
                </div>
              </Form>
            ) : (
              <p>Loading...</p>
            )}

            <h3 className="volunteerHeader">Volunteer Roles</h3>
            {Object.keys(volunteerRoles).length > 0 ? (
              <ul className="volunteer-roles-container">
                {Object.entries(volunteerRoles).map(([role, isChecked]) => (
                  <li key={role}>
                    <Form.Check
                      type="checkbox"
                      label={role}
                      checked={isChecked}
                      onChange={() => handleRoleChange(role)}
                      disabled={!isAdmin} // Only admins can modify
                      className="volunteer-roles"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No volunteer roles assigned.</p>
            )}

              <Button disabled={loading} className="profile-btn" type="submit">
                Update Profile
              </Button>
            </Card.Body>
        </Card>

        <div className="logout-sec">
            <Button className="logout-btn" onClick={handleLogout}>Logout</Button>
        </div>
    </div>

  );
}

