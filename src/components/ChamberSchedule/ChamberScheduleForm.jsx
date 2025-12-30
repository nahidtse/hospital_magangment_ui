import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const basURL = import.meta.env.VITE_API_BASE_URL;


const ChamberScheduleTable = () => {

  const location = useLocation();
  const existingChamberSchedule = location.state?.chamberSchedule || [];
  // console.log(existingChamberSchedule);

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
    doctor_name: '',
    days: '',
    shift: '',
    time_from: '',
    time_to: ''
  });

  const [addFormData, setFormData] = useState({
    doctorId: '',
    days: '',
    shift: '',
    timefrom: '',
    timeto: '',
    // createby: 1,

  })

  // console.log(addFormData)

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState(''); //Speciality Update
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //React Select


  // Helper Function: doctorsInfo convert to react-select option
 const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
   speciality: doctor.speciality?.lookup_value 
  }));

  

  const onChangeHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;


    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }

   // react-select  onChange handler
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctorOption(selectedOption);
    
    if (selectedOption) {
      const newFormData = { ...addFormData };
      newFormData.doctorId = selectedOption.value;
      setFormData(newFormData);
      
      setSelectedDoctorSpeciality(selectedOption.speciality || '');
    } else {
      const newFormData = { ...addFormData };
      newFormData.doctorId = '';
      setFormData(newFormData);
      setSelectedDoctorSpeciality('');
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.doctorId) {
      errors.doctor_name = "Doctor's name is required.";
    }

    if (!addFormData.days) {
      errors.days = "Days is required.";
    }
    if (!addFormData.shift) {
      errors.shift = "Shift Time is required.";
    }
    if (!addFormData.timefrom) {
      errors.time_from = "Time (From) is required.";
    }
    if (!addFormData.timeto) {
      errors.time_to = "Time (To) is required.";
    }



    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        doctors_id: addFormData.doctorId,
        days: addFormData.days,
        shift_name: addFormData.shift,
        time_from: addFormData.timefrom,
        time_to: addFormData.timeto,
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/chamber/store`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      // console.log(result)
      // return

      if (response.status == 'success') {
        toast.success(response.message);

        // Clear formd
        setFormData({
          doctorId: '',
          days: '',
          timefrom: [],
          timeto: '',
          shift: ''
        });
        setSelectedDoctorOption(null);
        setSelectedDoctorSpeciality('');
        setValidationErrors({});

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
      doctorId: '',
      days: '',
      shift: '',
      timefrom: '',
      timeto: ''
    });
    setSelectedDoctorOption(null); //React clear
    setSelectedDoctorSpeciality(''); //Speciality clear
    setValidationErrors({}) //Validation Errors Clear
  }

  /**  
   * Module
   * TODO:: Optimize
  */
  useEffect(() => {
    fetch(`${basURL}/doctors`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // <-- must send token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setDoctorsInfo(data.data);
      })
  }, []);

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
              <div className='card-title'>New Chamber Schedule</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}chamberschedule/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Doctor's Name & BMDC No <span className='text-danger ms-1'>*</span></Form.Label>

                    <Select
                      styles={customStyles} 
                      name="doctorId"
                      options={doctorOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      onChange={handleDoctorChange}
                      value={selectedDoctorOption}
                      placeholder="Search and Select Doctor"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.doctor_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.doctor_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Speciality<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        type="text"
                        className='border-dark readableInputBgColor'
                        placeholder="Speciality"
                        value={selectedDoctorSpeciality}
                        readOnly

                      />
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Days<span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select  
                      size="lg"
                      className={`border-dark`}
                      name="days"
                      onChange={onChangeHandler}
                      value={addFormData.days || ''}
                      aria-label="Select role"
                    >
                      <option value="">Select Day</option>
                      <option value="Sat">Saturday</option>
                      <option value="Sun">Sunday</option>
                      <option value="Mon">Monday</option>
                      <option value="Tue">Tuesday</option>
                      <option value="Wed">Wednesday</option>
                      <option value="Thu">Thursday</option>
                      <option value="Fri">Friday</option>
                      

                    </Form.Select>

                    {showValidationError.days && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.days}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>  

                  <Form.Group as={Col} md="2" controlId="validationCustom01">

                      <Form.Label>Shift Time <span className='text-danger ms-1'>*</span></Form.Label>

                      <Form.Select  
                      size="lg"
                      className={`border-dark`}
                      name="shift"
                      onChange={onChangeHandler}
                      value={addFormData.shift || ''}
                      aria-label="Select role"
                    >
                      <option value="">Select Shift</option>
                      <option value="Morning">Morning Shift</option>
                      <option value="Evening">Evening Shift</option>
                      <option value="Night">Night Shift</option>
                    </Form.Select>
                    {showValidationError.shift && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.shift}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>              
                </Row>

                <Row>
                    <Form.Group as={Col} md="4" controlId="validationCustom01"> 
                      <Row>
                         <Form.Group as={Col} md="4" controlId="validationCustom01">
                              <Form.Label>Time (From)<span className='text-danger ms-1'>*</span></Form.Label>
                              <Form.Control
                                required
                                type="text"
                                className='border-dark'
                                placeholder="Exp: 09:00 (AM)"
                                name='timefrom'
                                value={addFormData.timefrom}
                                isInvalid={!!showValidationError.time_from}
                                onChange={onChangeHandler}

                              />
                            <Form.Control.Feedback type='invalid'>{showValidationError.time_from}</Form.Control.Feedback>
                         </Form.Group>
                         <Form.Group as={Col} md="4" controlId="validationCustom01">
                              <Form.Label>Time (To)<span className='text-danger ms-1'>*</span></Form.Label>
                              <Form.Control
                                required
                                type="text"
                                className='border-dark'
                                placeholder="Exp: 12:30 (PM)"
                                name='timeto'
                                value={addFormData.timeto}
                                isInvalid={!!showValidationError.time_to}
                                onChange={onChangeHandler}

                              />
                            <Form.Control.Feedback type='invalid'>{showValidationError.time_to}</Form.Control.Feedback>
                         </Form.Group>
                      </Row>
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

export default ChamberScheduleTable;
