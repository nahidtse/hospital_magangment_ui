import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const ModuleEditForm = () => {

  const navigate = useNavigate(); // For Route Change

  const location = useLocation(); //State Pass Data
  const singleModule = location.state?.editData || [];

  //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check
    const user_id = localStorage.getItem('user_id') //for updated_by

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
  //*********Check Authentication End***********



  const [editFormData, setEditFormData] = useState({
    module_name: '',
    is_active: ''
  })

  const [showValidationError, setValidationErrors] = useState({});

  useEffect(() => {
    if (singleModule) {
      setEditFormData({
        module_name: singleModule.module_name,
        is_active: singleModule.is_active
      });
    }
  }, [singleModule]);


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

    if (!editFormData.module_name.trim()) {
      errors.module_name = "Module Name is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        module_name: editFormData.module_name,
        is_active: Number(editFormData.is_active) ? 1 : 0,
        updated_by: user_id
      }


      const result = await fetch(`${baseURL}/module/update/${singleModule.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      
      if (response.status == 'success') {
        toast.success(response.message, { autoClose: 1000 });

     
        navigate("/menu/dataTable");

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




  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Module</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}module/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      id="module_name"
                      placeholder="Enter module name"
                      name='module_name'
                      value={editFormData.module_name || ''}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.module_name}
                      tabIndex={1}
                      autoFocus

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.module_name}</Form.Control.Feedback>
                  </Form.Group>


                  <Form.Group as={Col} md="6" className="mt-4">
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

export default ModuleEditForm;