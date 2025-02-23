import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Components/pages/Register';
import Login from './Components/pages/Login';
import ResetPassword from './Components/pages/ResetPassword';
import Home from './Components/pages/Home';
import VerifyEmail from './Components/pages/Emailverify';
import Footer from './Components/Footer';
import AdminSignin from './Components/pages/admin/AdminSignin';
import AdminUsers from './Components/pages/admin/AdminUser';
import AdminDashboard from './Components/pages/admin/AdminDashboard';
import Header from './Components/Header';





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

          <Route path="/admin/signin" element={<AdminSignin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/manage-users" element={<AdminUsers />} />

        </Routes> 
        <Footer/>
      </Router> 
    </div>
  )
}

export default App



