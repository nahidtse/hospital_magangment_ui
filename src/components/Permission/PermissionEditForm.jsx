import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const PermissionEditForm = ({
  setBusinessUnitList,
  setContactsData,
  passEditFormData,
  setPassingEditFormData,
  existingPermissionsData
}) => {

  console.log(passEditFormData);

  const [editFormData, setEditFormData] = useState({
    permissionname: '',
    moduleid: '',
    isActive: '',
    createby: '',
  })
  const [isHidden, setIsHidden] = useState([false]);

  const [moduleData, setModuleData] = useState([]);

  const [showValidationError, setValidationErrors] = useState({});

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        moduleid: passEditFormData.module_id,
        modulename: passEditFormData.module.module_name,
        permissionname: passEditFormData.permission_name,
        isActive: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);

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

    if (!editFormData.permissionname.trim()) {
      errors.permission_name = "Permission name is required.";
    } else if (editFormData.permissionname.trim() && editFormData.moduleid.trim()) {
      const hasChanged =
        passEditFormData.permission_name.trim() !== editFormData.permissionname.trim() ||
        passEditFormData.module_id.trim() !== editFormData.moduleid.trim();

      if (hasChanged) {
        const isDuplicate = existingPermissionsData.some(data =>
          data.id !== passEditFormData.id && 
          data.permission_name.trim() === editFormData.permissionname.trim() &&
          data.module_id.trim() === editFormData.moduleid.trim()
        );

        if (isDuplicate) {
          errors.permission_name = "A permission with this name already exists in the selected module.";
        }
      }
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        permission_name: editFormData.permissionname,
        module_id: editFormData.moduleid,
        is_active: editFormData.isActive == 1 ? 1 : 0,
        updated_by: 7
      }

      console.log(submitData);

      const result = await fetch(`https://cserp.store/api/permission/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);

        setContactsData((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === response.data.id ? { ...contact, ...response.data } : contact
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
      userid: '',
      businessid: '',
      createby: '',
    })

  }

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Permission</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}permission/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
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
                      value={editFormData.permissionname}
                      isInvalid={!!showValidationError.permission_name}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.permission_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Module Name <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.module_id ? 'is-invalid' : ''}`}
                      name="moduleid"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                    >
                      <option value={editFormData.moduleid}>{editFormData.modulename}</option>
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
                <Row className="mb-3">
                  <Form.Group as={Col} md="6">
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
                </Row>

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

export default PermissionEditForm;