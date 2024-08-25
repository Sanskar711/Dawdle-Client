import React, { useEffect, useState } from 'react';
import './ProductPage.css';
import api from '../../context/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`clients/products/${productId}/`);
        if (response.status !== 200) {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
        setProduct(response.data);
        setEditedProduct(response.data);
      } catch (error) {
        setError(error.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await api.put(`clients/products/${productId}/`, editedProduct);
      if (response.status === 200) {
        setProduct(response.data);
        setIsEditing(false);
        window.alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      window.alert('Failed to update product. Please try again.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product details available.</p>;

  return (
    <>
      <div className="product-profile">
        {!isEditing ? (
          <>
            {/* Product Header */}
            <header className="product-header">
              {product.client.logo_url && (
                <img
                  src={product.client.logo_url}
                  alt="Client Logo"
                  className="client-logo"
                />
              )}
              <h1>{product.name}</h1>
              <div>
                <p>
                  
                </p>
              </div>
            </header>

            {/* Product Description */}
            <section className="product-description">
              <h2>Description</h2>
              <p>{product.description}</p>
            </section>

            {/* Key Features */}
            <section className="product-key-features">
              <h2>Key Features</h2>
              <ul>
                {product.key_features
                  ? product.key_features.split(':').map((feature, index) => (
                      <li key={index}>{feature.trim()}</li>
                    ))
                  : 'No key features available.'}
              </ul>
            </section>

            {/* Key Problems Solved */}
            <section className="product-key-problems">
              <h2>Key Problems Solved</h2>
              <ul>
                {product.key_problems_solved
                  ? product.key_problems_solved
                      .split(':')
                      .map((problem, index) => (
                        <li key={index}>{problem.trim()}</li>
                      ))
                  : 'No key problems solved available.'}
              </ul>
            </section>

            <button className="edit-product-btn" onClick={handleEditToggle}>
              Edit Product
            </button>
          </>
        ) : (
          <div className="modal-overlay">
            <div className="form-popup-content">
              <button className="close-btn" onClick={handleEditToggle}>
                ×
              </button>
              <h2>Edit Product</h2>

              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedProduct.name}
                onChange={handleInputChange}
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={editedProduct.description}
                onChange={handleInputChange}
              />

              <label htmlFor="key_features">Key Features</label>
              <textarea
                id="key_features"
                name="key_features"
                value={editedProduct.key_features}
                onChange={handleInputChange}
                placeholder="Enter key features separated by ':'"
              />
              <small className="help-text">
                List the primary features of the product. Separate each feature with a colon ':'.
              </small>

              <label htmlFor="key_problems_solved">Key Problems Solved</label>
              <textarea
                id="key_problems_solved"
                name="key_problems_solved"
                value={editedProduct.key_problems_solved}
                onChange={handleInputChange}
                placeholder="Enter key problems solved separated by ':'"
              />
              <small className="help-text">
                Describe the main problems that this product addresses. Separate each problem with a colon ':'.
              </small>

              <button className="save-btn" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductPage;
