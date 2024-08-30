import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UseCase.css';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';
const UseCasePage = () => {
  const { productId, pk } = useParams();
  const [useCase, setUseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUseCase, setEditedUseCase] = useState({
    title: '',
    description: '',
    solution: '',
    target_audience: '',
    // sample_pitch: '',
    reference_links: ''
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
    const fetchUseCase = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/use-cases/${pk}/`);
        setUseCase(response.data);
        setEditedUseCase(response.data);
      } catch (error) {
        setError('Failed to fetch use case details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUseCase();
  }, [productId, pk]);

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/clients/products/${productId}/use-cases/${pk}/update/`, editedUseCase);
      setUseCase(response.data);
      setIsEditing(false);
      window.alert('Use case updated successfully!');
    } catch (error) {
      window.alert('Failed to update use case. Please try again.');
    }
  };

  

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!useCase) return <div>No use case details available.</div>;

  return (
    <div className="usecase-detail">
      {!isEditing ? (
        <>
          <h1>{useCase.title}</h1>
          <p>{useCase.description}</p>
          <p>Solution: {useCase.solution}</p>
          <p>Target Audience: {useCase.target_audience}</p>
          {/* <p>Sample Pitch: {useCase.sample_pitch}</p> */}
          <p>Reference Links: {useCase.reference_links}</p>
          <button onClick={() => setIsEditing(true)}>Edit Use Case</button>
          
        </>
      ) : (
        <div className="form-popup-content">
          <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
          <h2>Edit Use Case</h2>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editedUseCase.title}
            onChange={(e) => setEditedUseCase({ ...editedUseCase, title: e.target.value })}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={editedUseCase.description}
            onChange={(e) => setEditedUseCase({ ...editedUseCase, description: e.target.value })}
          />

          <label htmlFor="solution">Solution</label>
          <textarea
            id="solution"
            name="solution"
            value={editedUseCase.solution}
            onChange={(e) => setEditedUseCase({ ...editedUseCase, solution: e.target.value })}
          />

          <label htmlFor="target_audience">Target Audience</label>
          <textarea
            id="target_audience"
            name="target_audience"
            value={editedUseCase.target_audience}
            onChange={(e) => setEditedUseCase({ ...editedUseCase, target_audience: e.target.value })}
          />

          {/* <label htmlFor="sample_pitch">Sample Pitch</label>
          <textarea
            id="sample_pitch"
            name="sample_pitch"
            value={editedUseCase.sample_pitch}
            onChange={(e) => setEditedUseCase({ ...editedUseCase, sample_pitch: e.target.value })}
          /> */}

          <label htmlFor="reference_links">Reference Links</label>
          <textarea
            id="reference_links"
            name="reference_links"
            value={editedUseCase.reference_links}
            onChange={(e) => setEditedUseCase({ ...editedUseCase, reference_links: e.target.value })}
          />

          <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default UseCasePage;
