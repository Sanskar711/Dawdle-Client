import React, { useState, useEffect } from 'react';
import './Meetings.css';
import users from '../context/api';  // Replace api with users
import { useNavigate } from 'react-router-dom';

const MeetingsCard = ({ filterBy, title }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await users.get('/clients/meetings/');
        const filteredMeetings = response.data.filter(meeting => meeting.status === filterBy);
        const sortedMeetings = sortMeetings(filteredMeetings);
        setMeetings(sortedMeetings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [filterBy]);

  const sortMeetings = (meetings) => {
    return meetings.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const handleMeetingDetails = (id) => {
    navigate(`/meetings/${id}`);
  };

  return (
    <div className="meetings-container">
      <h1 className="title">{title}</h1>
      <div className="meetings-list">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="meeting-item" onClick={() => handleMeetingDetails(meeting.id)}>
            <strong>
              {meeting.prospect ? meeting.prospect.company_name : "No Prospect Information"}
            </strong>
            <span>{new Date(meeting.scheduled_at).toLocaleString()}</span>
            <span>
              {meeting.product ? meeting.product.name : "No Product Information"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsCard;
