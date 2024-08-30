import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IdealCustomerProfiles.css';
import api from '../../context/api';
import arrowIcon from '../../images/Arrow.png';

const INDUSTRY_CHOICES = [
  { value: 'Tech', label: 'Technology' },
  { value: 'Health', label: 'Healthcare' },
  // Add more choices as needed
];

const GEOGRAPHY_CHOICES = [
  { value: 'NA', label: 'North America' },
  { value: 'EU', label: 'Europe' },
  // Add more choices as needed
];

const COMPANY_SIZE_CHOICES = [
  { value: 'Small', label: '1-50 employees' },
  { value: 'Medium', label: '51-200 employees' },
  { value: 'Large', label: '201+ employees' },
  // Add more choices as needed
];

const DEPARTMENT_CHOICES = [
  { value: 'HR', label: 'Human Resources' },
  { value: 'IT', label: 'Information Technology' },
  // Add more choices as needed
];

const IdealCustomerProfilesPage = () => {
  const { productId } = useParams();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/ideal-customer-profiles/`);
        if (Array.isArray(response.data)) {
          setProfiles(response.data);
        } else {
          setProfiles([]);
        }
      } catch (error) {
        setError('There was an error fetching the ideal customer profiles!');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [productId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-list">
      <h1>Ideal Customer Profiles</h1>
      {profiles.length > 0 ? (
        profiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            <h3>{profile.industry} - {profile.geography}</h3>
            <p>Company Size: {profile.company_size}</p>
            <p>Department: {profile.department}</p>
            <div className="profile-actions">
              <img
                src={arrowIcon}
                alt="View Details"
                className="arrow-icon"
                onClick={() => navigate(`/products/${productId}/ideal-customer-profiles/${profile.id}`)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No profiles available.</p>
      )}
    </div>
  );
};

export default IdealCustomerProfilesPage;
