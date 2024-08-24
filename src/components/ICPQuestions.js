import React, { useEffect, useState } from 'react';
import './ICPQuestions.css';
import api from '../context/api';
import goBack from '../images/Group 20.png';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const ICPQualifyingQuestions = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the prospectId from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const prospectId = queryParams.get('prospectId');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`users/product/${productId}/info/`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching ICP and Qualifying Questions');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleContinueToBook = () => {
    const newQueryParams = new URLSearchParams();
    
    if (prospectId) {
      newQueryParams.set('prospectId', prospectId);
    }

    navigate(`/product/${productId}/options/book-meeting?${newQueryParams}`, {
      state: {
        productName: product.name,
        companyName: product.client.name,
      },
    });
  };

  return (
    <div className="icp-qualifying-questions">
      <button className="go-back" onClick={() => navigate(-1) }>
        <img src={goBack} alt="Go Back" className="go-back-icon" />
      </button>
      <h2>{product?.name} - ICP & Qualifying Questions</h2>
      
      {/* Ideal Customer Profiles */}
      <section>
        <h3>Ideal Customer Profiles</h3>
        <ul>
          {product?.ideal_customer_profiles.length > 0 ? (
            product.ideal_customer_profiles.map((profile, index) => (
              <li key={index}>
                <strong>Industry:</strong> {profile.industry} <br />
                <strong>Geography:</strong> {profile.geography} <br />
                <strong>Company Size:</strong> {profile.company_size} <br />
                <strong>Department:</strong> {profile.department} <br />
                <strong>Designations:</strong> {profile.designations} <br />
                {profile.additional_details && (
                  <p><strong>Additional Details:</strong> {profile.additional_details}</p>
                )}
              </li>
            ))
          ) : (
            <p>No Ideal Customer Profiles available.</p>
          )}
        </ul>
      </section>

      {/* Qualifying Questions */}
      <section>
        <h3>Qualifying Questions</h3>
        <ul>
          {product?.qualifying_questions.length > 0 ? (
            product.qualifying_questions.map((questionObj, index) => (
              <li key={index}>{questionObj.question}</li>
            ))
          ) : (
            <p>No Qualifying Questions available.</p>
          )}
        </ul>
      </section>

      <button className="continue-button" onClick={handleContinueToBook}>
        Continue to Book Meeting
      </button>
    </div>
  );
};

export default ICPQualifyingQuestions;
