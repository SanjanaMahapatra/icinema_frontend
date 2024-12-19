import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './../../context/AuthContext';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { setShowLoginModal } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setShowLoginModal("login");
      setIsAuthenticated(false);
    }
  }, [setShowLoginModal]);

  if (!isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return element;
};

export default PrivateRoute;