import React, { useState, useEffect } from 'react';
import './UseCases.css';  // Import the CSS file
import api from '../../context/api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import goBack from '../../images/Group 20.png';
import forward from '../../images/Chevron Right.png';
import { useAuth } from '../../context/Authcontext';

const UseCases = () => {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId} = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(()=>{
    if(!isAuthenticated){
        navigate('/login')
    }
  },[isAuthenticated])
  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const response = await api.get(`/users/product/${productId}/usecases/`);
        setUseCases(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUseCases();
  }, [productId]);

  // const {isAuthenticated, fetchUserProfile} = useAuth();
  // useEffect(()=>{
  //   if(isAuthenticated){
  //     fetchUserProfile();
  //     return;
  //   }
  // },[isAuthenticated])
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  const handleUseCaseDetails = (id) => {
    navigate(`/product/${productId}/options/useCases/${id}`);
  }
  return (
    <>
      <button className="go-back" onClick={() => navigate(-1) }>
        <img src={goBack} alt="Go Back" className="go-back-icon" />
      </button>
      <div className="use-cases-container">
        <h1 className="title">Use Cases</h1>
        <ul className="use-cases-list">
          {useCases.map((useCase) => (
            <li key={useCase.id} className="use-case-item" onClick={() => handleUseCaseDetails(useCase.id)}>
              <strong>{useCase.title}</strong>
              <img src={forward} alt="Forward" className="forward-icon2" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UseCases;
