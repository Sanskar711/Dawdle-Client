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
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await users.get(`clients/meetings/${id}/`);
        setMeeting(response.data);
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

  return (
    <div className="meeting-detail-container">
      <h1>Meeting Details</h1>
      <div className="meeting-info">
        <p><strong>Product:</strong> {meeting.product.name}</p>
        <p><strong>Meeting Date:</strong> {new Date(meeting.scheduled_at).toLocaleString()}</p>
        <p><strong>Status:</strong> {meeting.status}</p>
      </div>
      <div className="prospect-info">
        <h2>Prospect Information</h2>
        <p><strong>Company Name:</strong> {meeting.prospect.company_name}</p>
        <p><strong>Geography:</strong> {meeting.prospect.geography}</p>
        <p><strong>Use Case:</strong> {meeting.use_cases.length > 0 ? meeting.use_cases[0].title : 'N/A'}</p>
        <p><strong>Additional Details:</strong> {meeting.other_relevant_details || 'None'}</p>
        <p><strong>Qualifying Questions:</strong> {meeting.qualifying_question_responses.length > 0 ? meeting.qualifying_question_responses.join(', ') : 'None'}</p>
      </div>
      <div className="poc-info">
        <h2>Point of Contact (POC)</h2>
        <p><strong>First Name:</strong> {meeting.poc_first_name}</p>
        <p><strong>Last Name:</strong> {meeting.poc_last_name}</p>
        <p><strong>Designation:</strong> {meeting.poc_designation}</p>
        {meeting.status === 'completed' && (
          <>
            <p><strong>Email:</strong> {meeting.poc_email}</p>
            <p><strong>Phone Number:</strong> {meeting.poc_phone_number}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default MeetingDetail;
