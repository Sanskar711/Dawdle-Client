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
  const [showForm, setShowForm] = useState(false);
  const [newProfile, setNewProfile] = useState({
    industry: '',
    geography: '',
    company_size: '',
    department: '',
    designations: '',
    additional_details: ''
  });
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

  const handleAddProfile = async () => {
    try {
      const response = await api.post(`/clients/products/${productId}/ideal-customer-profiles/`, newProfile);
      setProfiles([...profiles, response.data]);
      setShowForm(false);
      setNewProfile({
        industry: '',
        geography: '',
        company_size: '',
        department: '',
        designations: '',
        additional_details: ''
      });
      window.alert('Profile added successfully!');
    } catch (error) {
      window.alert('Failed to add profile. Please try again.');
    }
  };
  const handleDeleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await api.delete(`/clients/products/${productId}/ideal-customer-profiles/${profileId}/`);
        setProfiles(profiles.filter((profile) => profile.id !== profileId));
        window.alert('Profile deleted successfully!');
      } catch (error) {
        window.alert('Failed to delete profile. Please try again.');
      }
    }
  };

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
              <button className="delete-btn" onClick={() => handleDeleteProfile(profile.id)}>
                Delete
              </button>
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
      <button className="add-profile-btn" onClick={() => setShowForm(true)}>
        Add Profile
      </button>
      {showForm && (
        <div className="form-popup">
          <div className="form-popup-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h2>Add New Profile</h2>
            <label htmlFor="industry">Industry</label>
            <select
              id="industry"
              value={newProfile.industry}
              onChange={(e) => setNewProfile({ ...newProfile, industry: e.target.value })}
            >
              <option value="">Select Industry</option>
              {INDUSTRY_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>

            <label htmlFor="geography">Geography</label>
            <select
              id="geography"
              value={newProfile.geography}
              onChange={(e) => setNewProfile({ ...newProfile, geography: e.target.value })}
            >
              <option value="">Select Geography</option>
              {GEOGRAPHY_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>

            <label htmlFor="company_size">Company Size</label>
            <select
              id="company_size"
              value={newProfile.company_size}
              onChange={(e) => setNewProfile({ ...newProfile, company_size: e.target.value })}
            >
              <option value="">Select Company Size</option>
              {COMPANY_SIZE_CHOICES.map(choice => (
                <option key={choice.value} value={choice.value}>{choice.label}</option>
              ))}
            </select>

            <label htmlFor="department">Department</label>
            <select
              id="department"
              value={newProfile.department}
              onChange={(e) => setNewProfile({ ...newProfile, department: e.target.value })}
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
              value={newProfile.designations}
              onChange={(e) => setNewProfile({ ...newProfile, designations: e.target.value })}
            />

            <label htmlFor="additional_details">Additional Details</label>
            <textarea
              id="additional_details"
              placeholder="Additional details"
              value={newProfile.additional_details}
              onChange={(e) => setNewProfile({ ...newProfile, additional_details: e.target.value })}
            />

            <button className="save-btn" onClick={handleAddProfile}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdealCustomerProfilesPage;
