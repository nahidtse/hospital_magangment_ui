import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const PermissionForm = () => {

  const location = useLocation();
  const existingPermissionData = location.state?.contacts || [];
  // console.log(existingPermissionData);

  const [showValidationError, setValidationErrors] = useState({
    permission_name: '',
    module_id: '',
  });

  const [addFormData, setFormData] = useState({
    permissionname: '',
    moduleid: '',
    isActive: 1,
    createby: 1,

  })

  const [moduleData, setModuleData] = useState([]);

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

    if (!addFormData.permissionname.trim()) {
      errors.permission_name = "Permission name is required.";
    } else if (addFormData.permissionname.trim() && addFormData.moduleid.trim()) {
      const isDuplicate = existingPermissionData.some(data =>
        (data.permission_name == addFormData.permissionname && data.module_id == addFormData.moduleid)
      );

      if (isDuplicate) {
        errors.permission_name = "Duplicate permission name for this module.";
      }


    }
    if (!addFormData.moduleid.trim()) {
      errors.module_id = "Module name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        permission_name: addFormData.permissionname,
        module_id: addFormData.moduleid,
        is_active: addFormData.isActive ? 1 : 0,
        create_by: 7 // TODO:: Id will be  dynamic
      }

      // console.log(submitData);
      // return;

      const result = await fetch('https://cserp.store/api/permission/create', {
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
          permissionname: '',
          moduleid: '',
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
      permissionname: '',
      moduleid: '',
      isActive: 1
    })
  }

  /**  
   * Module
   * TODO:: Optimize
  */
  useEffect(() => {
    fetch('https://cserp.store/api/module')
      .then((response) => response.json())
      .then((data) => {
        setModuleData(data.data);
      })
  }, [])



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Permission</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}permission/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Permission Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter permission name"
                      defaultValue=""
                      name='permissionname'
                      value={addFormData.permissionname}
                      isInvalid={!!showValidationError.permission_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.permission_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.module_id ? 'is-invalid' : ''}`}
                      name="moduleid"
                      onChange={onChangeHandler}
                      aria-label="Select role"
                    >
                      <option value="">Select Module</option>
                      {moduleData.map((module) => (
                        <option key={module.id} value={module.id}>{module.module_name}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.module_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.module_id}
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

export default PermissionForm;
