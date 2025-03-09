import React, {useContext, useState, useEffect} from 'react'
import {auth, db} from '../firebase'
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    sendEmailVerification,
    updateProfile
} from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore"

const AuthContext = React.createContext()


export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    async function signup(email, password, fullName, phoneNumber) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Send email verification
        await sendEmailVerification(user);
    
        // Update Firebase Auth profile with full name
        await updateProfile(user, { displayName: fullName });
    
        // Save user details to Firestore
        await setDoc(doc(db, "users", user.email), {
          fullName,
          phoneNumber,
          email: user.email,
          volunteerRoles: {}, // Default empty roles
          isAdmin: false, // Default non-admin
        });
    
        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        return signOut(auth)
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    // function resendVerificationEmail() {
    //     if (auth.currentUser && !auth.currentUser.emailVerified){
    //         return sendEmailVerification(auth.currentUser)
    //             .then(() => {
    //                 alert("Verification email sent! Check your inbox.");
    //             })
    //             .catch((error) => {
    //                 console.error("Error sending verification email:", error);
    //             });
    //     }
    // }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                if (user.emailVerified){
                    setCurrentUser(user)
                } else {
                    setCurrentUser(null); //prevent unverifed users from accessing this app
                    alert("Account created! Please verify your email before logging in.");
                    signOut(auth); //log them out
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}