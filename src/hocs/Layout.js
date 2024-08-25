import React, { Fragment,useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/Authcontext';

const Layout = ({ children }) => {
  const { isAuthenticated,logout,checkAuth } = useAuth();
  useEffect(()=>{
    checkAuth()
    if(!isAuthenticated){
        logout();
    }
  },[isAuthenticated])
  return (
    <Fragment>
      {isAuthenticated && <Navbar />}
      {children}
    </Fragment>
  );
};

export default Layout;
