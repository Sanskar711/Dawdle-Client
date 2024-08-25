import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResourcePage.css';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';
const ResourcePage = () => {
  const { productId, pk } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResource, setEditedResource] = useState({ name: '', link: '' });
  const navigate = useNavigate();
  const { isAuthenticated,logout,checkAuth } = useAuth();
  useEffect(()=>{
    checkAuth()
    if(!isAuthenticated){
        logout();
    }
  },[isAuthenticated])
  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/resources/${pk}/`);
        setResource(response.data);
        setEditedResource(response.data);
      } catch (error) {
        setError('Failed to fetch resource details.');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [productId, pk]);

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/clients/products/${productId}/resources/${pk}/`, editedResource);
      setResource(response.data);
      setIsEditing(false);
      window.alert('Resource updated successfully!');
    } catch (error) {
      window.alert('Failed to update resource. Please try again.');
    }
  };

//   const handleDeleteResource = async () => {
//     if (window.confirm('Are you sure you want to delete this resource?')) {
//       try {
//         await api.delete(`/clients/products/${productId}/resources/${pk}/`);
//         window.alert('Resource deleted successfully!');
//         navigate(`/products/${productId}/resources/`);
//       } catch (error) {
//         window.alert('Failed to delete resource. Please try again.');
//       }
//     }
//   };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!resource) return <div>No resource details available.</div>;

  return (
    <div className="resource-detail">
      {!isEditing ? (
        <>
          <h1>{resource.name}</h1>
          <p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              Visit Resource
            </a>
          </p>
          <button onClick={() => setIsEditing(true)}>Edit Resource</button>
          {/* <button onClick={handleDeleteResource}>Delete Resource</button> */}
        </>
      ) : (
        <div className="form-popup-content">
          <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
          <h2>Edit Resource</h2>
          <label htmlFor="name">Resource Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedResource.name}
            onChange={(e) => setEditedResource({ ...editedResource, name: e.target.value })}
          />
          <label htmlFor="link">Resource Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={editedResource.link}
            onChange={(e) => setEditedResource({ ...editedResource, link: e.target.value })}
          />
          <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default ResourcePage;
