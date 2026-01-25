import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const DoctorInfoEditForm = ({
  setBusinessUnitList,
  setContactsData,
  passEditFormData,
  setPassingEditFormData,
  existingPermissionsData,
  fetchItems
}) => {

  // console.log(passEditFormData);

  const [editFormData, setEditFormData] = useState({
    doctorname: '',
    specialityId: '',
    specialityName: '',
    degreeId: [],
    bmdcnumber: '',
    doctorId: '',
    image: '',
    imagePreview: '',
    isActive: '',
    consultationfee: '',
    vat: '',
    vatIncluded: '',
    followupfee: '',
    withinday: '',
    consultationtime: '',
    aboutdoctor: '',
    bu_id: [],
  })

  // console.log(editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [getSPlookupData, setSPlookupData] = useState([]);
  const [getDGlookupData, setGDlookupData] = useState([]);
  const [businessUnit, setBusinessUnite] = useState([]) // for react select Business Unit


  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    speciality_id: '',
    degree_id: '',
    bmdc_no: '',
    consultation_fee: '',
    bu_id: []
  });
  // console.log(showValidationError)

  useEffect(() => {
    if (passEditFormData) {
      setEditFormData({
        doctorname: passEditFormData.doctor_name || '',
        specialityId: passEditFormData.speciality_id,
        specialityName: passEditFormData.speciality?.lookup_value || '',
        degreeId: passEditFormData.degrees?.map(item => item.id) || [],
        bmdcnumber: passEditFormData.bmdc_no || '',
        doctorId: passEditFormData.doctor_id || '',
        // image: passEditFormData.image || '',
        imagePreview: passEditFormData.image || '',
        isActive: passEditFormData.is_active || '',
        consultationfee: passEditFormData.consultation_fee || '',
        vat: passEditFormData.vat || '',
        vatIncluded: passEditFormData.vat_included || '',
        followupfee: passEditFormData.followup_fee || '',
        withinday: passEditFormData.within_day || '',
        consultationtime: passEditFormData.consultation_time || '',
        aboutdoctor: passEditFormData.about_doctor || '',
        bu_id: passEditFormData.bu_id || '',
      });
    }
  }, [passEditFormData]);

  /**  
    * Module
    * TODO:: Optimize
   */
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry'); //check token expiry time
  const user_id = localStorage.getItem('user_id') // for Updated_by

  if (!token || (expiry && Date.now() > Number(expiry))) {
    localStorage.clear();
    window.location.href = "/login";
    return;
  }

  useEffect(() => {
    fetch(`${baseURL}/lookupvalue/multiplefilter/sp`, {
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
    fetch(`${baseURL}/lookupvalue/multiplefilter/dg`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setGDlookupData(data.data);
      })
  }, [])

  const dgLookupData = getDGlookupData.map((item) => ({
    value: item.id,
    label: item.lookup_value,
  }));

  const goToModuleList = () => {
    setBusinessUnitList(false);
    setPassingEditFormData(null);

  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    if (event.target.type === "file") {
      fieldValue = event.target.files[0]; 
    } 

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };


  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.doctorname.trim()) {
      errors.doctor_name = "Doctor's name is required.";
    }
    if (!editFormData.degreeId || editFormData.degreeId.length === 0) {
      errors.degree_id = "Degree is required.";
    }
     // BMDC number duplicate check
      if (editFormData.bmdcnumber.trim()) {
        const isDuplicate = existingPermissionsData.some(data =>
          data.id !== passEditFormData.id &&  
          (data.bmdc_no?.trim() || '') === editFormData.bmdcnumber.trim()
        );

        if (isDuplicate) {
          errors.bmdcnumber = "This BMDC number already exists.";
        }
      }

    if (!editFormData.bu_id || editFormData.bu_id.length === 0) {
      errors.bu_id = "Business Unit is required.";
    }  


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

        const formData = new FormData();
        formData.append("doctor_name", editFormData.doctorname);
        formData.append("speciality_id", editFormData.specialityId);
        formData.append("degree_id", JSON.stringify(editFormData.degreeId));
        formData.append("bmdc_no", editFormData.bmdcnumber);
        formData.append("doctor_id", editFormData.doctorId);
        formData.append("is_active", editFormData.isActive ? 1 : 0);
        if (editFormData.image && typeof editFormData.image !== 'string') {
          formData.append("image", editFormData.image);
        }
        formData.append("consultation_fee", editFormData.consultationfee); 
        formData.append("vat", editFormData.vat); 
        formData.append("vat_included", editFormData.vatIncluded); 
        formData.append("followup_fee", editFormData.followupfee); 
        formData.append("within_day", editFormData.withinday); 
        formData.append("consultation_time", editFormData.consultationtime); 
        formData.append("about_doctor", editFormData.aboutdoctor); 
        formData.append("bu_id", JSON.stringify(editFormData.bu_id)); 
        formData.append("updated_by", user_id)
      
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }
      // return;

      const result = await fetch(`${baseURL}/doctors/update/${passEditFormData.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      });


      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);

        setContactsData((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === response.data.id ? { ...contact, ...response.data } : contact
          )
        );

        if (fetchItems) {
          fetchItems();
        }

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


  //----------React Select Business Unit Start--------
      useEffect(() => {
        fetch(`${baseURL}/business_unit`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // <-- must send token
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setBusinessUnite(data.data);
          })
      }, [])
  
      const activeBusinessUnitOptions = businessUnit.filter(busness => busness.is_active == 1).map(busness => ({
        value: busness.id,
        label: `${busness.business_unit}`
      }));
  
      //multiple doctor's select
      const selectBusinessUnitMultiChange = (selectedOption) => {
        const selectedIds = selectedOption ? selectedOption.map(option => option.value) : [];
        setEditFormData(prev => ({
          ...prev,
          bu_id: selectedIds
        }))
      };
  //----------React Select Business Unit End--------


  //React select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: '#000',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      // padding: '1px',
      minHeight: '40px',
      // '&:hover': {
      //   borderColor: '#000'
      // }
    }),
  };


  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Doctor Information Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}doctorsinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToModuleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Doctor Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Lookup Value Name"
                      name='doctorname'
                      value={editFormData.doctorname}
                      isInvalid={!!showValidationError.doctor_name}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.doctor_name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Specialty <span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.lookupvalue_id ? 'is-invalid' : ''}`}
                      name="specialityId"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                      value={editFormData.specialityId}
                    >
                      {/* <option value="">Select Specialty</option> */}
                      {getSPlookupData.map((module) => (
                        <option key={module.id} value={module.id}>{module.lookup_value}</option>
                      ))}

                    </Form.Select>

                    {showValidationError.lookupvalue_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.lookupvalue_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Degree<span className='text-danger'> *</span> </Form.Label>

                    <Select
                      isMulti={true}
                      name="degreeId"
                      className={`border-dark  ${showValidationError.degree_id ? 'is-invalid' : ''}`}
                      classNamePrefix="react-select"
                      options={dgLookupData}
                      value={dgLookupData.filter(option =>
                          (editFormData.degreeId || []).includes(option.value)
                        )}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map(option => option.value);
                        setEditFormData((prev) => ({
                          ...prev,
                          degreeId: selectedIds,
                        }));
                      }} />
                        {showValidationError.degree_id && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.degree_id}
                          </Form.Control.Feedback>
                        )}
                  </Form.Group>
                  
                </Row>

                 <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom01" className='mt-2'>
                    <Row>
                      <Form.Group as={Col} md="8" controlId="validationCustom01" >
                        <Form.Label>BMDC Number <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark'
                          placeholder="Enter Lookup Value Name"
                          name='bmdcnumber'
                          value={editFormData.bmdcnumber}
                          isInvalid={!!showValidationError.bmdc_number}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.bmdc_number}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Doctor's ID <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          readOnly
                          name='doctorId'
                          value={editFormData.doctorId}
                        />
                      </Form.Group>
                    </Row>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                      <Form.Label>Business Unit<span className='text-danger'> *</span> </Form.Label>
  
                      <Select
                        styles={customStyles}
                        isMulti={true} // Enable multiple selection
                        className={`border-dark ${showValidationError.bu_id ? 'is-invalid' : ''}`}
                        classNamePrefix="react-select"
                        options={activeBusinessUnitOptions}
                        value={activeBusinessUnitOptions.filter(option =>
                          editFormData.bu_id.includes(option.value)
                        )}
                        onChange={selectBusinessUnitMultiChange}
                      />
                      <Form.Control.Feedback type='invalid'>{showValidationError.bu_id}</Form.Control.Feedback>
                    </Form.Group> 

                  <Form.Group as={Col} md="3" className='mt-2'>
                    <Form.Label>Image<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="file"
                      className='border-dark'
                      placeholder="Enter Lookup Value Name"
                      name='image'
                      isInvalid={!!showValidationError.image}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.image}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="1">
                    <div className="form-check form-switch">
                      {editFormData.imagePreview && (
                      <div className="mt-2">
                        <img
                          src={editFormData.imagePreview}
                          alt="Doctor"
                          width="60"
                          height="70"
                          style={{
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                          }}
                        />
                      </div>
                    )}
                    </div>
                  </Form.Group>
                  </Row>       

                <Row>
                   <Form.Group as={Col} md="4" className='mt-3'>
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
                      value={editFormData.consultationfee}
                      isInvalid={!!showValidationError.consultation_fee}
                      onChange={handleEditFormChange}

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
                      value={editFormData.vat}
                      isInvalid={!!showValidationError.vat}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.vat}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Vat Included <span className='text-danger ms-1'></span></Form.Label>
                    
                    <Form.Group controlId="tickCheckbox">
                        <Form.Check
                            type="checkbox"
                            label={editFormData.vatIncluded ? 'Yes' : 'No'}
                            name="vatIncluded"
                            checked={editFormData.vatIncluded === 1}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
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
                      placeholder="Enter Follow up Fee"
                      name='followupfee'
                      value={editFormData.followupfee}
                      isInvalid={!!showValidationError.followup_fee}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.followup_fee}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Within ( Days )<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Within ( Days )"
                      name='withinday'
                      value={editFormData.withinday}
                      isInvalid={!!showValidationError.within_day}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.within_day}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Avg. Consultation Time<span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Consultation Time"
                      name='consultationtime'
                      value={editFormData.consultationtime}
                      isInvalid={!!showValidationError.consultation_time}
                      onChange={handleEditFormChange}

                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.consultation_time}</Form.Control.Feedback>
                  </Form.Group>
                </Row>


                 <Row>
                    <div className='mt-3'><h6>About Doctor's</h6></div>
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
                        placeholder="About Doctor's"
                        required
                        name='aboutdoctor'
                        value={editFormData.aboutdoctor}
                        onChange={handleEditFormChange}

                      ></Form.Control>
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
    </Fragment >
  );
};

export default DoctorInfoEditForm;