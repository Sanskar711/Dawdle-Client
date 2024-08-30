import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QualifyingQuestionPage.css';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';

const QualifyingQuestionPage = () => {
  const { productId, pk } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, checkAuth, logout]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/qualifying-questions/${pk}/`);
        setQuestion(response.data);
      } catch (error) {
        setError('Failed to fetch question details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [productId, pk]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!question) return <div>No question details available.</div>;

  return (
    <div className="question-detail">
      <p>{question.question}</p>
    </div>
  );
};

export default QualifyingQuestionPage;
