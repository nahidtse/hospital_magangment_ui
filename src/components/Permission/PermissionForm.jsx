import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const PermissionForm = () => {

  //-----------Focus Input Start--------------------------------
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
    const user_id = localStorage.getItem('user_id') //for Created_by

    if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
    }
  //*********Check Authentication End***********



  const [showValidationError, setValidationErrors] = useState({
    permission_name: '',
    module_id: '',
  });

  const [addFormData, setFormData] = useState({
    permission_name: '',
    module_id: '',
    is_active: true,

  })
  // console.log(addFormData)

  const [moduleData, setModuleData] = useState([]);

  const onChangeHandler = (e) => {
    const {name, value} = e.target;

    setFormData(prev => ({
        ...prev,
        [name]:value
    }))
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.permission_name.trim()) {
      errors.permission_name = "Permission name is required.";
    } 

    if (!addFormData.module_id) {
      errors.module_id = "Module name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        permission_name: addFormData.permission_name,
        module_id: addFormData.module_id,
        is_active: addFormData.is_active ? 1 : 0,
        created_by: user_id
      }

      // console.log(submitData);
      // return;

      const result = await fetch(`${baseURL}/permission/create`, {
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

        // Clear form
        setFormData({
          permission_name: '',
          module_id: '',
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

    }

  }

  const resetHandling = () => {
    setFormData({
      permission_name: '',
      module_id: '',
      is_active: 1
    })
  }

  /**  
   * Module
   * TODO:: Optimize
  */
  //----------React Select Module Start--------
    useEffect(() => {
      fetch(`${baseURL}/module`, {
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

    const activeModuleOptions = moduleData.filter(module => module.is_active == 1).map(module => ({
    value: module.id,
    label: `${module.module_name}`
    }));

    // react-select  onChange handler
    const selectChange = (selectedOption) => {
      setFormData(prev => ({
        ...prev,
        module_id: selectedOption? selectedOption.value : null
      }))
    };
  //----------React Select Module End--------



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
                      ref={referenceSelectRef}
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter permission name"
                      name='permission_name'
                      value={addFormData.permission_name || ''}
                      isInvalid={!!showValidationError.permission_name}
                      onChange={onChangeHandler}
                      tabIndex={1}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.permission_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>

                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={activeModuleOptions || ''}
                      value={activeModuleOptions.find(option => option.value === addFormData.module_id) || null}
                      onChange={selectChange}
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={2}
                    />

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
                        checked={addFormData.is_active}
                        onChange={(e) => setFormData({ ...addFormData, is_active: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {addFormData.is_active == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Col className="text-end">
                    <button tabIndex={-1} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                    <Button tabIndex={3} type="submit">Save</Button>
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

export default PermissionForm;
