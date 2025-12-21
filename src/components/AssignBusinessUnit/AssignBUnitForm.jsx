import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const AssignBUnitForm = () => {

  const [showValidationError, setValidationErrors] = useState({
    user_id: '',
    BU_id: '',
  });

  const [addFormData, setFormData] = useState({
    userid: '',
    businessid: '',
    isDefault: 1,
    isActive: 1,
    createby: 1,

  })

  const [usersData, setUsersData] = useState([]);
  const [businessUnitsData, setBusinessUnitsData] = useState([]);

  const location = useLocation();
  const existingAssignBUnitsData = location.state?.contacts || [];
  // console.log(existingAssignBUnitsData)

  const onChangeHandler = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.userid.trim()) {
      errors.user_id = "User Name is required.";
    } else if (addFormData.userid.trim() && addFormData.businessid.trim()) {
      const isDuplicate = existingAssignBUnitsData.some(data =>
        (data.user_id == addFormData.userid && data.BU_id == addFormData.businessid)
      );

      if (isDuplicate) {
        errors.user_id = "Duplicate permission name for this module.";
      }


    }
    if (!addFormData.businessid.trim()) {
      errors.BU_id = "Business Unit is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        user_id: addFormData.userid,
        BU_id: addFormData.businessid,
        is_default: addFormData.isDefault ? 1 : 0,
        is_active: addFormData.isActive ? 1 : 0,
        create_by: 7 // TODO:: Id will be  dynamic
      }

      // console.log(submitData);
      // return;

      const result = await fetch('https://cserp.store/api/userbu/create', {
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
          userid: '',
          businessid: '',
          isDefault: 1,
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
      userid: '',
      businessid: '',
      isDefault: 1,
      isActive: 1

    })
  }

  /** Users and Business Units 
   * 
   * TODO:: Optimize
  */


  useEffect(() => {
    fetch('https://cserp.store/api/user')
      .then((response) => response.json())
      .then((data) => {
        setUsersData(data.data);
      })
  }, [])

  useEffect(() => {
    fetch('https://cserp.store/api/businessunits')
      .then((response) => response.json())
      .then((data) => {
        setBusinessUnitsData(data.data);
      })
  }, [])



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Assign New Business Unit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}assignbu/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>User <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.user_id ? 'is-invalid' : ''}`}
                      name="userid"
                      onChange={onChangeHandler}
                      aria-label="Select role"
                    >
                      <option value="">Select User</option>
                      {usersData.map((user) => (
                        <option key={user.id} value={user.id}>{user.full_name} ({user.user_name})</option>
                      ))}

                    </Form.Select>

                    {showValidationError.user_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.user_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Business Unit <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.BU_id ? 'is-invalid' : ''}`}
                      name="businessid"
                      onChange={onChangeHandler}
                      aria-label="Select role"
                    >
                      <option value="">Select Business Unit</option>
                      {businessUnitsData.map((businessUnit) => (
                        <option key={businessUnit.id} value={businessUnit.id}>{businessUnit.business_unit}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.BU_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.BU_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Row>
                <Row className='mb-3'>
                  <Form.Group as={Col} md="6">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={addFormData.isDefault == 1}
                        onChange={(e) => setFormData({ ...addFormData, isDefault: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        is Default
                      </label>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <div className="form-check form-switch">
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

export default AssignBUnitForm;
