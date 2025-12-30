// import React, { Fragment, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Button, Card, Form } from "react-bootstrap";
// import ALLImages from "../../common/Imagesdata";
// import { toast } from 'react-toastify';
// const baseURL = import.meta.env.VITE_API_BASE_URL;

// const Login = () => {

//   const navigate = useNavigate();

//   const [validationErrors, setValidationErrors] = useState({});


//   const [insertData, setInsertData] = useState({
//     identifier: "",
//     password: ""
//   });


//   const onChangeHandler = (event) => {
//     const { name, value } = event.target;

//     setInsertData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };


//   const submitHandler = async (event) => {
//     event.preventDefault();

//     const errors = {};

//     const id = insertData.identifier.trim();
//     const password = insertData.password.trim();

//     // Validate identifier (email OR mobile OR username)
//     if (!id) {
//       errors.identifier = "Email, Mobile or Username is required.";
//     } else {
//       const isEmail = /^\S+@\S+\.\S+$/.test(id);
//       const isMobile = /^\d{11}$/.test(id);
//       const isUsername = /^[a-zA-Z0-9_]+$/.test(id);

//       if (!isEmail && !isMobile && !isUsername) {
//         errors.identifier = "Enter valid Email, Mobile or Username.";
//       }
//     }

//     // Validate password
//     if (!password) {
//       errors.password = "Password is required.";
//     }


//     // Check if any errors
//     if (Object.keys(errors).length > 0) {
//       setValidationErrors(errors);
//       return;
//     }


//     try {

//       const submitData = {
//         email: insertData.identifier,
//         password: insertData.password,
//       }

//       // console.log(submitData);
//       // return;

//       const result = await fetch(`http://127.0.0.1:8000/api/login`, {
//         method: 'POST',
//         headers: {
//           "Content-type": "application/json"
//         },
//         body: JSON.stringify(submitData)
//       });

//       const response = await result.json();
//       console.log(response);
//       // return;

//       if (response.status == 'success') {
//         toast.success(response.message, { autoClose: 1000 });

//         // Expire in 5 seconds
//         const expiryTime = Date.now() + 60 * 60 * 5000;

//         const token = response.data.access_token;
//         const user  = response.data.user.name;
//         // const roleId = response.user.role_id;
//         // const fullName = response.user.full_name;
//         // const userName = response.user.user_name;
//         // const isActive = response.user.is_active;


//         localStorage.setItem('auth_token', token);
//         localStorage.setItem('auth_token_expiry', expiryTime);
//         // localStorage.setItem('role', roleId);

//         localStorage.setItem('name', user);
//         // localStorage.setItem('user_name', userName);
//         // localStorage.setItem('is_active', isActive);

//         // Clear form
//         setInsertData({
//           identifier: "",
//           password: ""

//         });
//         setValidationErrors({})

//         // 🔥 Redirect to dashboard
//         navigate(`${import.meta.env.BASE_URL}dashboard`);
//         // window.location.href = `${import.meta.env.BASE_URL}dashboard`;

//       } else {
//         if (response.errors) {
//           setValidationErrors(response.errors);
//         } else if (response.message) {
//           setValidationErrors({ message: response.message });
//         }
//       }


//     } catch (error) {
//       toast.error('Internal Error!! Try again after 5 min.')
//       console.log(error);

//     }
//   }

//   return (
//     <Fragment>
//       <div className="d-flex bg-primary justify-content-center align-items-center min-vh-100">
//         <div className="col-login mx-auto">
//           <div className="text-center">
//             {/* <img src={ALLImages('logo')} className="header-brand-img" alt="" /> */}
//           </div>
//         </div>
//         <div className="container-login100">
//           <Card className="wrap-login100 p-0">
//             <Card.Body>
//               <Form className="login100-form validate-form" onSubmit={submitHandler}>
//                 <span className="login100-form-title"> Login </span>

//                 {/* IDENTIFIER FIELD */}
//                 <div className="wrap-input100 validate-input">
//                   <Form.Control
//                     type="text"
//                     className="input100"
//                     name="identifier"
//                     id="input"
//                     placeholder="Email"
//                     onChange={onChangeHandler}
//                     value={insertData.identifier}
//                   />
//                   <span className="focus-input100"></span>
//                   <span className="symbol-input100">
//                     <i className="ri-user-3-fill"></i>
//                   </span>

//                   {/* 🔥 SHOW ERROR HERE */}
//                   {validationErrors.identifier && (
//                     <small className="text-danger">{validationErrors.identifier}</small>
//                   )}
//                 </div>

//                 {/* PASSWORD FIELD */}
//                 <div className="wrap-input100 validate-input">
//                   <Form.Control
//                     type="password"
//                     className="input100"
//                     name="password"
//                     id="input2"
//                     placeholder="Password"
//                     onChange={onChangeHandler}
//                     value={insertData.password}
//                   />
//                   <span className="focus-input100"></span>
//                   <span className="symbol-input100">
//                     <i className="ri-lock-fill"></i>
//                   </span>

//                   {/* 🔥 SHOW ERROR HERE */}
//                   {validationErrors.password && (
//                     <small className="text-danger">{validationErrors.password}</small>
//                   )}
//                 </div>

//                 <div className="text-end pt-1"></div>

//                 <div className="container-login100-form-btn">
//                   <Button type="submit" className="login100-form-btn btn-primary">Login</Button>
//                 </div>

//                 <div className="mt-2 text-center">
//                   {validationErrors.message && (
//                     <small className="text-danger">{validationErrors.message}</small>
//                   )}
//                 </div>

//                 <div className="text-center pt-3">
//                   {/* <p className="text-dark mb-0">
//                     Not a member?
//                     <a href={`${import.meta.env.BASE_URL}authentication/register/`} className="text-primary ms-1 d-inline-flex">
//                       Create an Account
//                     </a>
//                   </p> */}
//                 </div>
//               </Form>

//             </Card.Body>
//             <div className="card-footer border-top">
//               <div className="d-flex justify-content-center my-3">
//                 <Link to="#" className="social-login  text-center"> <i className="ri-google-fill"></i> </Link>
//                 <Link to="#" className="social-login  text-center mx-4"> <i className="ri-facebook-fill"></i> </Link>
//                 <Link to="#" className="social-login  text-center"> <i className="ri-twitter-x-fill"></i> </Link>
//               </div>
//             </div>
//           </Card>
//         </div>

//       </div>

//     </Fragment>
//   )
// }

// export default Login