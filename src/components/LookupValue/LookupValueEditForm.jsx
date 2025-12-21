import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LookupValueEditForm = ({
  setBusinessUnitList,
  setContactsData,
  passEditFormData,
  setPassingEditFormData,
  existingPermissionsData,
  fetchItems
}) => {
 console.log(passEditFormData)

  const [editFormData, setEditFormData] = useState({
    lookupvaluename: '',
    lookupTypeId: '',
    lookupCode: '',
    isActive: 1,
  });

  console.log(editFormData)
  const [moduleData, setModuleData] = useState([]);
  const [showValidationError, setValidationErrors] = useState({});

  console.log(moduleData)
  /***
   * Load selected edit data initially
   */
  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        lookupvaluename: passEditFormData.lookup_value || '',
        lookupTypeId: passEditFormData.doc_lookup_type_id || '',
        lookupCode: passEditFormData.lookup_code || '',
        isActive: passEditFormData.is_active || 0,
      });
    }
  }, [passEditFormData]);

  /***
   * Load all Lookup Types (Modules)
   */
  useEffect(() => {
    fetch(`${basURL}/lookuptype`)
      .then((response) => response.json())
      .then((data) => {
        setModuleData(data.data);
      })
      .catch((error) => console.error('Error fetching lookup types:', error));
  }, []);

  /***
   * Handle field change
   */
  const handleEditFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "lookupTypeId") {
      const selectedModule = moduleData.find(mod => mod.id == value);
      console.log("Selected module:", selectedModule);
      setEditFormData(prev => ({
        ...prev,
        lookupTypeId: selectedModule?.id || '',
        lookupCode: selectedModule?.lookup_code || ''
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  /***
   * Handle form submit
   */
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (!editFormData.lookupvaluename.trim()) {
      errors.lookupvalue_name = "Lookup Value name is required.";
    } else if (editFormData.lookupTypeId) {
      const isDuplicate = existingPermissionsData.some(data =>
        data.id !== passEditFormData.id &&
        (data.lookup_value == editFormData.lookupvaluename && data.lookup_code == editFormData.lookupCode)
      );

      if (isDuplicate) {
        errors.lookupvalue_name = "Duplicate Lookup Value name for this module.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const submitData = {
        lookup_value: editFormData.lookupvaluename,
        doc_lookup_type_id: editFormData.lookupTypeId,
        lookup_code: editFormData.lookupCode,
        is_active: editFormData.isActive ? 1 : 0,
      };

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/lookupvalue/update/${passEditFormData.id}`, {
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

        if(fetchItems) {
          fetchItems();
        }

        setBusinessUnitList(false);
        setPassingEditFormData(null);
      } else {
        if (typeof response.message === 'object') {
          setValidationErrors(response.message);
        } else {
          toast.error("Internal Error! Try again later.");
        }
      }
    } catch (error) {
      toast.error('Internal Error!! Try again later.');
      console.error(error);
    }
  };

  const goToModuleList = () => {
    setBusinessUnitList(false);
    setPassingEditFormData(null);
  };

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Lookup Value</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}lookupvalue/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>
              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  {/* Lookup Value Name */}
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Lookup Value Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Value name"
                      name='lookupvaluename'
                      value={editFormData.lookupvaluename || ""}
                      isInvalid={!!showValidationError.lookupvalue_name}
                      onChange={handleEditFormChange}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.lookupvalue_name}</Form.Control.Feedback>
                  </Form.Group>

                  {/* Lookup Type / Code */}
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Lookup Type <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.lookupcode_id ? 'is-invalid' : ''}`}
                      name="lookupTypeId"
                      value={editFormData.lookupTypeId || ""}
                      onChange={handleEditFormChange}
                    >
                      <option value="" disabled>Select Lookup Type</option>
                      {moduleData.length > 0 ?moduleData.map((module) => (
                        <option key={module.id} value={module.id}>
                          {module.lookup_type} ({module.lookup_code})
                        </option>
                      )): []}
                    </Form.Select>
                    {showValidationError.lookupcode_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.lookupcode_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  {/* Active Switch */}
                  <Form.Group as={Col} md="4" className='mt-4'>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={editFormData.isActive == 1}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, isActive: e.target.checked ? 1 : 0 })
                        }
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {editFormData.isActive == 1 ? 'Active' : 'Inactive'}
                      </label>
                    </div>
                  </Form.Group>
                </Row>

                <div className='d-flex justify-content-end'>
                  <Button type="submit">Update</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default LookupValueEditForm;
