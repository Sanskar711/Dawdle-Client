import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import dummyProfile from '../images/user_default.jpg';
import api from '../context/api';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import MeetingsCard from './Meetings';

const Dashboard = () => {
  const { clientProfile, isAuthenticated, fetchClientProfile } = useAuth();
  console.log(clientProfile)
  const [meetingsScheduled, setMeetingsScheduled] = useState(0);
  const [dealsClosed, setDealsClosed] = useState(0);
  const [dealsCompleted, setDealsCompleted] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState('scheduled');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchClientProfile();
      console.log(clientProfile)
      fetchPerformanceMetrics();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await api.get('/clients/meetings/');
      const meetings = response.data;
      
      // console.log(meetings);
      setMeetingsScheduled(meetings.filter(meeting => meeting.status === 'scheduled').length);
      setDealsClosed(meetings.filter(meeting => meeting.status === 'closed').length);
      setDealsCompleted(meetings.filter(meeting => meeting.status === 'completed').length);
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
    }
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'scheduled':
        return 'Scheduled Meetings';
      case 'completed':
        return 'Completed Meetings';
      case 'closed':
        return 'Closed Deals';
      default:
        return 'Meetings';
    }
  };

  // Function to construct the full image URL
  

  return (
    <div className="dashboard-container">
      <div className="user-profile-dashboard">
        {/* User Profile Details */}
        <img 
          src={clientProfile.company_logo?`${api.defaults.baseURL}${clientProfile.company_logo}`:dummyProfile} 
          alt="Company Logo" 
          className="avatar" 
        />
        <h2>{clientProfile?.name || "Sam Rock"}</h2>
        <p>{clientProfile?.email || "samrock@gmail.com"}</p>
        <p>{clientProfile?.company_website || "+1 123456789"}</p>
        <p>{clientProfile?.calendly_link || "Sales Executive"}</p>
      </div>

      <div className="performance-metrics">
        <h1 className="title">Performance Metrics</h1>
        <p className="subtitle">Track your sales performance data</p>
        <div className="metrics">
          <div className="metric-item" onClick={() => handleMetricClick('scheduled')}>
            <span className="metric-number">{meetingsScheduled}</span>
            <span className="metric-label">Meetings Scheduled</span>
          </div>
          <div className="metric-item" onClick={() => handleMetricClick('completed')}>
            <span className="metric-number">{dealsCompleted}</span>
            <span className="metric-label">Meetings Completed</span>
          </div>
          <div className="metric-item" onClick={() => handleMetricClick('closed')}>
            <span className="metric-number">{dealsClosed}</span>
            <span className="metric-label">Deals Closed</span>
          </div>
        </div>
      </div>

      <MeetingsCard filterBy={selectedMetric} title={getMetricTitle()} />
    </div>
  );
};

export default Dashboard;
