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
        
        await sendEmailVerification(user);
        await updateProfile(user, { displayName: fullName });

        //default access roles
        const defaultAccessRoles = {
            "Secchi Simulator": true,
            "Secchi Videos": true,
            "Quizzes": true,
            "Dissolved Oxygen": false,
            "Baseline": false,
            "Epilimnetic Core Tube Sampling": false,
            "Grab Sampler (Kemmerer / Van Dorn": false,
        }
    
        await setDoc(doc(db, "users", email), {
            personal: {
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email
            },
            accessRoles: defaultAccessRoles, // Default empty object
            isAdmin: false, 
            isActive: true,
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
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await user.reload(); // force refresh state
                if (!user.emailVerified){
                    alert("Account created!");
                    setCurrentUser(null);
                } else {
                setCurrentUser(user); //set the authentificated user properly
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