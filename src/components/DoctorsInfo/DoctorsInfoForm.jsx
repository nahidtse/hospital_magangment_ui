import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
const basURL = import.meta.env.VITE_API_BASE_URL;



  const generateTinyDoctorId = (prefix = "DR") => {

    const now = new Date();
    const timestamp =
      String(now.getFullYear()).slice(2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0");
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${randomPart}`;
  };


const DoctorsInfoForm = () => {

  const location = useLocation();
  const existingLookupValuData = location.state?.contacts || [];
  // console.log(existingLookupValuData);

  const fileInputRef = useRef(null); //For image filed clear


  //*********Check Authentication Start***********
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********
  

  const [showValidationError, setValidationErrors] = useState({
    doctors_name: '',
    speciality_id: '',
    degree_id: '',
    bmdc_no: '',
    doctorId: '',
    consultation_fee: '',
    vat: '',
    followup_fee: '',
    within: '',
    consultation_time: '',
    about_doctor: '',
  });

  const [addFormData, setFormData] = useState({
    doctorsname: '',
    specialityId: '',
    degreeId: '',
    bmdcnumber: '',
    doctorId: generateTinyDoctorId(),
    image: '',
    isActive: 1,
    consultationfee: '',
    vat: '',
    vatIncluded: 1,
    followupfee: '',
    within: '',
    consultationtime: '',
    aboutdoctor: '',
    // createby: 1,

  })
// console.log(addFormData)

  const [getSPlookupData, setSPlookupData] = useState([]);
  const [getDGlookupData, setGDlookupdata] = useState([]);

  console.log("SP",getSPlookupData)
  console.log("DG",getDGlookupData)



  

  const onChangeHandler = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

      if (event.target.type === "file") {
      fieldValue = event.target.files[0]; 
    }

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.doctorsname.trim()) {
      errors.doctors_name = "Doctor's name is required.";
    }

    if (!addFormData.specialityId) {
      errors.speciality_id = "Doctor's Specialty is required.";
    }
    if (!addFormData.degreeId || addFormData.degreeId.length === 0) {
      errors.degree_id = "Doctor's Degree is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const formData = new FormData();
      formData.append("doctor_name", addFormData.doctorsname);
      formData.append("speciality_id", addFormData.specialityId);
      formData.append("degree_id", JSON.stringify(addFormData.degreeId));
      formData.append("bmdc_no", addFormData.bmdcnumber);
      formData.append("doctor_id", addFormData.doctorId);
      formData.append("is_active", addFormData.isActive ? 1 : 0);
      if (addFormData.image) formData.append("image", addFormData.image);
      formData.append("consultation_fee", addFormData.consultationfee);
      formData.append("vat", addFormData.vat);
      formData.append("vat_included", addFormData.vatIncluded);
      formData.append("followup_fee", addFormData.followupfee);
      formData.append("within_day", addFormData.within);
      formData.append("consultation_time", addFormData.consultationtime);
      formData.append("about_doctor", addFormData.aboutdoctor);


      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      // return;

      const result = await fetch(`${basURL}/doctors/create`,{
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      });

      const response = await result.json();
      // console.log(result)
      // return

      if (response.status == 'success') {
        toast.success(response.message);

        // Clear formd
        setFormData({
          doctorsname: '',
          specialityId: '',
          degreeId: [],
          bmdcnumber: '',
          image: '',
          isActive: 1,
          consultationfee: '',
          vat: '',
          vatIncluded: 1,
          followupfee: '',
          within: '',
          consultationtime: '',
          aboutdoctor: '',
          doctorId: generateTinyDoctorId()
        });

        setValidationErrors({})
        //for img input clear
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
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
      doctorsname: '',
      specialityId: '',
      degreeId: [],
      bmdcnumber: '',
      image: '',
      isActive: 1,
      consultationfee: '',
      vat: '',
      vatIncluded: 1,
      followupfee: '',
      within: '',
      consultationtime: '',
      aboutdoctor: '',
      doctorId: generateTinyDoctorId()
    });
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setValidationErrors({}) //Validation Errors Clear
  }

  /**  
   * Specialty
   * TODO:: Optimize
  */
  useEffect(() => {
    fetch(`${basURL}/lookupvalue/multiplefilter/sp`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setSPlookupData(data.data);
      })
  }, [])


  useEffect(() => {
    fetch(`${basURL}/lookupvalue/multiplefilter/dg`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // <-- must send token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setGDlookupdata(data.data);
      })
  }, [])

  const dgLookupData = getDGlookupData.map((item) => ({
    value: item.id,
    label: item.lookup_value,
  }));



  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Doctor Information</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}doctorsinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Doctor's Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Doctor name"
                      name='doctorsname'
                      value={addFormData.doctorsname}
                      isInvalid={!!showValidationError.doctors_name}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.doctors_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Specialty <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select  
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.speciality_id ? 'is-invalid' : ''}`}
                      name="specialityId"
                      onChange={onChangeHandler}
                      value={addFormData.specialityId || ''}
                      aria-label="Select role"
                    >
                      <option value="">Select Specialty</option>
                      {getSPlookupData && getSPlookupData.length > 0 ? (getSPlookupData.map((speciality) => (
                        <option key={speciality.id} value={speciality.id}>{speciality.lookup_value}</option>
                      ))) : ('')}

                    </Form.Select>

                    {showValidationError.speciality_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.speciality_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Select Degree<span className='text-danger'> *</span> </Form.Label>

                    <Select
                      isMulti={true}
                      name="degreeId"
                      className={`border-dark ${showValidationError.degree_id ? 'is-invalid' : ''}`}
                      classNamePrefix="react-select"
                      options={dgLookupData}
                      value={dgLookupData.filter(option =>
                        (addFormData.degreeId || []).includes(option.value)
                      )}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map(option => option.value);
                        setFormData((prev) => ({
                          ...prev,
                          degreeId: selectedIds,
                        }));
                      }} />
                    <Form.Control.Feedback type='invalid'>{showValidationError.degree_id}</Form.Control.Feedback>
                  </Form.Group>                
                </Row>

                <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom01"> 
                      <Row>
                         <Form.Group as={Col} md="8" controlId="validationCustom01">
                              <Form.Label>BMDC NO <span className='text-danger ms-1'>*</span></Form.Label>
                              <Form.Control
                                required
                                type="text"
                                className='border-dark'
                                placeholder="Exp: 3487583487364"
                                name='bmdcnumber'
                                value={addFormData.bmdcnumber}
                                isInvalid={!!showValidationError.bmdc_no}
                                onChange={onChangeHandler}

                              />
                            <Form.Control.Feedback type='invalid'>{showValidationError.bmdc_no}</Form.Control.Feedback>
                         </Form.Group>
                         <Form.Group as={Col} md="4" controlId="validationCustom01">
                              <Form.Label>Doctor's ID <span className='text-danger ms-1'></span></Form.Label>
                              <Form.Control
                                type="text"
                                className='border-dark readableInputBgColor'
                                placeholder="#444"
                                readOnly
                                name='doctorid'
                                value={addFormData?.doctorId || ''}
                                // isInvalid={!!showValidationError.doctor_id}
                                onChange={onChangeHandler}

                              />
                              {/* <Form.Control.Feedback type='invalid'>{showValidationError.doctor_id}</Form.Control.Feedback> */}
                         </Form.Group>
                      </Row>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Image <span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="file"
                      className='border-dark'
                      name='image'
                      isInvalid={!!showValidationError.image}
                      onChange={onChangeHandler}
                      ref={fileInputRef}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.image}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" className='mt-4'>
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

                 <Row>
                    <div className='mt-4'><h6>Consultation Fee</h6></div>
                    <div style={{borderBottom: "1px solid #ccc"}}></div>
                  </Row>       

                 <Row className="mb-3 mt-2">
                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Consultation Fee<span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Consultation Fee"
                      name='consultationfee'
                      value={addFormData.consultationfee}
                      isInvalid={!!showValidationError.consultation_fee}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.consultation_fee}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Vat ( % )<span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Vat"
                      name='vat'
                      value={addFormData.vat}
                      isInvalid={!!showValidationError.vat}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.vat}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Vat Included <span className='text-danger ms-1'></span></Form.Label>
                    
                    <Form.Group controlId="tickCheckbox">
                        <Form.Check
                            type="checkbox"
                            label={addFormData.vatIncluded ? 'Yes' : 'No'}
                            name="tickOption"
                            checked={addFormData.vatIncluded === 1}
                            onChange={(e) =>
                              setFormData({
                                ...addFormData,
                                vatIncluded: e.target.checked ? 1 : 0,
                              })
                            }
                        />
                    </Form.Group>
                    {/* <Form.Control.Feedback type='invalid'>{showValidationError.doctor_name}</Form.Control.Feedback> */}
                  </Form.Group>
                
                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Follow up Fee <span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Value Name"
                      name='followupfee'
                      value={addFormData.followupfee}
                      isInvalid={!!showValidationError.followup_fee}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.followup_fee}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Within ( Days )<span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Within Days"
                      name='within'
                      value={addFormData.within}
                      isInvalid={!!showValidationError.within}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.within}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Avg. Consultation Time<span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Value Name"
                      name='consultationtime'
                      value={addFormData.consultationtime}
                      isInvalid={!!showValidationError.consultation_time}
                      onChange={onChangeHandler}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.consultation_time}</Form.Control.Feedback>
                  </Form.Group>
                </Row>


                 <Row>
                    <div className='mt-2'><h6>About Doctor's</h6></div>
                    <div style={{borderBottom: "1px solid #ccc"}}></div>
                  </Row>       

                 <Row className="mb-3 mt-3">
                  <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                    <div className="mb-3">
                      <Form.Control
                        as='textarea'
                        rows={5}
                        className='border-dark'
                        // id="validationTextarea"
                        placeholder="Enter About Doctor's..."
                        required
                        name='aboutdoctor'
                        value={addFormData.aboutdoctor}
                        onChange={onChangeHandler}

                      ></Form.Control>
                    </div>
                    <Form.Control.Feedback type='invalid'>{showValidationError.about_doctor}</Form.Control.Feedback>
                  </Form.Group>
                </Row> 

                <Row className='mb-3'>
                  
                </Row>
                
                <div className='d-flex justify-content-end'>
                  <button type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                  <Button type="submit">Save</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default DoctorsInfoForm;
