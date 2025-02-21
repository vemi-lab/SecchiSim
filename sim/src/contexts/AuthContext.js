import React, {useContext, useState, useEffect} from 'react'
import {auth} from '../firebase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification} from 'firebase/auth'

const AuthContext = React.createContext()


export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(userCredential.user); //send email verification
                return userCredential;
            })
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

    function resendVerificationEmail() {
        if (auth.currentUser && !auth.currentUser.emailVerified){
            return sendEmailVerification(auth.currentUser)
                .then(() => {
                    alert("Verification email sent! Check your inbox.");
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                });
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                if (user.emailVerified){
                    setCurrentUser(user)
                } else {
                    setCurrentUser(null); //prevent unverifed users from accessing this app
                    alert("Please verify your email before loggin in.");
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