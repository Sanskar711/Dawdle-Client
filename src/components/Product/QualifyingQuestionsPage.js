import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './QualifyingQuestionsPage.css';
import api from '../../context/api';
import arrowIcon from '../../images/Arrow.png';  // Ensure you have an arrow icon in your images folder

const QualifyingQuestionsPage = () => {
  const { productId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: ''
  });
  const navigate = useNavigate();

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

  const handleAddQuestion = async () => {
    try {
      const response = await api.post(`/clients/products/${productId}/qualifying-questions/`, newQuestion);
      setQuestions([...questions, response.data]);
      setShowForm(false);
      setNewQuestion({ question: '' });
      window.alert('Question added successfully!');
    } catch (error) {
      window.alert('Failed to add question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await api.delete(`/clients/products/${productId}/qualifying-questions/${questionId}/`);
        setQuestions(questions.filter((question) => question.id !== questionId));
        window.alert('Question deleted successfully!');
      } catch (error) {
        window.alert('Failed to delete question. Please try again.');
      }
    }
  };

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
              <button className="delete-btn" onClick={() => handleDeleteQuestion(question.id)}>
                Delete
              </button>
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
      <button className="add-question-btn" onClick={() => setShowForm(true)}>
        Add Question
      </button>
      {showForm && (
        <div className="form-popup">
          <div className="form-popup-content">
            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            <h2>Add New Question</h2>
            <textarea
              placeholder="Enter the question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            />
            <button className="save-btn" onClick={handleAddQuestion}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualifyingQuestionsPage;
