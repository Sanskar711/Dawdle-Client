import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import api from '../../context/api';
import { useNavigate, useParams } from 'react-router-dom';
import goBack from '../../images/Group 20.png';
import { useAuth } from '../../context/Authcontext';
const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  useEffect(()=>{
    if(!isAuthenticated){
        navigate('/login')
    }
  },[isAuthenticated])
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`users/product/${productId}/info/`);
        if (response.status !== 200) {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
        setProduct(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product details available.</p>;

  const renderListFromText = (text) => {
    return text
      .split('\n')
      .flatMap((item) => item.split(':').map((subItem) => subItem.trim()))
      .filter(Boolean)
      .map((item, index) => <li key={index}>{item}</li>);
  };

  return (
    <>
    <button className="go-back" onClick={() => navigate(-1) }>
        <img src={goBack} alt="Go Back" className="go-back-icon" />
      </button>
    <div className="product-profile">
      
      {/* Product Header */}
      <header className="product-header">
        {product.client.logo_url && <img src={product.client.logo_url} alt="Client Logo" className="client-logo" />}
        <h1>{product.name}</h1>
        <p>Org: {product.client.name} <a href={product.client.company_website} target="_blank" rel="noopener noreferrer">Official Website</a></p>
        {product.client.location && <p>{product.client.location}</p>}
      </header>

      {/* Product Description */}
      <section className="product-description">
        <h2>Description</h2>
        <p>{product.description}</p>
        <button>Watch Product Video</button>
        <button>Visit Support Page</button>
        <button>Download User Manual</button>
      </section>

      {/* Key Features */}
      <section className="product-key-features">
        <h2>Key Features</h2>
        <ul>
          {product.key_features ? renderListFromText(product.key_features) : <p>No key features available.</p>}
        </ul>
      </section>

      {/* Key Problems Solved */}
      <section className="product-key-problems">
        <h2>Key Problems Solved</h2>
        <ul>
          {product.key_problems_solved ? renderListFromText(product.key_problems_solved) : <p>No key problems solved available.</p>}
        </ul>
      </section>

      {/* Use Cases */}
      <section className="product-use-cases">
        <h2>Use Cases</h2>
        <ul>
          {product.use_cases.length > 0 ? (
            product.use_cases.map((useCase) => (
              <li key={useCase.id}>
                <strong>{useCase.title}</strong>
              </li>
            ))
          ) : (
            <p>No use cases available.</p>
          )}
        </ul>
      </section>

      {/* Ideal Customer Profiles */}
      <section className="product-ideal-customer-profiles">
        <h2>Ideal Customer Profiles</h2>
        <ul>
          {product.ideal_customer_profiles.length > 0 ? (
            product.ideal_customer_profiles.map((profile) => (
              <li key={profile.id}>
                <strong>Industry:</strong> {profile.industry}<br />
                <strong>Geography:</strong> {profile.geography}<br />
                <strong>Company Size:</strong> {profile.company_size}<br />
                <strong>Department:</strong> {profile.department}<br />
                <strong>Designations:</strong> {profile.designations}<br />
                {profile.additional_details && (
                  <p><strong>Additional Details:</strong> {profile.additional_details}</p>
                )}
              </li>
            ))
          ) : (
            <p>No ideal customer profiles available.</p>
          )}
        </ul>
      </section>

      {/* Qualifying Questions */}
      <section className="product-qualifying-questions">
        <h2>Qualifying Questions</h2>
        <ul>
          {product.qualifying_questions.length > 0 ? (
            product.qualifying_questions.map((question) => (
              <li key={question.id}>{question.question}</li>
            ))
          ) : (
            <p>No qualifying questions available.</p>
          )}
        </ul>
      </section>

      {/* Resources */}
      <section className="product-resources">
        <h2>Downloadable Resources</h2>
        <ul>
          {product.resources.length > 0 ? (
            product.resources.map((resource) => (
              <li key={resource.id}>
                <a href={resource.link} target="_blank" rel="noopener noreferrer">{resource.name}</a>
              </li>
            ))
          ) : (
            <p>No resources available.</p>
          )}
        </ul>
      </section>
    </div>
    </>
  );
}

export default ProductPage;
