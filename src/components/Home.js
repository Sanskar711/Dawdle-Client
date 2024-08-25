import React, { useState, useEffect } from 'react';
import VerifiedHome from './VerifiedHome';
import Navbar from './Navbar';
import './Home.css';  // Import the CSS file
import { useAuth } from '../context/Authcontext';
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated,logout } = useAuth();
  useEffect(()=>{
    if(!isAuthenticated){
        logout();
    }
  },[isAuthenticated])
  return (
    <div className="home-container">
      <Navbar setSearchTerm={setSearchTerm} />  {/* Pass setSearchTerm to Navbar */}
      <VerifiedHome searchTerm={searchTerm} />  {/* Pass searchTerm to VerifiedHome */}
    </div>
  );
};

export default Home;
