import React, { useState, useEffect } from 'react';
import './Profile.css';
import api from '../context/api';
import dummyProfile from '../images/user_default.jpg'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';


const Profile = () => {
  const [originalProfile, setOriginalProfile] = useState({});
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/clients/client-info/`);
        setProfile(response.data);
        setOriginalProfile(response.data);  // Keep a copy of the original data
      } catch (error) {
        console.error('There was an error fetching the client profile!', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = async () => {
    // Revert changes by resetting to the original profile data
    setProfile(originalProfile);
    setIsEditing(false);
  };
  const handleProducts = () => {
    navigate('/products');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFields = {};

    // Compare the original profile with the current profile and only add changed fields to updatedFields
    Object.keys(profile).forEach((key) => {
      if (profile[key] !== originalProfile[key]) {
        updatedFields[key] = profile[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      alert('No changes detected.');
      setIsEditing(false);
      return;
    }

    try {
      await api.put(`/clients/client/update/`, updatedFields);
      alert('Profile updated successfully!');
      setIsEditing(false);
      setOriginalProfile(profile);  // Update original profile with the new values
    } catch (error) {
      console.error('There was an error updating the profile!', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h2>{isEditing ? 'Edit Profile' : 'Profile'}</h2>
        
              <img 
                src={profile.company_logo ? `${api.defaults.baseURL}${profile.company_logo}` : dummyProfile} 
                alt="Company Logo" 
                className="company-logo" 
              />
            
        <form onSubmit={handleSubmit}>
          <label>
            Company Logo:
            <input
              type="file"
              name="company_logo"
              onChange={handleChange}
              disabled={!isEditing}
            />
            
          </label>
          <label>
            Company Description:
            <textarea
              name="company_description"
              value={profile.company_description || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Company Website:
            <input
              type="url"
              name="company_website"
              value={profile.company_website || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Calendly Link:
            <input
              type="url"
              name="calendly_link"
              value={profile.calendly_link || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          {isEditing ? (
            <div className="profile-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancelClick}>Cancel</button>
            </div>
          ) : (
            
            <button type="button" onClick={handleEditClick}>Edit Profile</button>
            
            
          )}
          <button type="button" onClick={handleProducts}>Products</button>
          
          
        </form>
      </div>
    </div>
  );
};

export default Profile;
