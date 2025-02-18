import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import ResetPassword from './Components/Auth/ResetPassword';


const App = () => {
  return (
    <div>
      < Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes> 
      </Router> 
    </div>
  )
}

export default App


