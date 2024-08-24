import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from '../src/hocs/Layout'
import OptionList from './components/Product/OptionList';
import { AuthProvider } from './context/Authcontext'; 
import ProductPage from './components/Product/ProducPage';
import ProspectList from './components/Product/ProspectList';
import UseCases from './components/Product/UseCases';
import Profile from './components/Profile';
import UseCaseDetails from './components/Product/UseCaseDetails';
import BookMeeting from './components/Meeting/BookMeeting';
import ConfirmationPage from './components/Meeting/ConfirmationPage';
import Dashboard from './components/Dashboard';
import MeetingDetail from './components/MeetingDetail';
import MeetingsCard from './components/Meetings';
import ICPQualifyingQuestions from './components/ICPQuestions';

const App = () => {


  return (
    <AuthProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/product/:productId/options" element={<OptionList/>} />
          <Route path="/product/:productId/options/productpage" element={<ProductPage/>}/>
          <Route path="/product/:productId/options/prospectList" element ={<ProspectList/>}/>
          <Route path="/product/:productId/options/useCases" element ={<UseCases/>}/>
          <Route path="/product/:productId/options/useCases/:useCaseId" element ={<UseCaseDetails/>} />
          <Route path="/product/:productId/options/book-meeting" element={<BookMeeting/>} />
          <Route path = "/profile" element={<Profile/>} />
          <Route path ='/confirmation' element={<ConfirmationPage/>}/>
          <Route path = "/dashboard" element={<Dashboard/>} />
          <Route path="/" element={<MeetingsCard filterBy="scheduled" title="Scheduled Meetings" />} />
          <Route path="/meetings/:id" element={<MeetingDetail />} />
          <Route path="/product/:productId/icp-qualifying-questions" element={<ICPQualifyingQuestions />} />
        </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
