import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const BusinessUnitEditForm = ({ setBusinessUnitList, setContactsData, passEditFormData, setPassingEditFormData }) => {

  const fileUseRef = useRef();
  const [logoPreview, setLogoPreview] = useState(null);
  const [editFormData, setEditFormData] = useState({
    businessunit: '',
    shortname: '',
    emailaddress: '',
    mobilenumber: '',
    address: '',
    isActive: ''
  })
  const [isHidden, setIsHidden] = useState([false]);


  const [showValidationError, setValidationErrors] = useState({});

  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };


  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        businessunit: passEditFormData.business_unit,
        shortname: passEditFormData.short_name,
        emailaddress: passEditFormData.email_address,
        mobilenumber: passEditFormData.mobile_no,
        address: passEditFormData.address,
        isActive: passEditFormData.is_active
      });
    }
  }, [passEditFormData]);



  const goToBusinessUnitList = () => {
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

    if (!editFormData.businessunit.trim()) {
      errors.business_unit = "Business Unit is required.";
    }

    if (!editFormData.shortname.trim()) {
      errors.short_name = "Short Name is required.";
    } else if (!/^.{1,20}$/.test(editFormData.shortname)) {
      errors.short_name = "Short Name must be 20 character.";
    }

    if (!editFormData.emailaddress.trim()) {
      errors.email_address = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(editFormData.emailaddress)) {
      errors.email_address = "Email Address is invalid.";
    }

    if (!editFormData.mobilenumber.trim()) {
      errors.mobile_no = "Mobile Number is required.";
    } else if (!/^\d{11}$/.test(editFormData.mobilenumber)) {
      errors.mobile_no = "Mobile Number must be 11 digits.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const formData = new FormData();
      formData.append('business_unit', editFormData.businessunit);
      formData.append('short_name', editFormData.shortname);
      formData.append('email_address', editFormData.emailaddress);
      formData.append('mobile_no', editFormData.mobilenumber);
      formData.append('address', editFormData.address);
      formData.append('is_active', editFormData.isActive ? 1 : 0);
      formData.append('created_by', 1);
      formData.append('updated_by', 1);

      if (editFormData.logo) {
        formData.append('logo', editFormData.logo); // Must be a File object
      }

      const result = await fetch(`https://cserp.store/api/businessunit/update/${passEditFormData.id}`, {
        method: 'POST',
        body: formData
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
      businessunit: '',
      shortname: '',
      emailaddress: '',
      mobilenumber: '',
      address: '',
    })

    if (fileUseRef.current) {
      fileUseRef.current.value = null;
      setLogoPreview(null);
    }
  }

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (fileUseRef.current) {
      fileUseRef.current.value = null;
    }
  }
  const handleChangeLogoPreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  }

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Edit Business Unit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}businessunit/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToBusinessUnitList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Business Unit<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      id="businessunit"
                      placeholder="e.g. Sales Division"
                      name='businessunit'
                      value={editFormData.businessunit}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.business_unit}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.business_unit}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Short Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      maxLength={20}
                      className='border-dark'
                      placeholder="e.g. Sales"
                      name='shortname'
                      value={editFormData.shortname}
                      onChange={handleEditFormChange}
                      isInvalid={!!showValidationError.short_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {showValidationError.short_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                    <Form.Label>Email Address<span className='text-danger ms-1'>*</span></Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="email"
                        className='border-dark'
                        required
                        name='emailaddress'
                        placeholder="example@gmail.com"
                        value={editFormData.emailaddress}
                        onChange={handleEditFormChange}
                        isInvalid={!!showValidationError.email_address}
                      />
                      <Form.Control.Feedback type="invalid">
                        {showValidationError.email_address}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                    <Form.Label>Mobile Number<span className='text-danger ms-1'>*</span></Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="number"
                        className='border-dark'
                        required
                        name='mobilenumber'
                        placeholder="+880 1XXXXXXXXX"
                        value={editFormData.mobilenumber}
                        onChange={handleEditFormChange}
                        isInvalid={!!showValidationError.mobile_no}
                      />
                      <Form.Control.Feedback type="invalid">
                        {showValidationError.mobile_no}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                    <Form.Label>Address</Form.Label>
                    <div className="mb-3">
                      <Form.Control
                        as='textarea'
                        rows={5}
                        className='border-dark'
                        placeholder="Office address, city, state..."
                        name='address'
                        value={editFormData.address}
                        onChange={handleEditFormChange}

                      ></Form.Control>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                    <Form.Label>Logo (Image Upload)</Form.Label>

                    <div
                      id="logoDrop"
                      className="p-3 d-flex align-items-start gap-3"
                      style={{ minHeight: '100px' }}
                    >

                      <div
                        id="logoPreview"
                        className="d-flex align-items-center justify-content-center border rounded bg-light"
                        style={{ width: '120px', height: '100px', overflow: 'hidden' }}
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        ) : (
                          <span className="text-muted small">No image</span>
                        )}
                      </div>

                      {/* File Input & Remove Button */}
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Form.Control
                            type="file"
                            accept="image/*"
                            name="logo"
                            ref={fileUseRef}
                            onChange={handleChangeLogoPreview}
                          />

                          <button
                            type="button"
                            id="removeLogo"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={handleRemoveLogo}
                          >
                            Remove
                          </button>
                        </div>
                        <small className="text-muted">
                          Max 2MB. JPG/PNG. Click "Choose File" or drag & drop an image onto the preview box.
                        </small>
                      </div>
                    </div>
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

export default BusinessUnitEditForm;