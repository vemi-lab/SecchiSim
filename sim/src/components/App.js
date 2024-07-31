import React from 'react';
import Signup from './Signup';
import Login from './Login'
import ForgotPassword from './ForgotPassword';
import Dashboard from './Dashboard';
import TryItOut from './disk-sim/TryItOut';
import Instructions from './disk-sim/Instructions';
import ClearLake from './disk-sim/LakeTypes/ClearLake';
import IntermediateLake from './disk-sim/LakeTypes/IntermediateLake';
import ProductiveLake from './disk-sim/LakeTypes/ProductiveLake';
import DystrophicLake from './disk-sim/LakeTypes/DystrophicLake';
import DystrophicProductiveLake from './disk-sim/LakeTypes/DystrophicProductiveLake';
import UpdateProfile from './UpdateProfile';
import PrivateRoute from './PrivateRoute'
import {Container} from 'react-bootstrap';
import {AuthProvider} from "../contexts/AuthContext"
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Container className="d-flex align-items-center justify-content-center" 
          style={{minHeight: "100vh"}}>
          <div className='w-100' style={{maxwidth: "400px"}}>
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route exact path="/dashboard" element={<PrivateRoute component={Dashboard}/>} />
              <Route exact path="/update-profile" element={<PrivateRoute component={UpdateProfile}/>} />
              <Route exact path="/try-it-out" element={<PrivateRoute component={TryItOut}/> } />
              <Route exact path="/instructions" element={<PrivateRoute component={Instructions}/> } />
              <Route path="/lake/clear" element={<PrivateRoute component={ClearLake}/> } />
              <Route path="/lake/intermediate" element={<PrivateRoute component={IntermediateLake}/> } />
              <Route path="/lake/productive" element={<PrivateRoute component={ProductiveLake}/> } />
              <Route path="/lake/dystrophic" element={<PrivateRoute component={DystrophicLake}/> } />
              <Route path="/lake/dystrophic-productive" element={<PrivateRoute component={DystrophicProductiveLake}/> } />
            </Routes>
          </div> 
        </Container>
      </AuthProvider>
    </Router>
  )
}

export default App
