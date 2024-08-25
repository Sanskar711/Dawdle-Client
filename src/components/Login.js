import React, { useState, useEffect } from 'react';
import Otp from './Otp';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext'; // Correct path

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false); // New state for button loading
  const { isAuthenticated, login, error, setError } = useAuth(); // Assuming setError is exposed from context
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError(null); // Clear error when email input changes
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true); // Disable button and show "Sending"
    login(email).then((loginSuccessful) => {
      setIsSending(false); // Re-enable button
      if (loginSuccessful) {
        setIsOtpModalOpen(true);
      }
    });
  };

  const handleOtpResend = (e) => {
    login(email);
    alert("OTP Resent");
  };

  const handleClose = () => {
    setIsOtpModalOpen(false);
  };

  return (
    <div className="login-container">
      <div className="login-logo">Dawdle</div>
      <h2>Sign in</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleInputChange}
          required
        />
        <button
          type="submit"
          className={isSending ? 'sending' : ''}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      
      {isOtpModalOpen && (
        <Otp
          onResend={handleOtpResend}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default Login;
