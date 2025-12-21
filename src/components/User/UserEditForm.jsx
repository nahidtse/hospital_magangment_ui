import { Fragment, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const RoleEditForm = ({ setBusinessUnitList, setContactsData, passEditFormData, setPassingEditFormData }) => {

  // console.log(passEditFormData);
  const [userRoles, setUserRoles] = useState([]);

  // Get Six Months From Current Day
  const getSixMonths = (date) => {
    const sixMonthsFromNow = date;
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    sixMonthsFromNow.setDate(sixMonthsFromNow.getDate() - 1);
    return sixMonthsFromNow;
  }

  const [editFormData, setEditFormData] = useState({
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
  const [isHidden, setIsHidden] = useState([false]);


  const [showValidationError, setValidationErrors] = useState({});



  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(getSixMonths(new Date(fromDate)));

  /** Date Formate Change */
  const dateFormateChange = (date) => {
      return date.toISOString().split('T')[0];
  }


  /** From Date and To Date Handling Area */
  const handleFromDateChange = (date) => {

    const updatedFromDate = date;

    const updatedToDate = getSixMonths(new Date(updatedFromDate));

    const formattedFromDate = dateFormateChange(updatedFromDate);
    const formattedToDate = dateFormateChange(updatedToDate);
    // console.log(formattedFromDate+'/'+formattedToDate)

    // Update states
    setFromDate(formattedFromDate);
    setToDate(formattedToDate);

    // Update form data using updated values (not outdated state)
    const newFormData = { ...editFormData };
    newFormData['fromdate'] = formattedFromDate;
    newFormData['todate'] = formattedToDate;

    setEditFormData(newFormData);
  };

  const handleToDateChange = (date) => {

    const formattedFromDate = dateFormateChange(new Date(fromDate));
    const formattedToDate = dateFormateChange(date);
    // console.log(formattedFromDate+'/'+formattedToDate)

    if (formattedFromDate < formattedToDate) {

      setToDate(formattedToDate);

      const newFormData = { ...editFormData };
      newFormData['todate'] = formattedToDate;

      setEditFormData(newFormData);

    } else {
      toast.error("To Date cannot be before From Date");
    }
  };

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        username: passEditFormData.user_name,
        fullname: passEditFormData.full_name,
        emailaddress: passEditFormData.email_address,
        mobile: passEditFormData.mobile,
        password: passEditFormData.password,
        confirmpassword: passEditFormData.password,
        fromdate: passEditFormData.from_date,
        todate: passEditFormData.to_date,
        roleid: passEditFormData.role_id,
        rolename: passEditFormData.role.role_name,
        isActive: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);


  /** Admin Roles Data Fetching */
  const userId = 7; // it will be dynamic TODO::

  useEffect(() => {
    fetch(`https://cserp.store/api/role/show/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserRoles(data.data);
      })
  }, [])

  /** Reset Preview States */
  const goToModuleList = () => {
    setBusinessUnitList(false);
    setPassingEditFormData(null);

  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.username.trim()) {
      errors.user_name = "User Name is required.";
    }
    if (!editFormData.fullname.trim()) {
      errors.full_name = "Full Name is required.";
    }
    if (!editFormData.emailaddress.trim()) {
      errors.email_address = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(editFormData.emailaddress)) {
      errors.email_address = "Email Address is invalid.";
    }
    if (!editFormData.mobile.trim()) {
      errors.mobile = "Mobile Number is required.";
    } else if (!/^\d{11}$/.test(editFormData.mobile)) {
      errors.mobile = "Mobile Number must be 11 digits.";
    }

    if (!editFormData.roleid.trim()) {
      errors.role_id = "Role Name is required.";
    }
    if (!editFormData.password.trim()) {
      errors.password = "Role Name is required.";
    }
    if (!editFormData.confirmpassword.trim()) {
      errors.confirm_password = "Confirm Password is required.";
    } else if (editFormData.password != editFormData.confirmpassword) {
      errors.confirm_password = "Password don't match!";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        user_name: editFormData.username,
        full_name: editFormData.fullname,
        email_address: editFormData.emailaddress,
        mobile: editFormData.mobile,
        from_date: editFormData.fromdate,
        to_date: editFormData.todate,
        role_id: editFormData.roleid,
        password: editFormData.password,
        is_active: editFormData.isActive ? 1 : 0,
        create_by: 1,
        updated_by: 1

      }

      const result = await fetch(`https://cserp.store/api/user/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      if (response.status == 'success') {
        toast.success(response.message);

        setContactsData((prevContacts) =>
          prevContacts.map((contact) =>
             contact.id === response.data.id ? { ...contact, ...response.data } : contact
          )
        );

        setBusinessUnitList(false);
        setPassingEditFormData(null);

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
      console.error(error);
    }

  };

  const resetHandling = () => {
    setEditFormData({
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
              <div className='card-title'>Edit User</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}user/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
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
                      value={editFormData.username}
                      isInvalid={!!showValidationError.user_name}
                      onChange={handleEditFormChange}

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
                      value={editFormData.fullname}
                      isInvalid={!!showValidationError.full_name}
                      onChange={handleEditFormChange}

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
                      value={editFormData.emailaddress}
                      isInvalid={!!showValidationError.email_address}
                      onChange={handleEditFormChange}

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
                      value={editFormData.mobile}
                      isInvalid={!!showValidationError.mobile}
                      onChange={handleEditFormChange}

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
                      defaultValue=""
                      name='password'
                      value={editFormData.password}
                      isInvalid={!!showValidationError.password}
                      onChange={handleEditFormChange}

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
                      value={editFormData.confirmpassword}
                      isInvalid={!!showValidationError.confirm_password}
                      onChange={handleEditFormChange}

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
                          selected={editFormData.fromdate ? new Date(editFormData.fromdate) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={handleFromDateChange}

                        />
                      </div>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom07">

                    <Form.Label>To Date</Form.Label>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="basic-addon1" className="text-muted">
                        <i className="ri-calendar-line"></i>
                      </InputGroup.Text>

                      <div className="form-control border-dark">
                        <DatePicker
                          className='border-0'
                          minDate={fromDate}
                          selected={editFormData.todate ? new Date(editFormData.todate) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={handleToDateChange}

                        />
                      </div>
                    </InputGroup>
                  </Form.Group>

                </Row>


                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">

                    <Form.Label>User Role <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.role_id ? 'is-invalid' : ''}`}
                      name="roleid"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                    >
                      <option value={editFormData.roleid}>{editFormData.rolename}</option>
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
                        checked={editFormData.isActive == 1}
                        onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.isActive == 1 ? 'Active' : 'Inactive'}
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
    </Fragment >
  );
};

export default RoleEditForm;

