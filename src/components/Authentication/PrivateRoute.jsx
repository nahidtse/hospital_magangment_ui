// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
    
//   const token = localStorage.getItem('auth_token');
//   const expiry = localStorage.getItem('auth_token_expiry');
  
//   // if !token → login page redirect
//   if (!token || (expiry && Date.now() > expiry)) {
//   localStorage.clear(); // remove expired token
//   return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default PrivateRoute;





import { Navigate, useLocation } from 'react-router-dom';
import { hasRoutePermission } from '../../common/Sidemenudata';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAccess();
    }, [location.pathname]);

    const checkAccess = async () => {
        setLoading(true);
        
        //Auth Token check
        const token = localStorage.getItem('auth_token');
        const expiry = localStorage.getItem('auth_token_expiry');

        if (!token || (expiry && Date.now() > Number(expiry))) {
            localStorage.clear();
            setHasAccess(false);
            setLoading(false);
            return;
        }

        //Role-based route access check
        try {
            const hasPermission = await hasRoutePermission(location.pathname);
            setHasAccess(hasPermission);
        } catch (error) {
            console.error('Permission check error:', error);
            setHasAccess(false);
        }
        
        setLoading(false);
    };

    if (loading) {
        return <div>Loading...to Protected Route</div>; // loading component
    }

    if (!hasAccess) {
        // no access go to dashboard
        return <Navigate to="/dashboard" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default PrivateRoute;

