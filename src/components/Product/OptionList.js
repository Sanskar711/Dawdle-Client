import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OptionList.css";
import aboutCompany from "../../images/Office.png";
import useCases from "../../images/Project Management.png";
import viewProspect from "../../images/User Account.png";
import calendar from "../../images/Calendar Plus.png";
import goBack from "../../images/Group 20.png";
import forward from "../../images/Forward.png";
import { useAuth } from "../../context/Authcontext";
import BookingModal from "../BookingModal";
import api from "../../context/api";

const OptionList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`users/product/${productId}/info/`);
        if (response.status !== 200) {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
        setProductName(response.data.name);
        setCompanyName(response.data.client.name);
      } catch (error) {
        setError(error.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAboutClick = () => {
    navigate(`/product/${productId}/options/productpage`);
  };

  const handleViewProspect = () => {
    navigate(`/product/${productId}/options/prospectList`);
  };

  const handleUseCases = () => {
    navigate(`/product/${productId}/options/useCases`);
  };

  const handleBookMeeting = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Don't reset productName and companyName here, to preserve the values.
  };

  const handleModalAction = (action) => {
    const meetingPath = action === 'check' 
      ? `/product/${productId}/icp-qualifying-questions`
      : `/product/${productId}/options/book-meeting`;

    navigate(meetingPath, {
      state: {
        productName: productName,
        companyName: companyName,
      },
    });

    handleModalClose();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="option-list-container">
      <button className="go-back" onClick={() => navigate(-1)}>
        <img src={goBack} alt="Go Back" className="go-back-icon" />
      </button>
      <div className="option-list">
        <div className="option-item" onClick={handleAboutClick}>
          <img src={aboutCompany} alt="About" className="option-icon" />
          <span>About Product and Company</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={handleUseCases}>
          <img src={useCases} alt="Use Cases" className="option-icon" />
          <span>Use Cases / Problem Solved by Product</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={handleViewProspect}>
          <img src={viewProspect} alt="Prospects" className="option-icon" />
          <span>View Prospects</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={handleBookMeeting}>
          <img src={calendar} alt="Book Meeting" className="option-icon" />
          <span>Book Meeting</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
      </div>
      {showModal && (
        <BookingModal
          onClose={handleModalClose}
          onAction={handleModalAction}
          productName={productName}
          companyName={companyName}
        />
      )}
    </div>
  );
};

export default OptionList;
