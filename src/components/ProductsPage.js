import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductsPage.css';
import api from '../context/api';
import Arrow from '../images/Arrow.png';
import placeholder from '../images/Placeholder.png';
import { useAuth } from '../context/Authcontext'; // Import the useAuth hook

const ProductsPage = () => {
  const { clientId } = useAuth(); // Get clientId from AuthContext
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    key_features: '',
    key_problems_solved: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/clients/products/')
      .then(response => {
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the products!');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');

    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [location.search, products]);

  const handleAddProduct = () => {
    if (!clientId) {
      console.error('Client ID is not available');
      return;
    }

    const productToSave = {
      ...newProduct,
      client: clientId, // Add client ID to the newProduct object
    };

    api.post('/clients/products/', productToSave)
      .then(response => {
        setProducts([...products, response.data]);
        setFilteredProducts([...products, response.data]);
        setShowForm(false);
        setNewProduct({
          name: '',
          description: '',
          key_features: '',
          key_problems_solved: '',
        });
        window.alert('Product added successfully!'); // Success alert
      })
      .catch(error => {
        console.error('There was an error adding the product!', error);
        window.alert('Failed to add product. Please try again.'); // Failure alert
      });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      api.delete('/clients/products/', { data: { id: productId } })
        .then(() => {
          setProducts(products.filter(product => product.id !== productId));
          setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
          window.alert('Product deleted successfully!'); // Success alert
        })
        .catch(error => {
          console.error('There was an error deleting the product!', error);
          window.alert('Failed to delete product. Please try again.'); // Failure alert
        });
    }
  };

  const closeForm = () => {
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      {filteredProducts.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-info">
            <img
              src={product.client_logo ? `${api.defaults.baseURL}${product.client_logo}` : placeholder}
              alt={product.name}
              className="product-logo"
            />
            <div>
              <h3>{product.name}</h3>
            </div>
          </div>
          <div className="button-group">
          <button
              className="delete-btn"
              onClick={() => handleDeleteProduct(product.id)}
            >
              Delete
            </button>
            <button
              className="arrow-btn"
              onClick={() => navigate(`/product/${product.id}/options`)}
            >
              <img src={Arrow} alt="arrow" />
            </button>
            
          </div>
        </div>
      ))}

      <button className="add-product-btn" onClick={() => setShowForm(true)}>
        Add Product
      </button>

      {showForm && (
        <div className="form-popup">
          <div className="form-popup-content">
            <button className="close-btn" onClick={closeForm}>×</button>
            <h2>Add New Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <textarea
              placeholder="Product Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <textarea
              placeholder="Key Features (separate points with ':')"
              value={newProduct.key_features}
              onChange={(e) => setNewProduct({ ...newProduct, key_features: e.target.value })}
            />
            <textarea
              placeholder="Key Problems Solved (separate points with ':')"
              value={newProduct.key_problems_solved}
              onChange={(e) => setNewProduct({ ...newProduct, key_problems_solved: e.target.value })}
            />
            <button className="save-btn" onClick={handleAddProduct}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
