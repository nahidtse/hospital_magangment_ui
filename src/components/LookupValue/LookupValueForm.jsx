import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
const basURL = import.meta.env.VITE_API_BASE_URL;

const LookupValueForm = () => {

  const location = useLocation();
  // console.log(location)
  const existingLookupValuData = location.state?.contacts || [];
  // console.log(existingLookupValuData);

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
    lookupvalue_name: '',
    lookupcode_id: '',
  });

  const [addFormData, setFormData] = useState({
    lookupvaluename: '',
    lookupTypeId: '',
    lookupCode: '',
    isActive: 1

  })

  console.log(addFormData)
  const [moduleData, setModuleData] = useState([]);

  console.log(moduleData)

  const onChangeHandler = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    if (fieldName === "lookupTypeId") {

    const selectedModule = moduleData.find(mod => mod.id == fieldValue);
      setFormData(prev => ({
        ...prev,
        lookupTypeId: selectedModule?.id || '',
        lookupCode: selectedModule?.lookup_code || ''
      }));
    } else {
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }));
    }
  }
//  console.log(addFormData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.lookupvaluename.trim()) {
      errors.lookupvalue_name = "Lookup Value name is required.";
    } else if (addFormData.lookupTypeId) {
      const isDuplicate = existingLookupValuData.some(data =>
        (data.lookup_value == addFormData.lookupvaluename && data.lookup_code == addFormData.lookupCode)
      );

      if (isDuplicate) {
        errors.lookupvalue_name = "Duplicate Lookup Value name for this module.";
      }


    }
    // if (!addFormData.lookupValue.trim()) {
    //   errors.lookupcode_id = "Lookup Code name is required.";
    // }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        lookup_value: addFormData.lookupvaluename,
        doc_lookup_type_id: addFormData.lookupTypeId,
        lookup_code: addFormData.lookupCode,
        is_active: addFormData.isActive ? 1 : 0,
        // create_by: 7      // TODO:: Id will be  dynamic
      }

      console.log(submitData);
      // return;

      const result = await fetch(`${basURL}/lookupvalue/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();

      if (response.status == 'success') {
        toast.success(response.message);

        // Clear form
        setFormData({
          lookupvaluename: '',
          lookupTypeId: "",
          lookupCode: '',
          isActive: 1,
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
      lookupvaluename: '',
      lookupValue: '',
      isActive: 1
    })
  }

  /**  
   * Module
   * TODO:: Optimize
  */
  useEffect(() => {
    
    fetch(`${basURL}/lookuptype`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
      }
    })
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
              <div className='card-title'>New Lookup Value</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}lookupvalue/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Lookup Value Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Value name"
                      name='lookupvaluename'
                      value={addFormData.lookupvaluename}
                      isInvalid={!!showValidationError.lookupvalue_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.lookupvalue_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Lookup Code Name <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.lookupcode_id ? 'is-invalid' : ''}`}
                      name="lookupTypeId"
                      value={addFormData.lookupTypeId}
                      onChange={onChangeHandler}
                      aria-label="Select role"
                    >
                      <option value="">Select Module</option>
                      {moduleData.length > 0 ? moduleData.map((module) => (
                        <option key={module.id} value={module.id}>{module.lookup_type}  ({module.lookup_code})</option>
                      )) : []}

                    </Form.Select>

                    {showValidationError.lookupcode_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.lookupcode_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="4" className='mt-4'>
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
                <Row className='mb-3'>
                  
                </Row>
                <div className='d-flex justify-content-end'>
                  <button type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                  <Button type="submit">Save</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default LookupValueForm;
