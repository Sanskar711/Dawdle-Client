import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './UseCases.css';
import api from '../../context/api';
import arrowIcon from '../../images/Arrow.png';  // Ensure you have an arrow icon in your images folder
import { useAuth } from '../../context/Authcontext';
const UseCasesPage = () => {
  const { productId } = useParams();
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newUseCase, setNewUseCase] = useState({
    title: '',
    description: '',
    solution: '',
    target_audience: '',
    sample_pitch: '',
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
    const fetchUseCases = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/use-cases/`);
        if (Array.isArray(response.data)) {
          setUseCases(response.data);
        } else {
          setUseCases([]);
        }
      } catch (error) {
        setError('There was an error fetching the use cases!');
      } finally {
        setLoading(false);
      }
    };

    fetchUseCases();
  }, [productId]);

  const handleAddUseCase = async () => {
    try {
      const response = await api.post(`/clients/products/${productId}/use-cases/`, newUseCase);
      setUseCases([...useCases, response.data]);
      setShowForm(false);
      setNewUseCase({ title: '', description: '', solution: '', target_audience: '', sample_pitch: '', reference_links: '' });
      window.alert('Use case added successfully!');
    } catch (error) {
      window.alert('Failed to add use case. Please try again.');
    }
  };

  const handleDeleteUseCase = async (useCaseId) => {
    if (window.confirm('Are you sure you want to delete this use case?')) {
      try {
        await api.delete(`/clients/products/${productId}/use-cases/${useCaseId}/`);
        setUseCases(useCases.filter((useCase) => useCase.id !== useCaseId));
        window.alert('Use case deleted successfully!');
      } catch (error) {
        window.alert('Failed to delete use case. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="usecase-list">
      <h1>Use Cases</h1>
      {useCases.length > 0 ? (
        useCases.map((useCase) => (
          <div key={useCase.id} className="usecase-card">
            <h3>{useCase.title}</h3>
            
            <div className="usecase-actions">
              <button className="delete-btn" onClick={() => handleDeleteUseCase(useCase.id)}>
                Delete
              </button>
              <img
                src={arrowIcon}
                alt="View Details"
                className="arrow-icon"
                onClick={() => navigate(`/products/${productId}/use-cases/${useCase.id}`)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No use cases available.</p>
      )}
      <button className="add-usecase-btn" onClick={() => setShowForm(true)}>
        Add Use Case
      </button>
      {showForm && (
        <div className="form-popup-overlay">
          <div className="form-popup-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h2>Add New Use Case</h2>
            
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter the title"
              value={newUseCase.title}
              onChange={(e) => setNewUseCase({ ...newUseCase, title: e.target.value })}
            />
            <small className="help-text">Provide a brief title for the use case.</small>
            
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter the description"
              value={newUseCase.description}
              onChange={(e) => setNewUseCase({ ...newUseCase, description: e.target.value })}
            />
            <small className="help-text">Describe the use case in detail.</small>

            <label htmlFor="solution">Solution</label>
            <textarea
              id="solution"
              placeholder="Describe the solution"
              value={newUseCase.solution}
              onChange={(e) => setNewUseCase({ ...newUseCase, solution: e.target.value })}
            />
            <small className="help-text">Explain how the product solves the problem.</small>

            <label htmlFor="target_audience">Target Audience</label>
            <textarea
              id="target_audience"
              placeholder="Describe the target audience"
              value={newUseCase.target_audience}
              onChange={(e) => setNewUseCase({ ...newUseCase, target_audience: e.target.value })}
            />
            <small className="help-text">Identify the audience that would benefit from this use case.</small>

            <label htmlFor="sample_pitch">Sample Pitch</label>
            <textarea
              id="sample_pitch"
              placeholder="Provide a sample pitch"
              value={newUseCase.sample_pitch}
              onChange={(e) => setNewUseCase({ ...newUseCase, sample_pitch: e.target.value })}
            />
            <small className="help-text">Write a sample pitch to present the use case.</small>

            <label htmlFor="reference_links">Reference Links</label>
            <textarea
              id="reference_links"
              placeholder="Provide reference links"
              value={newUseCase.reference_links}
              onChange={(e) => setNewUseCase({ ...newUseCase, reference_links: e.target.value })}
            />
            <small className="help-text">Add any relevant reference links.</small>

            <button className="save-btn" onClick={handleAddUseCase}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UseCasesPage;
