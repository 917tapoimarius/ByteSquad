import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';

  if (isLoginPage || isRegisterPage) {
    return (
      <div className="app">
      <div className="left-section">
      </div>
      <div className="content-section">
        {children}
      </div>
      <div className="right-section">
      </div>
    </div>
    );
  }

  return (
    <div>
      <Navbar title='TravelTracker' />

      <div className="app">
        <div className="left-section">
        </div>
        <div className="content-section">
          {children}
        </div>
        <div className="right-section">
        </div>
      </div>
    </div>
  );
};

export default Layout;
