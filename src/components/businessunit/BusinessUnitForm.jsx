import { Fragment, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BusinessUnitForm = () => {

  const fileUseRef = useRef();
  const [logoPreview, setLogoPreview] = useState(null);
  const [showValidationError, setValidationErrors] = useState({
    business_unit: '',
    short_name: '',
    email_address: '',
    mobile_no: '',
    address: ''
  });

  const [addFormData, setFormData] = useState({
    businessunit: '',
    shortname: '',
    emailaddress: '',
    mobilenumber: '',
    address: '',
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

    if (!addFormData.businessunit.trim()) {
      errors.business_unit = "Business Unit is required.";
    }

    if (!addFormData.shortname.trim()) {
      errors.short_name = "Short Name is required.";
    } else if (!/^.{1,20}$/.test(addFormData.shortname)) {
      errors.short_name = "Short Name must be 20 character.";
    }

    if (!addFormData.emailaddress.trim()) {
      errors.email_address = "Email Address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(addFormData.emailaddress)) {
      errors.email_address = "Email Address is invalid.";
    }

    if (!addFormData.mobilenumber.trim()) {
      errors.mobile_no = "Mobile Number is required.";
    } else if (!/^\d{11}$/.test(addFormData.mobilenumber)) {
      errors.mobile_no = "Mobile Number must be 11 digits.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const formData = new FormData();
      formData.append('business_unit', addFormData.businessunit);
      formData.append('short_name', addFormData.shortname);
      formData.append('email_address', addFormData.emailaddress);
      formData.append('mobile_no', addFormData.mobilenumber);
      formData.append('address', addFormData.address);
      formData.append('is_active', addFormData.isActive ? 1 : 0);
      formData.append('create_by', 1);
      formData.append('updated_by', 1);

      if (addFormData.logo) {
        formData.append('logo', addFormData.logo); // Must be a File object
      }

      const result = await fetch('https://cserp.store/api/businessunit/create', {
        method: 'POST',
        body: formData
      });




      const response = await result.json();

      if (response.status == 'success') {
        toast.success(response.message);

        // Clear form
        setFormData({
          businessunit: '',
          shortname: '',
          emailaddress: '',
          mobilenumber: '',
          address: '',
          isActive: 1
        });
        setValidationErrors({})
        if (fileUseRef.current) {
          fileUseRef.current.value = null;
          setLogoPreview(null);
        }

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
      businessunit: '',
      shortname: '',
      emailaddress: '',
      mobilenumber: '',
      address: '',
      isActive: 1
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
      const newFormData = { ...addFormData };
      newFormData['logo'] = file;
      setFormData(newFormData);
      setLogoPreview(previewUrl);
    }
  }

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Business Unit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}businessunit/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>
            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Business Unit<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="e.g. Sales Division"
                      defaultValue=""
                      name='businessunit'
                      value={addFormData.businessunit}
                      isInvalid={!!showValidationError.business_unit}
                      onChange={onChangeHandler}

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
                      defaultValue=""
                      name='shortname'
                      value={addFormData.shortname}
                      onChange={onChangeHandler}
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
                        placeholder="example@gmail.com"
                        aria-describedby="inputGroupPrepend"
                        required
                        name='emailaddress'
                        value={addFormData.emailaddress}
                        onChange={onChangeHandler}
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
                        placeholder="+880 1XXXXXXXXX"
                        aria-describedby="inputGroupPrepend"
                        required
                        name='mobilenumber'
                        onChange={onChangeHandler}
                        value={addFormData.mobilenumber}
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
                        id="validationTextarea"
                        placeholder="Office address, city, state..."
                        required
                        name='address'
                        value={addFormData.address}
                        onChange={onChangeHandler}

                      ></Form.Control>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md="6" controlId="validationCustomUsername">
                    <Form.Label>Logo (Image Upload)</Form.Label>

                    <div
                      id="logoDrop"
                      className=" p-3 d-flex align-items-start gap-3"
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

                <Row>
                  <Form.Group className="mb-3" controlId='isActiveChecker'>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={addFormData.isActive == 1}
                        onChange={(e) => setFormData({ ...addFormData, isActive: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                        {addFormData.isActive == 1 ? 'Active' : 'Inactive'}
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

export default BusinessUnitForm;
