import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Components/pages/Register';
import Login from './Components/pages/Login';
import ResetPassword from './Components/pages/ResetPassword';
import Home from './Components/pages/Home';
import VerifyEmail from './Components/pages/Emailverify';



const App = () => {
  return (
    <div>
      < Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={< VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />  

        </Routes> 
      </Router> 
    </div>
  )
}

export default App


