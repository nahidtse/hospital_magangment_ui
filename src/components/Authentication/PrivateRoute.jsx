import { Navigate, useLocation } from 'react-router-dom';
import { hasRoutePermission } from '../../common/Sidemenudata';
import { useEffect, useState } from 'react';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('auth_token_expiry');
    const baseURL = import.meta.env.BASE_URL;

    useEffect(() => {
        const checkAccess = async () => {
            setLoading(true);
            
            // 1. First Check Token
            if (!token || (expiry && Date.now() > Number(expiry))) {
                localStorage.clear();
                setHasAccess('LOGIN'); // go back login page
                setLoading(false);
                return;
            }

            // 2. if current path dashboard, without permission show dashboard
            const cleanPath = location.pathname.replace(/\/$/, "");
            const dashboardPath = `${baseURL}dashboard`.replace(/\/+$/, "");

            if (cleanPath === dashboardPath || cleanPath === baseURL.replace(/\/$/, "")) {
                setHasAccess(true);
                setLoading(false);
                return;
            }

            // 3. Dynamic Permission Check for user route
            try {
                const hasPermission = await hasRoutePermission(location.pathname);
                setHasAccess(hasPermission);
            } catch (error) {
                console.error('Permission check error:', error);
                setHasAccess(false);
            }
            
            setLoading(false);
        };

        checkAccess();
    }, [location.pathname]); // Only path change then run

    if (loading) {
        return <div className="text-center mt-5">Checking Permissions... Private Route</div>;
    }

    // If Not Login
    if (hasAccess === 'LOGIN' || !token) {
        return <Navigate to="/login" replace />;
    }

    // If Not Permited
    if (hasAccess === false) {
        return <Navigate to={`${baseURL}dashboard`} replace />;
    }

    return children;
};

export default PrivateRoute;