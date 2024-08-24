import React, { useEffect, useState } from 'react';
import api from '../context/api';  // Use your Axios instance
import './VerifiedHome.css';


const VerifiedHome = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all products
    api.get('/clients/products/')
      .then(response => {
        setProducts(response.data);
        if (response.data.length > 0) {
          setSelectedProduct(response.data[0].id);  // Set the first product as the default selection
        }
      })
      .catch(error => {
        setError('There was an error fetching the products!');
      });
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      // Fetch prospects based on the selected product
      setLoading(true);
      api.get(`/clients/products/${selectedProduct}/prospects/`)
        .then(response => {
          setProspects(response.data.map(prospect => ({
            ...prospect,
            toggled: false // Initial state for toggles
          })));
          setLoading(false);
        })
        .catch(error => {
          setError('There was an error fetching the prospects!');
          setLoading(false);
        });
    }
  }, [selectedProduct]);

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleToggle = (index) => {
    setProspects(prevProspects => {
      const newProspects = [...prevProspects];
      newProspects[index].toggled = !newProspects[index].toggled;
      return newProspects;
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="prospects-container">
      <h2>Prospects</h2>
      <select className="product-dropdown" value={selectedProduct} onChange={handleProductChange}>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <table className="prospects-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Geographical Location</th>
            <th>Meeting Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {prospects.map((prospect, index) => (
            <tr key={index}>
              <td>{prospect.company_name}</td>
              <td>{prospect.geographical_location}</td>
              <td>{prospect.meeting_status}</td>
              <td>
                <label className="switch">
                  <input type="checkbox" checked={prospect.toggled} onChange={() => handleToggle(index)} />
                  <span className="slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifiedHome;
