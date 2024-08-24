// src/Register.js
import React, { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const Register = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('individual');
  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    linkedin: '',
    phone: '',
    designation: '',
    companyName: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    // Clear the fields that are not relevant for the selected role
    if (selectedRole === 'individual') {
      setFormValues({ ...formValues, designation: '', companyName: '' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      email: formValues.email,
      phone_number: formValues.phone,
      user_type: role,
      linkedin_id: formValues.linkedin,
      designation: role === 'organization' ? formValues.designation : '',
      company_name: role === 'organization' ? formValues.companyName : ''
    };
    await register(data);
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-logo">Dawdle</div>
      <h2>Create a new account</h2>
      <p>Already have an account? <a href="/login">Sign in</a></p>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleInputChange}
          required
        />
        <div className="role-selector">
          <button
            type="button"
            className={role === 'individual' ? 'active' : ''}
            onClick={() => handleRoleChange('individual')}
          >
            Individual
          </button>
          <button
            type="button"
            className={role === 'organization' ? 'active' : ''}
            onClick={() => handleRoleChange('organization')}
          >
            Organization
          </button>
        </div>
        {role === 'organization' && (
          <>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formValues.companyName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formValues.designation}
              onChange={handleInputChange}
            />
          </>
        )}
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formValues.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formValues.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn"
          value={formValues.linkedin}
          onChange={handleInputChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone No."
          value={formValues.phone}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
