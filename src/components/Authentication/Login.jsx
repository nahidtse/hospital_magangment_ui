

import slider1 from "../../assets/images/auth-slider/slider1.jpg"
import logo from "../../assets/images/auth-slider/desktop-logo.png"
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;




function Login() {

  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState({});


  const [insertData, setInsertData] = useState({
    identifier: "",
    password: ""
  });


  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setInsertData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const submitHandler = async (event) => {
    event.preventDefault();

    const errors = {};

    const id = insertData.identifier.trim();
    const password = insertData.password.trim();

    // Validate identifier (email OR mobile OR username)
    if (!id) {
      errors.identifier = "Email is required.";
    } else {
      const isEmail = /^\S+@\S+\.\S+$/.test(id);
      const isMobile = /^\d{11}$/.test(id);
      const isUsername = /^[a-zA-Z0-9_]+$/.test(id);

      if (!isEmail && !isMobile && !isUsername) {
        errors.identifier = "Enter valid Email, Mobile or Username.";
      }
    }

    // Validate password
    if (!password) {
      errors.password = "Password is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }


    try {

      const submitData = {
        email: insertData.identifier,
        password: insertData.password,
      }

      // console.log(submitData);
      // return;

      const result = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      console.log(response);
      // return;

      if (response.status == 'success') {
        toast.success(response.message, { autoClose: 1000 });

        // Expire in 5 seconds
        const expiryTime = Date.now() + 60 * 60 * 5000;

        const token = response.data.access_token;
        const user  = response.data.user.name;
        // const roleId = response.user.role_id;
        // const fullName = response.user.full_name;
        // const userName = response.user.user_name;
        // const isActive = response.user.is_active;


        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_token_expiry', expiryTime);
        // localStorage.setItem('role', roleId);

        localStorage.setItem('name', user);
        // localStorage.setItem('user_name', userName);
        // localStorage.setItem('is_active', isActive);

        // Clear form
        setInsertData({
          identifier: "",
          password: ""

        });
        setValidationErrors({})

        // 🔥 Redirect to dashboard
        navigate(`${import.meta.env.BASE_URL}dashboard`);
        // window.location.href = `${import.meta.env.BASE_URL}dashboard`;

      } else {
        if (response.errors) {
          setValidationErrors(response.errors);
        } else if (response.message) {
          setValidationErrors({ message: response.message });
        }
      }


    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.')
      console.log(error);

    }
  }
  return (
    <div>
      <div className="vh-100">
        <div className="row g-0 h-100">
          {/* Left Side */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-danger text-white">
            <img
             src={slider1}
             className='img-fluid w-100' 
             style={{
                maxHeight: "100vh", // screen height
                objectFit: "cover",
              }}
            />
          </div>

          {/* Right Side */}
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center bg-white">
            {/* <h1>Success Section</h1> */}
            <div className="align-items-center justify-content-center" style={{ width: "80%", maxWidth: "350px" }}>
              <div className='text-center mb-4'>
                <img src={logo} style={{height: '100px'}}/>
              </div>

              <form onSubmit={submitHandler}>
                {/* Email */}
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control rounded-pill border border-2 border-dark px-3"
                    placeholder="Enter your email"
                    name="identifier"
                    onChange={onChangeHandler}
                    value={insertData.identifier}
                  />
                  {validationErrors.identifier && (
                    <small className="text-danger ms-2">{validationErrors.identifier}</small>
                  )}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control rounded-pill border border-2 border-dark px-3"
                    placeholder="Enter your password"
                    name="password"
                    onChange={onChangeHandler}
                    value={insertData.password}
                  />
                  {validationErrors.password && (
                    <small className="text-danger ms-2">{validationErrors.password}</small>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center mt-3">
                  <div className="mb-2 text-center">
                    {validationErrors.message && (
                      <small className="text-danger">{validationErrors.message}</small>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary px-5 py-2 rounded-pill"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login