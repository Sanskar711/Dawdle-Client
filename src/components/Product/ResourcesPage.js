import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResourcesPage.css';
import api from '../../context/api';
import arrowIcon from '../../images/Arrow.png';  // Make sure to have an arrow icon in your images folder
import { useAuth } from '../../context/Authcontext';
const ResourcesPage = () => {
  const { productId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', link: '' });
  const navigate = useNavigate();
  const { isAuthenticated,logout,checkAuth } = useAuth();
  useEffect(()=>{
    checkAuth()
    if(!isAuthenticated){
        logout();
    }
  },[isAuthenticated])
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/resources/`);
        if (Array.isArray(response.data)) {
          setResources(response.data);
        } else {
          setResources([]);
        }
      } catch (error) {
        setError('There was an error fetching the resources!');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [productId]);

  const handleAddResource = async () => {
    try {
      const response = await api.post(`/clients/products/${productId}/resources/`, newResource);
      setResources([...resources, response.data]);
      setShowForm(false);
      setNewResource({ name: '', link: '' });
      window.alert('Resource added successfully!');
    } catch (error) {
      window.alert('Failed to add resource. Please try again.');
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/clients/products/${productId}/resources/${resourceId}/`);
        setResources(resources.filter((resource) => resource.id !== resourceId));
        window.alert('Resource deleted successfully!');
      } catch (error) {
        window.alert('Failed to delete resource. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="resource-list">
      <h1>Resources</h1>
      {resources.length > 0 ? (
        resources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              <h3>{resource.name}</h3>
            </a>
            <div className="resource-actions">
              <button className="delete-btn" onClick={() => handleDeleteResource(resource.id)}>
                Delete
              </button>
              <img
                src={arrowIcon}
                alt="View Details"
                className="arrow-icon"
                onClick={() => navigate(`/products/${productId}/resources/${resource.id}`)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No resources available.</p>
      )}
      <button className="add-resource-btn" onClick={() => setShowForm(true)}>
        Add Resource
      </button>
      {showForm && (
        <div className="form-popup">
          <div className="form-popup-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h2>Add New Resource</h2>
            <input
              type="text"
              placeholder="Resource Name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
            />
            <input
              type="url"
              placeholder="Resource Link"
              value={newResource.link}
              onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
            />
            <button className="save-btn" onClick={handleAddResource}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
