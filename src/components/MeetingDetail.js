import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import users from '../context/api';  // Replace api with users
import './MeetingDetail.css';

const MeetingDetail = () => {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <p><strong>Approved:</strong> {meeting.prospect.is_approved ? 'Yes' : 'No'}</p>
        <p><strong>Geography:</strong> {meeting.prospect.geography}</p>
        <p><strong>Status:</strong> {meeting.prospect.status}</p>
      </div>
    </div>
  );
};

export default MeetingDetail;
