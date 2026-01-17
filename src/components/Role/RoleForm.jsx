import { isAction } from '@reduxjs/toolkit';
import { Fragment, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const RoleForm = () => {

  const navigate = useNavigate();

  //*********Check Authentication Start***********
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry');  // token expire check
  const user_id = localStorage.getItem('user_id')  // for created_by

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********


  const [showValidationError, setValidationErrors] = useState({
    module_name: '',
  });

  const [addFormData, setFormData] = useState({
    rolename: '',
    isActive: 1

  })

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

    if (!addFormData.rolename.trim()) {
      errors.role_name = "Role Name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        role_name: addFormData.rolename,
        is_active: addFormData.isActive ? 1:0, 
        created_by: user_id,
      }

      // console.log(submitData)
      // return


      const result = await fetch(`${baseURL}/role/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();

      if (response.status == 'success') {
       toast.success(response.message, {autoClose: 1000});

       navigate("/role/dataTable")
        // Clear form
        setFormData({
          rolename: '',
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
      rolename: '',
      isActive: 1

    })
  }

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Role</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}role/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Role Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter role name"
                      defaultValue=""
                      name='rolename'
                      value={addFormData.rolename}
                      isInvalid={!!showValidationError.role_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.role_name}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
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
                    <Button type="submit">Save</Button>
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

export default RoleForm;
