import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProspectPage.css';
import api from '../../context/api';

const ProspectPage = () => {
  const { productId, pk } = useParams();
  const [prospect, setProspect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProspect, setEditedProspect] = useState({
    company_name: '',
    geography: '',
    status: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProspect = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/prospects/${pk}/`);
        setProspect(response.data);
        setEditedProspect(response.data);
      } catch (error) {
        setError('Failed to fetch prospect details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProspect();
  }, [productId, pk]);

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/clients/products/${productId}/prospects/${pk}/`, editedProspect);
      setProspect(response.data);
      setIsEditing(false);
      window.alert('Prospect updated successfully!');
    } catch (error) {
      window.alert('Failed to update prospect. Please try again.');
    }
  };

  const handleDeleteProspect = async () => {
    if (window.confirm('Are you sure you want to delete this prospect?')) {
      try {
        await api.delete(`/clients/products/${productId}/prospects/${pk}/`);
        window.alert('Prospect deleted successfully!');
        navigate(`/products/${productId}/prospects/`);
      } catch (error) {
        window.alert('Failed to delete prospect. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!prospect) return <div>No prospect details available.</div>;

  return (
    <div className="prospect-detail">
      {!isEditing ? (
        <>
          <h1>{prospect.company_name}</h1>
          <p>Geography: {prospect.geography}</p>
          <p>Status: {prospect.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit Prospect</button>
          <button onClick={handleDeleteProspect}>Delete Prospect</button>
        </>
      ) : (
        <div className="form-popup-content">
          <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
          <h2>Edit Prospect</h2>
          <label htmlFor="company_name">Company Name</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={editedProspect.company_name}
            onChange={(e) => setEditedProspect({ ...editedProspect, company_name: e.target.value })}
          />

          <label htmlFor="geography">Geography</label>
          <input
            type="text"
            id="geography"
            name="geography"
            value={editedProspect.geography}
            onChange={(e) => setEditedProspect({ ...editedProspect, geography: e.target.value })}
          />

          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={editedProspect.status}
            onChange={(e) => setEditedProspect({ ...editedProspect, status: e.target.value })}
          >
            <option value="open">Open For Meeting</option>
            <option value="scheduled">Meeting Scheduled</option>
            <option value="completed">Meeting Completed</option>
            <option value="closed">Deal Closed</option>
          </select>

          <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default ProspectPage;
