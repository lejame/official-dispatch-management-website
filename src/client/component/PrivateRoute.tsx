import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

interface PrivateRouteProps {
    element: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Component }) => {
    return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
