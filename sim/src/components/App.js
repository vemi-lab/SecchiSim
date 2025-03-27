// import React from 'react';
// import Signup from './Signup';
// import Login from './Login'
// import ForgotPassword from './ForgotPassword';
// import Dashboard from './Dashboard';
// import UpdateProfile from './UpdateProfile';
// import PrivateRoute from './PrivateRoute'
// import {Container} from 'react-bootstrap';
// import {AuthProvider} from "../contexts/AuthContext"
// import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <Container className="d-flex align-items-center justify-content-center" 
//           style={{minHeight: "100vh"}}>
//           <div className='w-100' style={{maxwidth: "400px"}}>
//             <Routes>
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/forgot-password" element={<ForgotPassword />} />
//               <Route exact path="/dashboard" element={<PrivateRoute component={Dashboard}/>} />
//               <Route exact path="/update-profile" element={<PrivateRoute component={UpdateProfile}/>} />
//             </Routes>
//           </div> 
//         </Container>
//       </AuthProvider>
//     </Router>
//   )
// }

// export default App
