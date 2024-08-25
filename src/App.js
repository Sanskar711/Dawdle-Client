import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from '../src/hocs/Layout'

import { AuthProvider } from './context/Authcontext'; 

import Profile from './components/Profile';



import Dashboard from './components/Dashboard';
import MeetingDetail from './components/MeetingDetail';
import MeetingsCard from './components/Meetings';
import ICPQualifyingQuestions from './components/ICPQuestions';
import ProductsPage from './components/ProductsPage';
import ResourcePage from './components/Product/ResourcePage';
import ResourcesPage from './components/Product/ResourcesPage';
import IdealCustomerProfilePage from './components/Product/IdealCustomerProfile';
import IdealCustomerProfilesPage from './components/Product/IdealCustomerProfiles';
import QualifyingQuestionsPage from './components/Product/QualifyingQuestionsPage';
import QualifyingQuestionPage from './components/Product/QualifyingQuestionPage';
import ProspectsPage from './components/Product/ProspectsPage';
import ProspectPage from './components/Product/ProspectPage';
import UseCasePage from './components/Product/UseCase';
import UseCasesPage from './components/Product/UseCases';
import OptionList from './components/Product/OptionList';
import ProductPage from './components/Product/ProducPage';


const App = () => {


  return (
    <AuthProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
         
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          
          <Route path = "/profile" element={<Profile/>} />
          
          <Route path = "/dashboard" element={<Dashboard/>} />
          <Route path="/" element={<MeetingsCard filterBy="scheduled" title="Scheduled Meetings" />} />
          <Route path="/meetings/:id" element={<MeetingDetail />} />
          <Route path="/product/:productId/options/" element={<OptionList />} />
          <Route path="/product/:productId/product-page/" element={<ProductPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:productId/resources/" element={<ResourcesPage />} />
        <Route path="/products/:productId/resources/:pk/" element={<ResourcePage />} />
        <Route path="/products/:productId/ideal-customer-profiles/" element={<IdealCustomerProfilesPage/>} />
        <Route path="/products/:productId/ideal-customer-profiles/:pk/" element={<IdealCustomerProfilePage />} />
        <Route path="/products/:productId/qualifying-questions/" element={<QualifyingQuestionsPage />} />
        <Route path="/products/:productId/qualifying-questions/:pk/" element={<QualifyingQuestionPage />} />
        <Route path="/products/:productId/prospects/" element={<ProspectsPage />} />
        <Route path="/products/:productId/prospects/:pk/" element={<ProspectPage />} />
        <Route path="/products/:productId/use-cases/" element={<UseCasesPage />} />
        <Route path="/products/:productId/use-cases/:pk/" element={<UseCasePage />} />
        </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
