import React, { useState, useRef } from 'react';
import './Otp.css';
import { useAuth } from '../context/Authcontext'; // Correct path
import { useNavigate } from 'react-router-dom';

const Otp = ({ onResend, onClose }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { verifyOtp } = useAuth();
  const inputRefs = useRef([]);
  const navigate  = useNavigate();
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(''); // Clear error when user types

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOtp(otp.join(''))
      .then(() => {
        // Redirect or change component state on success
        navigate("/home")
      })
      .catch((error) => {
        setError('The OTP entered is incorrect, please try again.');
      });
  };

  const handleResend = (e) => {
    onResend();
    setMessage('A new OTP has been sent to your email.');
    setError(''); // Clear previous error if any
  };

  return (
    <div className="otp-modal">
      <div className="otp-container">
        <button className="otp-close-button" onClick={onClose}>×</button>
        <h2>Enter OTP</h2>
        <p>An OTP has been sent to your email id</p>
        {error && <p className="otp-error">{error}</p>}
        
        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <div className="otp-inputs">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="otp-input"
              />
            ))}
          </div>
          <button type="submit" className="otp-submit-button">Sign In</button>
        </form>
        <button onClick={handleResend} className="otp-resend-button">Resend</button>
        {message && <p className="otp-message">{message}</p>}
      </div>
      
    </div>
  );
};

export default Otp;
