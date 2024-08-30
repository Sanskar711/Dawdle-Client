import React, { useState, useEffect } from 'react';
import './Meetings.css';
import users from '../context/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const MeetingsCard = ({ filterBy, title }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorted, setSorted] = useState(false); // State for sorting order
  const navigate = useNavigate();
  const { isAuthenticated, logout, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await users.get('/clients/meetings/');
        const filteredMeetings = response.data.filter(meeting => meeting.status === filterBy);
        const sortedMeetings = sortMeetings(filteredMeetings, sorted);
        setMeetings(sortedMeetings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [filterBy, sorted]);

  const sortMeetings = (meetings, ascending) => {
    return meetings.sort((a, b) => {
      return ascending
        ? new Date(a.scheduled_at) - new Date(b.scheduled_at)
        : new Date(b.scheduled_at) - new Date(a.scheduled_at);
    });
  };

  const toggleSortOrder = () => {
    setSorted(!sorted);
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
      <button onClick={toggleSortOrder}>
        Sort by Time ({sorted ? 'Latest First' : 'Earliest First'})
      </button>
      <div className="meetings-list">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="meeting-item" onClick={() => handleMeetingDetails(meeting.id)}>
            <strong>
              {meeting.product?.name || "Loading..."}
            </strong>
            <span>{new Date(meeting.scheduled_at).toLocaleString()}</span>
            <span>
              {meeting.prospect?.company_name || "Loading..."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsCard;
