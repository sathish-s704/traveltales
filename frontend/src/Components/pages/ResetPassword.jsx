import { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css'; // Ensure the CSS file is properly linked

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/reset-password', { email });
      alert('Password reset link sent to your email');
    } catch (error) {
      console.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <button type="submit">Submit</button>
        </form>
        <p className="login-link">
          Remembered your password? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
