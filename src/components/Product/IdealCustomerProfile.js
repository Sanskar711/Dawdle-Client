import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IdealCustomerProfile.css';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';

const IdealCustomerProfilePage = () => {
  const { productId, pk } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, checkAuth, logout]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/ideal-customer-profiles/${pk}/`);
        setProfile(response.data);
      } catch (error) {
        setError('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [productId, pk]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile details available.</div>;

  return (
    <div className="profile-detail">
      <h1>{profile.industry} - {profile.geography}</h1>
      <p>Company Size: {profile.company_size}</p>
      <p>Department: {profile.department}</p>
      <p>Designations: {profile.designations}</p>
      <p>Additional Details: {profile.additional_details}</p>
    </div>
  );
};

export default IdealCustomerProfilePage;
