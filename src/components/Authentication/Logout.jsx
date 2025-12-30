import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch(`${baseUrl}/logout`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
          }
        });

        // Clear all auth data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_token_expiry");
        localStorage.removeItem("role");
        localStorage.removeItem("full_name");
        localStorage.removeItem("user_name");
        localStorage.removeItem("is_active");

        toast.success("Logged out successfully!");

        // Redirect to login
        navigate("/authentication/login", { replace: true });

      } catch (error) {
        toast.error("Logout failed!");
      }
    };

    doLogout();   // auto trigger on mount
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <h5>Logging out...</h5>
    </div>
  );
};

export default Logout;
