import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const basURL = import.meta.env.VITE_API_BASE_URL;


const LookupTypeEditForm = ({
  setBusinessUnitList,
  setLookupTypesData,
  passEditFormData,
  setPassingEditFormData,
  existingPermissionsData
}) => {

  // console.log("Database Check:", passEditFormData);

  const [editFormData, setEditFormData] = useState({
    lookuptypename: '',
    lookupTypeId: '',
    isActive: '',
    createby: '',
  })

  // console.log(existingPermissionsData)
  const [isHidden, setIsHidden] = useState([false]);

  const [moduleData, setModuleData] = useState([]);

  const [showValidationError, setValidationErrors] = useState({});

  useEffect(() => {
  if (passEditFormData) {
    setEditFormData({
      lookupTypeId: passEditFormData.id,
      lookuptypename: passEditFormData.lookup_type,
      lookupcodename: passEditFormData.lookup_code,
      isActive: passEditFormData.is_active === 1,  // boolean convert-> number type
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
    const { name, type, checked, value } = event.target;
    // console.log(name, type, checked, value);
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // console.log(handleEditFormChange);

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.lookuptypename.trim()) {
      errors.lookuptype_name = "Lookup type name is required.";
    }
    if (!editFormData.lookupcodename.trim()) {
      errors.lookupcode_name = "Lookup code is required.";
    }

    // Duplicate check (excluding current record)
    const otherRecords = existingPermissionsData.filter(
      data => data.id !== passEditFormData.id
    );

    // 🔹 Check lookup_type duplicate
    const isDuplicateType = otherRecords.some(
      data => data.lookup_type.trim().toLowerCase() === editFormData.lookuptypename.trim().toLowerCase()
    );
    if (isDuplicateType) {
      errors.lookuptype_name = "Duplicate lookup type name not allowed.";
    }

    // 🔹 Check lookup_code duplicate
    const isDuplicateCode = otherRecords.some(
      data => data.lookup_code.trim().toLowerCase() === editFormData.lookupcodename.trim().toLowerCase()
    );
    if (isDuplicateCode) {
      errors.lookupcode_name = "Duplicate lookup code name not allowed.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        lookup_type: editFormData.lookuptypename,
        lookup_code: editFormData.lookupcodename,
        is_active: editFormData.isActive ? 1 : 0,
        // updated_by: 7
      }

      // console.log(submitData);
      // return;

      const result = await fetch(`${basURL}/lookuptype/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);

        setLookupTypesData((prevLookupTypes) =>
          prevLookupTypes.map((lookupTypes) =>
            lookupTypes.id === response.data.id ? { ...lookupTypes, ...response.data } : lookupTypes
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
      lookuptypename: '',
      lookupcodename: '',
      createby: '',
    })

  }

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}lookuptype/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Lookup Type Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter permission name"
                      defaultValue=""
                      name='lookuptypename'
                      value={editFormData.lookuptypename}
                      isInvalid={!!showValidationError.lookuptype_name}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.lookuptype_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Lookup Code Name <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter permission name"
                      defaultValue=""
                      name='lookupcodename'
                      value={editFormData.lookupcodename}
                      isInvalid={!!showValidationError.lookupcode_name}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.lookupcode_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" className='mt-4'>
                      <Form.Check 
                        type="switch"
                        id="flexSwitchCheckChecked"
                        name="isActive"
                        label={editFormData.isActive ? 'Active' : 'Inactive'}
                        checked={!!editFormData.isActive} 
                        onChange={handleEditFormChange}
                      />
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
    </Fragment >
  );
};

export default LookupTypeEditForm;