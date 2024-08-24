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
          setProspects(response.data);
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
    const updatedProspect = prospects[index];
    const newVisibility = !updatedProspect.is_visible;
  
    // Update the prospect in the backend
    api.put(`/clients/products/${selectedProduct}/prospects/${updatedProspect.id}/`, {
      is_visible: newVisibility,
      company_name: updatedProspect.company_name
    })
    .then(response => {
      console.log(response.data)
      if (response.data.is_visible===newVisibility) {
        // Update the state only after the PUT request is successful
        setProspects(prevProspects => {
          const newProspects = [...prevProspects];
          newProspects[index].is_visible = newVisibility;
          return newProspects;
        });
      } else {
        console.error("Error updating prospect visibility");
      }
    })
    .catch(error => {
      console.error("Error updating prospect visibility", error);
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
            <th>Visibility</th> {/* Added Visibility as the heading */}
          </tr>
        </thead>
        <tbody>
          {prospects.map((prospect, index) => (
            <tr key={index}>
              <td>{prospect.company_name}</td>
              <td>{prospect.geography}</td>
              <td>{prospect.status}</td>
              <td>
                <label className="switch">
                  <input type="checkbox" 
                         checked={prospect.is_visible} 
                         onChange={() => handleToggle(index)} />
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
