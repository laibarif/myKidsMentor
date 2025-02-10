import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
function parentLayout() {
  return (
    <div>
      <Header />
      {/* <Footer />
      <> */}
        <Outlet />
    
      
    </div>
  );
}

export default parentLayout;
