import React from 'react';
import './BookingModal.css';

const BookingModal = ({ onClose, onAction, productName }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>Check ICP & Qualifying Questions</h2>
        <p>Before booking a meeting for <strong>{productName}</strong>, would you like to review the Ideal Customer Profiles and Qualifying Questions?</p>
        <div className="modal-actions">
          <button onClick={() => onAction('check')}>Check</button>
          <button onClick={() => onAction('skip')}>Skip</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
