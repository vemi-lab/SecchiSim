import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'


export default function PrivateRoute({component: Component}) {
    const {currentUser} = useAuth()

    return currentUser ? <Component /> : <Navigate to="/login" />
}