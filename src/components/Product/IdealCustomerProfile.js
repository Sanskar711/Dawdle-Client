import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IdealCustomerProfile.css';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';
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

const IdealCustomerProfilePage = () => {
  const { productId, pk } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    industry: '',
    geography: '',
    company_size: '',
    department: '',
    designations: '',
    additional_details: ''
  });
  const navigate = useNavigate();
  const { isAuthenticated,logout,checkAuth } = useAuth();
  useEffect(()=>{
    checkAuth()
    if(!isAuthenticated){
        logout();
    }
  },[isAuthenticated])
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/ideal-customer-profiles/${pk}/`);
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (error) {
        setError('Failed to fetch profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [productId, pk]);

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/clients/products/${productId}/ideal-customer-profiles/${pk}/`, editedProfile);
      setProfile(response.data);
      setIsEditing(false);
      window.alert('Profile updated successfully!');
    } catch (error) {
      window.alert('Failed to update profile. Please try again.');
    }
  };

 

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile details available.</div>;

  return (
    <div className="profile-detail">
      {!isEditing ? (
        <>
          <h1>{profile.industry} - {profile.geography}</h1>
          <p>Company Size: {profile.company_size}</p>
          <p>Department: {profile.department}</p>
          <p>Designations: {profile.designations}</p>
          <p>Additional Details: {profile.additional_details}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          
        </>
      ) : (
        <div className="form-popup-content">
          <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
          <h2>Edit Profile</h2>
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={editedProfile.industry}
            onChange={(e) => setEditedProfile({ ...editedProfile, industry: e.target.value })}
          >
            <option value="">Select Industry</option>
            {INDUSTRY_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>

          <label htmlFor="geography">Geography</label>
          <select
            id="geography"
            value={editedProfile.geography}
            onChange={(e) => setEditedProfile({ ...editedProfile, geography: e.target.value })}
          >
            <option value="">Select Geography</option>
            {GEOGRAPHY_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>

          <label htmlFor="company_size">Company Size</label>
          <select
            id="company_size"
            value={editedProfile.company_size}
            onChange={(e) => setEditedProfile({ ...editedProfile, company_size: e.target.value })}
          >
            <option value="">Select Company Size</option>
            {COMPANY_SIZE_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>

          <label htmlFor="department">Department</label>
          <select
            id="department"
            value={editedProfile.department}
            onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {DEPARTMENT_CHOICES.map(choice => (
              <option key={choice.value} value={choice.value}>{choice.label}</option>
            ))}
          </select>

          <label htmlFor="designations">Designations</label>
          <input
            type="text"
            id="designations"
            placeholder="Comma-separated designations"
            value={editedProfile.designations}
            onChange={(e) => setEditedProfile({ ...editedProfile, designations: e.target.value })}
          />

          <label htmlFor="additional_details">Additional Details</label>
          <textarea
            id="additional_details"
            placeholder="Additional details"
            value={editedProfile.additional_details}
            onChange={(e) => setEditedProfile({ ...editedProfile, additional_details: e.target.value })}
          />

          <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default IdealCustomerProfilePage;
