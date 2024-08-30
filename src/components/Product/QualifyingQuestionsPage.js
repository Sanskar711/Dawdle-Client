import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QualifyingQuestionsPage.css';
import api from '../../context/api';
import arrowIcon from '../../images/Arrow.png';  // Ensure you have an arrow icon in your images folder
import { useAuth } from '../../context/Authcontext';

const QualifyingQuestionsPage = () => {
  const { productId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, checkAuth, logout]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/qualifying-questions/`);
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          setQuestions([]);
        }
      } catch (error) {
        setError('There was an error fetching the qualifying questions!');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [productId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="question-list">
      <h1>Qualifying Questions</h1>
      {questions.length > 0 ? (
        questions.map((question) => (
          <div key={question.id} className="question-card">
            <p>{question.question}</p>
            <div className="question-actions">
              <img
                src={arrowIcon}
                alt="View Details"
                className="arrow-icon"
                onClick={() => navigate(`/products/${productId}/qualifying-questions/${question.id}`)}
              />
            </div>
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default QualifyingQuestionsPage;
