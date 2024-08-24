import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConfirmationPage.css'
const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { productName, companyName } = location.state || {};

    return (
        <div className="confirmation-container">
            <h1>Meeting Scheduled!</h1>
            <p>Your meeting with <strong>{companyName}</strong> for the product <strong>{productName}</strong> has been scheduled.</p>
            <p>The meeting is under confirmation. Once confirmed, you will be able to see it on your dashboard under the "Scheduled Meetings" section.</p>
            <button onClick={() => navigate('/dashboard')} className="dashboard-button">
                Go to Dashboard
            </button>
        </div>
    );
};

export default ConfirmationPage;
