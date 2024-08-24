import React, { useState, useEffect } from 'react';
import './QualifyingQuestionModal.css';
import api from '../../context/api'; // Assuming you have an API instance

const QualifyingQuestionsModal = ({ isOpen, onClose, onSave, productId }) => {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        if (isOpen) {
            // Fetch qualifying questions when the modal is opened
            api.get(`/users/product/${productId}/questions/`)
                .then(response => {
                    setQuestions(response.data);
                })
                .catch(error => {
                    console.error('Error fetching qualifying questions:', error);
                });
        }
    }, [isOpen, productId]);

    const handleInputChange = (e, questionId) => {
        setResponses({
            ...responses,
            [questionId]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(responses);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Qualifying Questions</h2>
                <button className="close-button" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit}>
                    {questions.map((question) => (
                        <div key={question.id} className="form-group">
                            <label>{question.question}</label>
                            <input
                                type="text"
                                placeholder="Your response"
                                value={responses[question.id] || ''}
                                onChange={(e) => handleInputChange(e, question.id)}
                            />
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default QualifyingQuestionsModal;
