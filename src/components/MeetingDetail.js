import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import users from '../context/api';  // Replace api with users
import './MeetingDetail.css';
import { useAuth } from '../context/Authcontext';

const MeetingDetail = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout, checkAuth]);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await users.get(`clients/meetings/${id}/`);
        setMeeting(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const isMeetingCompleted = meeting.status === 'completed' || meeting.status === 'closed';

  return (
    <div className="meeting-detail-container">
      <h1>Meeting Details</h1>
      <div className="meeting-info">
        <p><strong>Product:</strong> {meeting.product.name}</p>
        <p><strong>Meeting Date & Time:</strong> {new Date(meeting.scheduled_at).toLocaleString()}</p>
        <p><strong>Status:</strong> {meeting.status}</p>
      </div>
      <div className="prospect-info">
        <h2>Prospect Information</h2>
        <p><strong>Company Name:</strong> {meeting.prospect.company_name}</p>
        <p><strong>Geography:</strong> {meeting.prospect.geography}</p>
      </div>
      <div className="poc-info">
        <h2>Point of Contact (POC)</h2>
        <p><strong>Name:</strong> {meeting.poc_first_name} {meeting.poc_last_name}</p>
        <p><strong>Designation:</strong> {meeting.poc_designation}</p>
        {isMeetingCompleted && (
          <>
            <p><strong>Email:</strong> {meeting.poc_email}</p>
            <p><strong>Phone Number:</strong> {meeting.poc_phone_number}</p>
          </>
        )}
      </div>
      <div className="questions-info">
        <h2>Qualifying Questions & Responses</h2>
        {meeting.qualifying_question_responses.length > 0 ? (
          meeting.qualifying_question_responses.map((q, index) => (
            <div key={index} className="question-response">
              <p><strong>Question:</strong> {q.qualifying_question.question}</p>
              <p><strong>Response:</strong> {q.response}</p>
            </div>
          ))
        ) : (
          <p>None</p>
        )}
      </div>
      <div className="use-cases-info">
        <h2>Use Cases</h2>
        {meeting.use_cases.length > 0 ? (
          meeting.use_cases.map((uc, index) => (
            <div key={index} className="use-case">
              <p><strong>Title:</strong> {uc.title}</p>
              <p><strong>Description:</strong> {uc.description}</p>
            </div>
          ))
        ) : (
          <p>N/A</p>
        )}
      </div>
      <div className="additional-details">
        <h2>Additional Details</h2>
        <p>{meeting.other_relevant_details || 'None'}</p>
      </div>
      {isMeetingCompleted && meeting.meeting_notes && (
        <div className="meeting-notes">
          <h2>Meeting Notes</h2>
          <p>{meeting.meeting_notes}</p>
        </div>
      )}
    </div>
  );
};

export default MeetingDetail;
