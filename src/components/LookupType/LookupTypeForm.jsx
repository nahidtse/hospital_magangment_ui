// import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
const basURL = import.meta.env.VITE_API_BASE_URL;


const LookupTypeForm = () => {

  const location = useLocation();
  const existingPermissionData = location.state?.lookupTypes || [];
  // console.log(existingPermissionData);

  const [showValidationError, setValidationErrors] = useState({
    lookuptype_name: '',
    lookupcode_name: '',
  });

  const [addFormData, setFormData] = useState({
    lookuptypename: '',
    lookupcodename: '',
    isActive: 1,

  })

  // const [moduleData, setModuleData] = useState([]);
  // console.log(moduleData)

  const onChangeHandler = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    
  // console.log(newFormData)
    setFormData(newFormData);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    
    if (!addFormData.lookuptypename.trim()) {
      errors.lookuptype_name = "Lookup type name is required.";
    } else {
      const isDuplicateType = existingPermissionData.some(
        data => data.lookup_type.trim().toLowerCase() === addFormData.lookuptypename.trim().toLowerCase()
      );
      if (isDuplicateType) {
        errors.lookuptype_name = "Duplicate lookup type name not allowed.";
      }
    }

    if (!addFormData.lookupcodename.trim()) {
      errors.lookupcode_name = "Lookup code name is required.";
    } else {
      const isDuplicateCode = existingPermissionData.some(
        data => data.lookup_code.trim().toLowerCase() === addFormData.lookupcodename.trim().toLowerCase()
      );
      if (isDuplicateCode) {
        errors.lookupcode_name = "Duplicate lookup code name not allowed.";
      }
}
    
    if (!addFormData.lookupcodename.trim()) {
      errors.lookupcode_name = "Module name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        lookup_type: addFormData.lookuptypename,
        lookup_code: addFormData.lookupcodename,
        is_active: addFormData.isActive,
        // create_by: 7     // TODO:: Id will be  dynamic
      }

      // console.log(submitData);
      // return;

      const result = await fetch(`${basURL}/lookuptype/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();

      // console.log(response)

      if (response.status == 'success') {
        toast.success(response.message);

        // Clear form
        setFormData({
          lookuptypename: '',
          lookupcodename: '',
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
      lookuptypename: '',
      lookupcodename: '',
      isActive: 1
    })
  }

  /**  
   * Module
   * TODO:: Optimize
  */
  // useEffect(() => {
  //   fetch('http://127.0.0.1:8000/api/lookuptype')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setModuleData(data);
  //     })
  // }, [])



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Lookup Type</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}lookuptype/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Lookup Type <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Type name"
                      name='lookuptypename'
                      value={addFormData.lookuptypename}
                      isInvalid={!!showValidationError.lookuptype_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.lookuptype_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Lookup Code <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Code name"
                      name='lookupcodename'
                      value={addFormData.lookupcodename}
                      isInvalid={!!showValidationError.lookupcode_name}
                      onChange={onChangeHandler}

                    />

                    <Form.Control.Feedback type='invalid'>{showValidationError.lookupcode_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" className='mt-4'>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={addFormData.isActive == 1}
                        onChange={(e) => setFormData({ ...addFormData, isActive: e.target.checked ? 1 : 0 })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {addFormData.isActive == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
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

export default LookupTypeForm;
