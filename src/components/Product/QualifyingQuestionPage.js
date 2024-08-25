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
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({
    question: ''
  });
  const navigate = useNavigate();
  const { isAuthenticated,logout, checkAuth } = useAuth();
  useEffect(()=>{
    checkAuth()
    if(!isAuthenticated){
        logout();
    }
  },[isAuthenticated])
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get(`/clients/products/${productId}/qualifying-questions/${pk}/`);
        setQuestion(response.data);
        setEditedQuestion(response.data);
      } catch (error) {
        setError('Failed to fetch question details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [productId, pk]);

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`/clients/products/${productId}/qualifying-questions/${pk}/`, editedQuestion);
      setQuestion(response.data);
      setIsEditing(false);
      window.alert('Question updated successfully!');
    } catch (error) {
      window.alert('Failed to update question. Please try again.');
    }
  };

 



  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!question) return <div>No question details available.</div>;

  return (
    <div className="question-detail">
      {!isEditing ? (
        <>
          <p>{question.question}</p>
          <button onClick={() => setIsEditing(true)}>Edit Question</button>
          
        </>
      ) : (
        <div className="form-popup-content">
          <button className="close-btn" onClick={() => setIsEditing(false)}>×</button>
          <h2>Edit Question</h2>
          <textarea
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
          />
          <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default QualifyingQuestionPage;
