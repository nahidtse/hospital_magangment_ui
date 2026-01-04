import { Fragment, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { format } from 'date-fns';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const UserEditForm = () => {

  const location = useLocation(); //For State Data Receive
  const passEditFormData = location.state?.editData || '' 

  const navigate = useNavigate();   //For Route Change

  // console.log(passEditFormData);
  
  //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  //*********Check Authentication End***********

 

  const [editFormData, setEditFormData] = useState({
    user_name: '',
    full_name: '',
    email: '',
    mobile_no: '',
    from_date: new Date(),
    to_date: '',
    role_id: '',
    password: '',
    password_confirmation: '',
    is_active: 1
  })

  // console.log(editFormData)

  const [showValidationError, setValidationErrors] = useState({});


  const [userRoles, setUserRoles] = useState([]);

  /** Date Formate Change */
  

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        user_name: passEditFormData.user_name,
        full_name: passEditFormData.full_name,
        email: passEditFormData.email,
        mobile_no: passEditFormData.mobile_no,
        from_date: passEditFormData.from_date,
        to_date: passEditFormData.to_date,
        role_id: passEditFormData.role_id,
        // password: passEditFormData.password,
        // password_confirmation: passEditFormData.password,
        is_active: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);


  /** Admin Roles Data Fetching */
  const userId = 7; // it will be dynamic TODO::

  //----------React Select User Start--------
    useEffect(() => {
      fetch(`${baseURL}/role`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setUserRoles(data.data);
        })
    }, [])

    const activeRoleOptions = userRoles.filter(role => role.is_active == 1).map(role => ({
      value: role.id,
      label: `${role.role_name}`
    }));

    // react-select  onChange handler
    const selectChange = (selectedOption) => {
      setEditFormData(prev => ({
        ...prev,
        role_id: selectedOption? selectedOption.value : null
      }))
    };
  //----------React Select User End--------

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    if (fieldName === "mobile_no" && fieldValue.length > 11) return;

    setEditFormData(newFormData);
  };



  //Handle Submit Edit Data
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.user_name.trim()) {
      errors.user_name = "User Name is required.";
    }
    if (!editFormData.full_name.trim()) {
      errors.full_name = "Full Name is required.";
    }
    if (!editFormData.email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(editFormData.email)) {
      errors.email = "Email Address is invalid.";
    }

    if (!editFormData.role_id) {
      errors.role_id = "Role Name is required.";
    }

    if (editFormData.password) {
      if (!editFormData.password_confirmation) {
        errors.password_confirmation = "Confirm Password is required.";
      } else if (editFormData.password !== editFormData.password_confirmation) {
        errors.password_confirmation = "Password don't match!";
      }
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        user_name: editFormData.user_name,
        full_name: editFormData.full_name,
        email: editFormData.email,
        mobile_no: editFormData.mobile_no,
        from_date: editFormData.from_date ? format(editFormData.from_date, "yyyy-MM-dd") : null,
        to_date: editFormData.to_date ? format(editFormData.to_date, "yyyy-MM-dd") : null,
        role_id: editFormData.role_id,
        is_active: editFormData.is_active ? 1 : 0,
      }

      if (editFormData.password) {
        submitData.password = editFormData.password;
        submitData.password_confirmation = editFormData.password_confirmation;
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/user/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();

      if (response.status == 'success') {
        toast.success(response.message);
        navigate('/user/dataTable')

      } else if (response.status === 'fail' && response.errors) {
        // Laravel errors → React friendly format
         const backendErrors = {};

         Object.keys(response.errors).forEach((field) => {
            backendErrors[field] = response.errors[field][0]; // first message
          });

          setValidationErrors(backendErrors);

          // optional toast
          toast.error(response.message);
          
        } else {
          toast.error("Internal Error! Try again later.");
          console.error(response.message);
        }

    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.')
      console.error(error);
    }

  };

   //React select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: '#000',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      // padding: '1px',
      minHeight: '40px',
      // '&:hover': {
      //   borderColor: '#000'
      // }
    }),
  };

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit User</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}user/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="validationCustom01">
                    <Form.Label>User Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter user name"
                      name='user_name'
                      value={editFormData.user_name || ''}
                      isInvalid={!!showValidationError.user_name}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.user_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom012">
                    <Form.Label>Full Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter full name"
                      name='full_name'
                      value={editFormData.full_name || ''}
                      isInvalid={!!showValidationError.full_name}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.full_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationCustom03">
                    <Form.Label>Email <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter email name"
                      name='email'
                      value={editFormData.email || ''}
                      isInvalid={!!showValidationError.email}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.email}</Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>Mobile No <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="number"
                      className='border-dark'
                      placeholder="Enter Mobile number"
                      name='mobile_no'
                      value={editFormData.mobile_no || ''}
                      isInvalid={!!showValidationError.mobile_no}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.mobile_no}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Password <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      type="password"
                      className='border-dark'
                      placeholder="Enter password"
                      name='password'
                      value={editFormData.password || ''}
                      isInvalid={!!showValidationError.password}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom06">
                    <Form.Label>Confirm Password <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      type="password"
                      className='border-dark'
                      placeholder="Enter confirm password"
                      name='password_confirmation'
                      value={editFormData.password_confirmation || ''}
                      isInvalid={!!showValidationError.password_confirmation}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.password_confirmation}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationCustom08">
                    <Form.Label>From Date</Form.Label>
                    <InputGroup className="">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>

                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          selected={editFormData.from_date ? new Date(editFormData.from_date) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date) =>
                            setEditFormData({ ...editFormData, from_date: date })
                          }

                        />
                      </div>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="3" controlId="validationCustom07">

                    <Form.Label>To Date</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>

                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          // minDate={fromDate}
                          selected={editFormData.to_date ? new Date(editFormData.to_date) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date) =>
                            setEditFormData({ ...editFormData, to_date: date })
                          }

                        />
                      </div>
                    </InputGroup>
                  </Form.Group>
                </Row>


                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="validationCustom01">

                    <Form.Label>User Role <span className='text-danger ms-1'>*</span></Form.Label>

                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeRoleOptions}
                      value={activeRoleOptions.find(option => option.value === editFormData.role_id) || null}
                      onChange={selectChange}
                      isSearchable={true}
                      tabIndex={9}
                    />

                    {showValidationError.role_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.role_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="3">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.is_active == 1}
                        onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.is_active == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
                </Row>

                <div className='d-flex justify-content-end'>
                  <Button type="submit">Update</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default UserEditForm;

