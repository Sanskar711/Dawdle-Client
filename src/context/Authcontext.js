import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';  // Import the Axios instance
import Cookies from 'js-cookie';  // Use js-cookie for cookie management
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode for decoding JWT tokens

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState(null);
  const [clientProfile, setClientProfile] = useState({});
  const [error, setError] = useState(null);  // Add error state

  const checkAuth = () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decodedToken.exp < currentTime) {
        console.log("Token expired");
        Cookies.remove('token');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        setClientId(decodedToken.client_id);  // Ensure clientId is set
        fetchClientProfile();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchClientProfile = async () => {
    if (!clientId) return;

    try { 
      const response = await api.get(`/clients/client-info/`);
      setClientProfile(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Failed to fetch client profile:', error);
    }
  };

  const login = async (email) => {
    try {
      const response = await api.post('/clients/signin/', { email });
      if (response.data.client_id) {
        setClientId(response.data.client_id);
        setError(null);  // Reset error state if login is successful
        return true;     // Indicate login was successful
      }
    } catch (error) {
      console.error('There was an error sending the OTP!', error);
      if (error.response && error.response.status === 404) {
        setError('Client not found');  // Set error message if client not found
      } else {
        setError('An error occurred while sending the OTP');
      }
      return false;  // Indicate login failed
    }
  };

  const verifyOtp = async (otp) => {
    try {
      if (!clientId) {
        throw new Error('Client ID is not defined');
      }
      const response = await api.post(`/clients/verify_otp_login/${clientId}/`, { code: otp });

      if (response.data.message === 'Client verified successfully') {
        setIsAuthenticated(true);
        const token = response.data.token;
        Cookies.set('token', token, { expires: 1/24, secure: true, sameSite: 'Strict' });
        fetchClientProfile();
      }
    } catch (error) {
      console.error('There was an error verifying the OTP!', error);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      Cookies.remove('token');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, verifyOtp, logout, checkAuth, clientProfile, fetchClientProfile, clientId, error, setError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
