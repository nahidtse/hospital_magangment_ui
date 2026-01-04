import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const PermissionEditForm = () => {

  const location = useLocation();
  const passEditFormData = location.state?.editData || '';
  const navigate = useNavigate();


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
    permission_name: '',
    module_id: '',
    is_active: '',
  })
  // console.log(editFormData)

  const [moduleData, setModuleData] = useState([]);

  const [showValidationError, setValidationErrors] = useState({});

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        module_id: passEditFormData.module_id,
        permission_name: passEditFormData.permission_name,
        is_active: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);



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
      setEditFormData(prev => ({
        ...prev,
        module_id: selectedOption? selectedOption.value : null
      }))
    };
  //----------React Select Module End--------

  

  const handleEditFormChange = (e) => {
    const {name, value} = e.target;

    setEditFormData(prev => ({
        ...prev,
        [name]:value
    }))
  }



  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.permission_name.trim()) {
      errors.permission_name = "Permission name is required.";
    }
    if (!editFormData.module_id) {
      errors.module_id = "Module name is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        permission_name: editFormData.permission_name,
        module_id: editFormData.module_id,
        is_active: Number(editFormData.is_active)? 1 : 0
      }

      // console.log(submitData);

      const result = await fetch(`${baseURL}/permission/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      console.log(response);
      if (response.status == 'success') {
       toast.success(response.message, {autoClose: 1000});
        navigate('/permission/dataTable')

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
              <div className='card-title'>Edit Permission</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}permission/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Permission Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter permission name"
                      name='permission_name'
                      value={editFormData.permission_name || ''}
                      isInvalid={!!showValidationError.permission_name}
                      onChange={handleEditFormChange}

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
                      value={activeModuleOptions.find(option => option.value === editFormData.module_id) || null}
                      onChange={selectChange}
                      isSearchable={true}
                      tabIndex={2}
                    />

                    {showValidationError.module_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.module_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.is_active == 1}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, is_active: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.is_active == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Col className="text-end">
                    <Button type="submit">Update</Button>
                  </Col>
                </Row>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default PermissionEditForm;



