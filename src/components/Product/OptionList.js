import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OptionList.css";
import aboutCompany from "../../images/Office.png";
import useCases from "../../images/Project Management.png";
import viewProspect from "../../images/User Account.png";
import calendar from "../../images/Calendar Plus.png";
import forward from "../../images/Forward.png";
import { useAuth } from "../../context/Authcontext";
import api from "../../context/api";

const OptionList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated,checkAuth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth()
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`clients/products/${productId}/`);
        if (response.status !== 200) {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
        setProductName(response.data.name);
        setCompanyName(response.data.client.name);
      } catch (err) {
        setError(err.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="option-list-container">
      <div className="option-list">
        <div className="option-item" onClick={() => handleNavigation(`/product/${productId}/product-page/`)}>
          <img src={aboutCompany} alt="About" className="option-icon" />
          <span>About Product and Company</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={() => handleNavigation(`/products/${productId}/use-cases/`)}>
          <img src={useCases} alt="Use Cases" className="option-icon" />
          <span>Use Cases / Problem Solved by Product</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={() => handleNavigation(`/products/${productId}/prospects/`)}>
          <img src={viewProspect} alt="Prospects" className="option-icon" />
          <span>View Prospects</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={() => handleNavigation(`/products/${productId}/qualifying-questions/`)}>
          <img src={useCases} alt="Qualifying Questions" className="option-icon" />
          <span>Qualifying Questions</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={() => handleNavigation(`/products/${productId}/ideal-customer-profiles/`)}>
          <img src={viewProspect} alt="ICP" className="option-icon" />
          <span>Ideal Customer Profiles</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
        <div className="option-item" onClick={() => handleNavigation(`/products/${productId}/resources/`)}>
          <img src={calendar} alt="Resources" className="option-icon" />
          <span>Resources</span>
          <img src={forward} alt="Forward" className="forward-icon" />
        </div>
      </div>
      
    </div>
  );
};

export default OptionList;
