import { Fragment, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ModuleForm = () => {

  const [showValidationError, setValidationErrors] = useState({
    module_name: '',

  });

  const [addFormData, setFormData] = useState({
    modulename: '',
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

    if (!addFormData.modulename.trim()) {
      errors.module_name = "Module Name is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }



    try {

      const submitData = {
        module_name: addFormData.modulename,
        is_active: addFormData.isActive ? 1: 0,
        create_by: 7,
        updated_by: 7
      }

      const result = await fetch('https://cserp.store/api/module/create', {
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
          modulename: '',
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
      modulename: '',
      isActive: 1

    })
  }



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Module</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}module/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter module name"
                      defaultValue=""
                      name='modulename'
                      value={addFormData.modulename}
                      isInvalid={!!showValidationError.module_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.module_name}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      checked={addFormData.isActive == 1}
                      onChange={(e) => setFormData({...addFormData, isActive:e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                      {addFormData.isActive == 1 ? 'Active' : 'Inactive'}
                    </label>
                  </div>
                </Form.Group>
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

export default ModuleForm;
