import React, { useState, useRef } from 'react';
import './Otp.css';

const Otp = ({ error, message, onSubmit, onResend, onClose }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));  // Local OTP state
  const inputRefs = useRef([]);  // Ref to manage input focus

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

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
    onSubmit(otp.join(''));  // Pass the OTP as a single string to the parent
  };

  return (
    <div className="otp-modal">
      <div className="otp-container">
        <button className="otp-close-button" onClick={onClose}>×</button>
        <h2>Enter OTP</h2>
        <p>An OTP has been sent to your email id</p>
        {error && <p className="otp-error">{error}</p>}  {/* Display error message */}
        
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
        <button onClick={onResend} className="otp-resend-button">Resend</button>
        {message && <p className="otp-message">{message}</p>}  {/* Display message */}
      </div>
    </div>
  );
};

export default Otp;
