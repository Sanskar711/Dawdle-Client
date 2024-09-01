import React, { useState, useEffect } from 'react';
import Otp from './Otp';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext'; // Correct path

const Login = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false); // State for button loading
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State for OTP modal visibility
  const [otpError, setOtpError] = useState(''); // State for OTP errors
  const [otpMessage, setOtpMessage] = useState(''); // State for OTP messages
  const { isAuthenticated, login, verifyOtp, error, setError } = useAuth(); // Context for authentication
  const navigate = useNavigate();

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsSending(true); // Disable button and show "Sending"
    login(email).then((loginSuccessful) => {
        setIsSending(false); // Re-enable button
        if (loginSuccessful) {
            setIsOtpModalOpen(true); // Open OTP modal on successful login
        } else {
            alert(error || 'Login failed. Please try again.'); // Show an alert if login fails
        }
    });
};


  const handleOtpSubmit = (otp) => {
    verifyOtp(otp)
      .then(() => {
        setIsOtpModalOpen(false);
        navigate('/home'); // Navigate to home on successful OTP verification
      })
      .catch(() => {
        setOtpError('The OTP entered is incorrect, please try again.'); // Display OTP error
      });
  };

  const handleOtpResend = () => {
    login(email).then(() => {
      setOtpMessage('A new OTP has been sent to your email.');
      setOtpError(''); // Clear previous OTP error
    });
  };

  const handleCloseOtpModal = () => {
    setIsOtpModalOpen(false); // Close OTP modal
    setOtpError(''); // Clear OTP error on close
    setOtpMessage(''); // Clear OTP message on close
  };

  return (
    <div className="login-container">
      <div className="login-logo">Dawdle</div>
      <h2>Sign in</h2>
      <form className="login-form" onSubmit={handleLoginSubmit}>
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
          error={otpError}
          message={otpMessage}
          onSubmit={handleOtpSubmit}
          onResend={handleOtpResend}
          onClose={handleCloseOtpModal}
        />
      )}
    </div>
  );
};

export default Login;
