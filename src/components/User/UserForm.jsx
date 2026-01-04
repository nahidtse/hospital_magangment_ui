import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Form, Button, Card, Col, InputGroup, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const UserForm = () => {

  //-----------Focus Input Start-----------------------------------
    const referenceSelectRef = useRef(null);  //For auto fucus
    // Component mount then focus 
    useEffect(() => {
      // small timeout for render then focus
      const timer = setTimeout(() => {
        if (referenceSelectRef.current) {
          referenceSelectRef.current.focus();
          
          // Focus Style Add
          // referenceSelectRef.current.classList.add('form-select-focused');
        }
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  //-----------Focus Input End-----------------------------------  

  //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  //*********Check Authentication End***********


  const [showValidationError, setValidationErrors] = useState({
    user_name: '',
    full_name: '',
    email: '',
    mobile_no: '',
    from_date: '',
    to_date: '',
    role_id: '',
    password: '',
    password_confirmation: '',
  });

  // Get Six Months From Current Day
  const getSixMonths = (date) => {
    const sixMonthsFromNow = date;
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    sixMonthsFromNow.setDate(sixMonthsFromNow.getDate() - 1);
    return sixMonthsFromNow;
  }

  const [addFormData, setFormData] = useState({
    user_name: '',
    full_name: '',
    email: '',
    mobile_no: '',
    from_date: new Date(),
    to_date: getSixMonths(new Date()),
    role_id: '',
    password: '',
    password_confirmation: '',
    is_active: true
  })

  // console.log(addFormData)

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [userRoles, setUserRoles] = useState([]); //For Select
  //Calender Open
  const [isOpenFormDate, setIsOpenFormDate] = useState(false);
  const [isOpenToDate, setIsOpenToDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For Duble submit Problem

  // console.log(addFormData.from_date);


  const onChangeHandler = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    if (fieldName === "mobile_no" && fieldValue.length > 11) return;

    setFormData(newFormData);
  }

  /** From Date and To Date Handling Area */

  const handleFromDateChange = (date) => {

    const updatedFromDate = date;

    const updatedToDate = getSixMonths(new Date(updatedFromDate));

    // Update states
    setFromDate(updatedFromDate);
    setToDate(updatedToDate);

    // Update form data using updated values (not outdated state)
    const newFormData = { ...addFormData };
    newFormData['from_date'] = updatedFromDate;
    newFormData['to_date'] = updatedToDate;

    setFormData(newFormData);
  };

  const handleToDateChange = (date) => {
    if (date > addFormData.from_date || date > fromDate) {
      setToDate(date);

      const newFormData = { ...addFormData };
      newFormData['to_date'] = date;

      setFormData(newFormData);
    } else {
      toast.error("To Date cannot be before From Date");
    }
  };


  /** Form Submit */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return; // prevent double submit
      setIsSubmitting(true)

    const errors = {};
    /// Error Handling TODO:: Optimize 

    if (!addFormData.user_name.trim()) {
      errors.user_name = "User Name is required.";
    }
    if (!addFormData.full_name.trim()) {
      errors.full_name = "Full Name is required.";
    }
    if (!addFormData.email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(addFormData.email)) {
      errors.email = "Email Address is invalid.";
    }
    if (!addFormData.mobile_no.trim()) {
      errors.mobile_no = "Mobile Number is required.";
    } else if (!/^\d{11}$/.test(addFormData.mobile_no)) {
      errors.mobile_no = "Mobile Number must be 11 digits.";
    }

    if (!addFormData.role_id) {
      errors.role_id = "Role Name is required.";
    }
    if (!addFormData.password.trim()) {
      errors.password = "Password is required.";
    } else if (addFormData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }
    if (!addFormData.password_confirmation.trim()) {
      errors.password_confirmation = "Confirm Password is required.";
    } else if (addFormData.password != addFormData.password_confirmation) {
      errors.password_confirmation = "Password don't match!";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    try {

      /** TODO: Optimize */
      const formattedFromDate = addFormData.from_date.toISOString().split('T')[0];
      const formattedToDate = addFormData.to_date.toISOString().split('T')[0];

      const submitData = {
        user_name: addFormData.user_name,
        full_name: addFormData.full_name,
        email: addFormData.email,
        mobile_no: addFormData.mobile_no,
        from_date: formattedFromDate,
        to_date: formattedToDate,
        role_id: addFormData.role_id,
        password: addFormData.password,
        password_confirmation: addFormData.password_confirmation,
        is_active: addFormData.is_active ? 1 : 0,
      }

      // console.log(submitData)
      // return

      const result = await fetch(`${baseURL}/user/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      console.log(response)

      if (response.status == 'success') {
        toast.success(response.message, { autoClose: 1000 });
        setIsSubmitting(false);

        // Clear form
        setFormData({
          user_name: '',
          full_name: '',
          email: '',
          mobile_no: '',
          from_date: new Date(), // where will be change TODO::
          to_date: getSixMonths(new Date()),
          role_id: '',
          password: '',
          password_confirmation: '',
          is_active: 1

        });
        setValidationErrors({})

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
      console.log(error);

    } finally {
      setIsSubmitting(false); // ✅ ALWAYS reset
    }

  }

  const resetHandling = () => {
    setFormData({
      user_name: '',
      full_name: '',
      email: '',
      mobile_no: '',
      from_date: new Date(),
      to_date: getSixMonths(new Date()),
      role_id: '',
      password: '',
      password_confirmation: '',
      is_active: 1

    })
  }


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
        setFormData(prev => ({
          ...prev,
          role_id: selectedOption? selectedOption.value : null
        }))
      };
   //----------React Select User End--------



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
              <div className='card-title'>New User</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}user/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form
               noValidate 
               onSubmit={handleSubmit}
               onKeyDown={(e) => {
                  const activeEl = document.activeElement; // active element define
                  if (e.key === "Enter" && e.target.tagName !== 'TEXTAREA') {
                    if (activeEl && activeEl.type === "submit") {
                      return; 
                    } else {
                      e.preventDefault();
                    }
                  }
               }}
              >

                <Row className="mb-2">
                  <Form.Group as={Col} md="3" controlId="validationCustom01">
                    <Form.Label>User Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      ref={referenceSelectRef}
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter user name"
                      name='user_name'
                      value={addFormData.user_name || ''}
                      isInvalid={!!showValidationError.user_name}
                      onChange={onChangeHandler}
                      tabIndex={1}
                      autoFocus

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
                      value={addFormData.full_name || ''}
                      isInvalid={!!showValidationError.full_name}
                      onChange={onChangeHandler}
                      tabIndex={2}
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
                      value={addFormData.email || ''}
                      isInvalid={!!showValidationError.email}
                      onChange={onChangeHandler}
                      tabIndex={3}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>Mobile No <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="number"
                      className='border-dark'
                      placeholder="Enter mobile_no number"
                      name='mobile_no'
                      value={addFormData.mobile_no || ''}
                      isInvalid={!!showValidationError.mobile_no}
                      onChange={onChangeHandler}
                      tabIndex={4}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.mobile_no}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-2'>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Password <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="password"
                      className='border-dark'
                      placeholder="Enter password"
                      name='password'
                      value={addFormData.password || ''}
                      isInvalid={!!showValidationError.password}
                      onChange={onChangeHandler}
                      autoComplete="new-password"
                      tabIndex={5}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.password}</Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group as={Col} md="3" controlId="validationCustom06">
                    <Form.Label>Confirm Password <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="password"
                      className='border-dark'
                      placeholder="Enter confirm password"
                      name='password_confirmation'
                      value={addFormData.password_confirmation || ''}
                      isInvalid={!!showValidationError.password_confirmation}
                      onChange={onChangeHandler}
                      autoComplete="new-password"
                      tabIndex={6}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.password_confirmation}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationCustom08">
                    <Form.Label>From Date</Form.Label>
                    <InputGroup className="">
                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          selected={addFormData.from_date || null}
                          dateFormat="dd-MM-yyyy"
                          onChange={handleFromDateChange}
                          open={isOpenFormDate}
                          minDate={new Date()}
                          onClickOutside={() => setIsOpenFormDate(false)}
                          tabIndex={7}
                        />
                      </div>
                      <InputGroup.Text id="basic-addon1" className="text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIsOpenFormDate(true)}
                      >
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationCustom01">
                    <Form.Label>To Date</Form.Label>
                    <InputGroup>
                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          minDate={fromDate}
                          selected={addFormData.to_date || null}
                          dateFormat="dd-MM-yyyy"
                          onChange={handleToDateChange}
                          open={isOpenToDate}
                          onClickOutside={() => setIsOpenToDate(false)}
                          tabIndex={8}
                        />
                      </div>
                      <InputGroup.Text id="basic-addon1" className="text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIsOpenToDate(true)}
                      >
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Row>

                <Row>
                 <Form.Group as={Col} md="3" controlId="validationCustom02">
                    <Form.Label>User Role<span className='text-danger'> *</span> </Form.Label>

                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeRoleOptions}
                      value={activeRoleOptions.find(option => option.value === addFormData.role_id) || null}
                      onChange={selectChange}
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={9}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.role_id}</Form.Control.Feedback>
                  </Form.Group> 
                  
                  <Form.Group as={Col} md="3">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={addFormData.is_active}
                        onChange={(e) => setFormData({ ...addFormData, is_active: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {addFormData.is_active ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <button
                      type="reset"
                      id="resetBtn"
                      className="btn btn-outline-secondary me-2"
                      onClick={resetHandling}
                    >
                      Reset
                    </button>
                    <Button tabIndex={10} type='submit' disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                  </Col>
                </Row>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UserForm;
