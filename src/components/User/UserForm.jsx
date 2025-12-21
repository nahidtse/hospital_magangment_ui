import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Form, Button, Card, Col, InputGroup, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserForm = () => {

  const [userRoles, setUserRoles] = useState([]);

  const [showValidationError, setValidationErrors] = useState({
    user_name: '',
    full_name: '',
    email_address: '',
    mobile: '',
    from_date: '',
    to_date: '',
    role_id: '',
    password: '',
    confirm_password: '',
  });

// Get Six Months From Current Day
 const getSixMonths = (date) => {
    const sixMonthsFromNow = date;
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    sixMonthsFromNow.setDate(sixMonthsFromNow.getDate() - 1);
    return sixMonthsFromNow;
}

  const [addFormData, setFormData] = useState({
    username: '',
    fullname: '',
    emailaddress: '',
    mobile: '',
    fromdate: new Date(),
    todate: getSixMonths(new Date()),
    roleid: '',
    password: '',
    confirmpassword: '',
    isActive: 1

  })

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  // console.log(addFormData.fromdate);
 

  const onChangeHandler = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

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
    newFormData['fromdate'] = updatedFromDate;
    newFormData['todate'] = updatedToDate;

    setFormData(newFormData);
  };

  const handleToDateChange = (date) => {
    if (date > addFormData.fromdate || date > fromDate) {
      setToDate(date);

      const newFormData = { ...addFormData };
      newFormData['todate'] = date;

      setFormData(newFormData);
    } else {
      toast.error("To Date cannot be before From Date");
    }
  };


  /** Admin Roles Data Fetching */
  const userId = 7; // it will be dynamic TODO::

  useEffect(() => {
    fetch(`https://cserp.store/api/role/show/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserRoles(data.data);
      })
  }, [])
  /** Form Submit */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};


    /// Error Handling TODO:: Optimize 

    if (!addFormData.username.trim()) {
      errors.user_name = "User Name is required.";
    }
    if (!addFormData.fullname.trim()) {
      errors.full_name = "Full Name is required.";
    }
    if (!addFormData.emailaddress.trim()) {
      errors.email_address = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(addFormData.emailaddress)) {
      errors.email_address = "Email Address is invalid.";
    }
    if (!addFormData.mobile.trim()) {
      errors.mobile = "Mobile Number is required.";
    } else if (!/^\d{11}$/.test(addFormData.mobile)) {
      errors.mobile = "Mobile Number must be 11 digits.";
    }

    if (!addFormData.roleid.trim()) {
      errors.role_id = "Role Name is required.";
    }
    if (!addFormData.password.trim()) {
      errors.password = "Password is required.";
    } else if (addFormData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }
    if (!addFormData.confirmpassword.trim()) {
      errors.confirm_password = "Confirm Password is required.";
    } else if (addFormData.password != addFormData.confirmpassword) {
      errors.confirm_password = "Password don't match!";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      /** TODO: Optimize */
      const formattedFromDate = addFormData.fromdate.toISOString().split('T')[0];
      const formattedToDate = addFormData.todate.toISOString().split('T')[0];

      const submitData = {
        user_name: addFormData.username,
        full_name: addFormData.fullname,
        email_address: addFormData.emailaddress,
        mobile: addFormData.mobile,
        from_date: formattedFromDate,
        to_date: formattedToDate,
        role_id: addFormData.roleid,
        password: addFormData.password,
        is_active: addFormData.isActive ? 1 : 0,
        create_by: 1,
        updated_by: 1
      }

      const result = await fetch('https://cserp.store/api/user/create', {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();

      if (response.status == 'success') {
        toast.success(response.message);

        // Clear form
        setFormData({
          username: '',
          fullname: '',
          emailaddress: '',
          mobile: '',
          fromdate: new Date(), // where will be change TODO::
          todate: new Date(),
          roleid: '',
          password: '',
          confirmpassword: '',
          isActive: 1

        });
        setValidationErrors({})

      } else {
        if (typeof response.message === 'object') {
          setValidationErrors(response.message);
        } else {
          toast.error("Internal Error! Try again later.");
          console.error(response.message);
        }

      }

    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.')
      console.log(error);

    }

  }

  const resetHandling = () => {
    setFormData({
      username: '',
      fullname: '',
      emailaddress: '',
      mobile: '',
      fromdate: new Date(),
      todate: new Date(),
      roleid: '',
      password: '',
      confirmpassword: '',
      isActive: 1

    })
  }

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

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>User Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter user name"
                      defaultValue=""
                      name='username'
                      value={addFormData.username}
                      isInvalid={!!showValidationError.user_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.user_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom012">
                    <Form.Label>Full Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter full name"
                      defaultValue=""
                      name='fullname'
                      value={addFormData.fullname}
                      isInvalid={!!showValidationError.full_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.full_name}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom03">
                    <Form.Label>Email <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter email name"
                      defaultValue=""
                      name='emailaddress'
                      value={addFormData.emailaddress}
                      isInvalid={!!showValidationError.email_address}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.email_address}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom04">
                    <Form.Label>Mobile No <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="number"
                      className='border-dark'
                      placeholder="Enter mobile number"
                      defaultValue=""
                      name='mobile'
                      value={addFormData.mobile}
                      isInvalid={!!showValidationError.mobile}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.mobile}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom05">
                    <Form.Label>Password <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="password"
                      className='border-dark'
                      placeholder="Enter password"
                      name='password'
                      value={addFormData.password}
                      isInvalid={!!showValidationError.password}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom06">
                    <Form.Label>Confirm Password <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="password"
                      className='border-dark'
                      placeholder="Enter confirm password"
                      defaultValue=""
                      name='confirmpassword'
                      value={addFormData.confirmpassword}
                      isInvalid={!!showValidationError.confirm_password}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.confirm_password}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row className="mb-3">

                  <Form.Group as={Col} md="6" controlId="validationCustom08">
                    <Form.Label>From Date</Form.Label>
                    <InputGroup className="">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>

                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          selected={addFormData.fromdate}
                          dateFormat="dd-MM-yyyy"
                          onChange={handleFromDateChange}

                        />
                      </div>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>To Date</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>

                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          minDate={fromDate}
                          selected={addFormData.todate}
                          dateFormat="dd-MM-yyyy"
                          onChange={handleToDateChange}

                        />
                      </div>
                    </InputGroup>
                  </Form.Group>

                </Row>


                <Row className="mb-3">


                  <Form.Group as={Col} md="6" controlId="validationCustom07">
                    <Form.Label>User Role <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.role_id ? 'is-invalid' : ''}`}
                      name="roleid"
                      onChange={onChangeHandler}
                      aria-label="Select role"
                    >
                      <option value="">Select role</option>
                      {userRoles.map((role) => (
                        <option key={role.id} value={role.id}>{role.role_name}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.role_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.role_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="6">
                    <Form.Label></Form.Label>
                    <div className="form-check form-switch mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={addFormData.isActive == 1}
                        onChange={(e) => setFormData({ ...addFormData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {addFormData.isActive == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
                </Row>

                <button type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                <Button type="submit">Save</Button>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UserForm;
