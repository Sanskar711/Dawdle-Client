import React, { Fragment,useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/Authcontext';

const Layout = ({ children }) => {
  const { isAuthenticated,logout } = useAuth();
  useEffect(()=>{
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
