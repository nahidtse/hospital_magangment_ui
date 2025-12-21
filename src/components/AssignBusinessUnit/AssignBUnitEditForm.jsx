import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const AssignBUnitEditForm = ({
  setBusinessUnitList,
  setContactsData,
  passEditFormData,
  setPassingEditFormData,
  existingAssignBUnitsData
}) => {

  const [editFormData, setEditFormData] = useState({
    userid: '',
    businessid: '',
    isDefault: '',
    isActive: '',
    updateby: '',
  })


  const [showValidationError, setValidationErrors] = useState({});

  const [usersData, setUsersData] = useState([]);
  const [businessUnitsData, setBusinessUnitsData] = useState([]);

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        userid: passEditFormData.user_id,
        userFullName: passEditFormData.user.full_name,
        businessid: passEditFormData.BU_id,
        businessUnit: passEditFormData.business_unit.business_unit,

        isDefault: passEditFormData.is_default,
        isActive: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);

  /** Users and Business Units 
    * 
    * TODO:: Optimize
   */


  useEffect(() => {
    fetch('https://cserp.store/api/user')
      .then((response) => response.json())
      .then((data) => {
        setUsersData(data.data);
      })
  }, [])

  useEffect(() => {
    fetch('https://cserp.store/api/businessunits')
      .then((response) => response.json())
      .then((data) => {
        setBusinessUnitsData(data.data);
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

    if (!editFormData.userid.trim()) {
      errors.user_id = "User Name is required.";
    } else if (editFormData.userid.trim() && editFormData.businessid.trim()) {

      const hasChanged =
        passEditFormData.user_id.trim() !== editFormData.userid.trim() ||
        passEditFormData.BU_id.trim() !== editFormData.businessid.trim();

      if (hasChanged) {
        const isDuplicate = existingAssignBUnitsData.some(data =>
          data.id !== passEditFormData.id &&
          data.user_id.trim() === editFormData.userid.trim() &&
          data.BU_id.trim() === editFormData.businessid.trim()
        );

        if (isDuplicate) {
          errors.user_id = "A user with this name already exists in the selected business unit.";
        }
      }

    }
    if (!editFormData.businessid.trim()) {
      errors.BU_id = "Business Unit is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        user_id: editFormData.userid,
        BU_id: editFormData.businessid,
        is_default: editFormData.isDefault == 1 ? 1 : 0,
        is_active: editFormData.isActive == 1 ? 1 : 0,
        updated_by: 7
      }

      const result = await fetch(`https://cserp.store/api/userbu/update/${passEditFormData.id}`, {
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
              <div className='card-title'>Edit Assign Business Unit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}assignbu/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>User <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.user_id ? 'is-invalid' : ''}`}
                      name="userid"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                    >
                      <option value={editFormData.userid}>{editFormData.userFullName}</option>
                      {usersData.map((user) => (
                        <option key={user.id} value={user.id}>{user.full_name} ({user.user_name})</option>
                      ))}

                    </Form.Select>

                    {showValidationError.user_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.user_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Business Unit <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.BU_id ? 'is-invalid' : ''}`}
                      name="businessid"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                    >
                      <option value={editFormData.businessid}>{editFormData.businessUnit}</option>
                      {businessUnitsData.map((businessUnit) => (
                        <option key={businessUnit.id} value={businessUnit.id}>{businessUnit.business_unit}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.BU_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.BU_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" >
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.isDefault == 1}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, isDefault: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        Is Default
                      </label>
                    </div>
                  </Form.Group>

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

export default AssignBUnitEditForm;