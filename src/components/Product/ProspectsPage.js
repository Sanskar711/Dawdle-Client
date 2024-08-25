import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProspectsPage.css';
import api from '../../context/api';
import arrowIcon from '../../images/Arrow.png';  // Ensure you have an arrow icon in your images folder

const ProspectsPage = () => {
  const { productId } = useParams();
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProspect, setNewProspect] = useState({
    company_name: '',
    geography: '',
    status: 'open'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/prospects/`);
        if (Array.isArray(response.data)) {
          setProspects(response.data);
        } else {
          setProspects([]);
        }
      } catch (error) {
        setError('There was an error fetching the prospects!');
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, [productId]);

  const handleAddProspect = async () => {
    try {
      const response = await api.post(`/clients/products/${productId}/prospects/`, newProspect);
      setProspects([...prospects, response.data]);
      setShowForm(false);
      setNewProspect({ company_name: '', geography: '', status: 'open' });
      window.alert('Prospect added successfully!');
    } catch (error) {
      window.alert('Failed to add prospect. Please try again.');
    }
  };

  const handleDeleteProspect = async (prospectId) => {
    if (window.confirm('Are you sure you want to delete this prospect?')) {
      try {
        await api.delete(`/clients/products/${productId}/prospects/${prospectId}/`);
        setProspects(prospects.filter((prospect) => prospect.id !== prospectId));
        window.alert('Prospect deleted successfully!');
      } catch (error) {
        window.alert('Failed to delete prospect. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="prospect-list">
      <h1>Prospects</h1>
      {prospects.length > 0 ? (
        prospects.map((prospect) => (
          <div key={prospect.id} className="prospect-card">
            <h3>{prospect.company_name}</h3>
            <p>Geography: {prospect.geography}</p>
            <p>Status: {prospect.status}</p>
            <div className="prospect-actions">
              <button className="delete-btn" onClick={() => handleDeleteProspect(prospect.id)}>
                Delete
              </button>
              <img
                src={arrowIcon}
                alt="View Details"
                className="arrow-icon"
                onClick={() => navigate(`/products/${productId}/prospects/${prospect.id}`)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No prospects available.</p>
      )}
      <button className="add-prospect-btn" onClick={() => setShowForm(true)}>
        Add Prospect
      </button>
      {showForm && (
        <div className="form-popup">
          <div className="form-popup-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h2>Add New Prospect</h2>
            <input
              type="text"
              placeholder="Company Name"
              value={newProspect.company_name}
              onChange={(e) => setNewProspect({ ...newProspect, company_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Geography"
              value={newProspect.geography}
              onChange={(e) => setNewProspect({ ...newProspect, geography: e.target.value })}
            />
            <select
              value={newProspect.status}
              onChange={(e) => setNewProspect({ ...newProspect, status: e.target.value })}
            >
              <option value="open">Open For Meeting</option>
              <option value="scheduled">Meeting Scheduled</option>
              <option value="completed">Meeting Completed</option>
              <option value="closed">Deal Closed</option>
            </select>
            <button className="save-btn" onClick={handleAddProspect}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProspectsPage;
