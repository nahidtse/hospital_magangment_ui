import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ModuleEditForm = ({ setBusinessUnitList, setContactsData, passEditFormData, setPassingEditFormData }) => {


  const [editFormData, setEditFormData] = useState({
    modulename: '',
    isActive: ''
  })

  const [showValidationError, setValidationErrors] = useState({});

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        modulename: passEditFormData.module_name,

        isActive: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);



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

    if (!editFormData.modulename.trim()) {
      errors.module_name = "Module Name is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        module_name: editFormData.modulename,
        is_active: editFormData.isActive ? 1 : 0
      }


      const result = await fetch(`https://cserp.store/api/module/update/${passEditFormData.id}`, {
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
            contact.id === response.data.id ? response.data : contact
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
      modulename: '',
    })

  }


  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Module</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}module/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      id="modulename"
                      placeholder="Enter module name"
                      name='modulename'
                      value={editFormData.modulename}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.module_name}

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
                      checked={editFormData.isActive == 1}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, isActive: e.target.checked })
                      }
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                      {editFormData.isActive == 1 ? 'Active' : 'Inactive'}
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

export default ModuleEditForm;