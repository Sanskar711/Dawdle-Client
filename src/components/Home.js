import React, { useEffect, useState } from 'react';
import VerificationInProgress from './VerificationInProgress';
import VerifiedHome from './VerifiedHome';
import api from '../context/api';  // Use the centralized Axios instance
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
// import './Home.css';  // Importing the CSS file

const Home = () => {
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {isAuthenticated,checkAuth} = useAuth();


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      {isVerified ? <VerifiedHome /> : <VerificationInProgress />}
    </div>
  );
};

export default Home;
