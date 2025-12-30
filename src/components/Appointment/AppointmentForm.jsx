import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
const basURL = import.meta.env.VITE_API_BASE_URL;


const AppointmentForm = () => {

  const location = useLocation();
  const existingDoctorLeave = location.state?.doctorLeave || []; //for duplicate check
  // console.log(existingDoctorLeave);

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
    appointment_date: '',
    days: '',
    patient_name: '',
    mobile_no: '',
    email_no: '',
    remarks: '',
  });

  const [addFormData, setFormData] = useState({
    doctorId: '',
    appointmentDate: new Date(),
    days: '',
    patientName: '',
    patientId: '',
    mobileNo: '',
    email: '',
    remarks: '',
  })

  // console.log(addFormData)

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState(''); //Speciality Update
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //React Select
  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
  const [doctorScheduleDays, setDoctorScheduleDays] = useState([]); // one doctor all schedule
  const [filteredSchedule, setFilteredSchedule] = useState([]); // filter weekend day
  // console.log(filteredSchedule)
  // console.log(doctorScheduleDays)


  const onChangeHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;


    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }

   // react-select Doctor onChange handler
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctorOption(selectedOption);
    
    if (selectedOption) {
      const newFormData = { ...addFormData };
      newFormData.doctorId = selectedOption.value;
      setFormData(newFormData);
      
      fetchDoctorSchedule(selectedOption.value) // for doctor schedule api call
      setSelectedDoctorSpeciality(selectedOption.speciality || '');
    } else {
      const newFormData = { ...addFormData };
      newFormData.doctorId = '';
      setFormData(newFormData);
      setSelectedDoctorSpeciality('');
    }
  };

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {
      const formattedDate = selectedDate.toISOString().split("T")[0]; //only date find

      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });

      setFormData({
          ...addFormData,
          appointmentDate: formattedDate
      });

      
      // Day  schedule filter 
      if (doctorScheduleDays.length > 0) {
          const daySchedule = doctorScheduleDays.filter(schedule => schedule.days === dayName);
          setFilteredSchedule(daySchedule); // filtered schedule state
      }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.doctorId) {
      errors.doctor_name = "Doctor's name is required.";
    }
    
    if (!addFormData.appointmentDate) {
      errors.appointment_date = "Appointment date is required.";
    }
    if (!addFormData.days) {
      errors.days = "Day Schedule is required.";
    }
    if (!addFormData.patientName) {
      errors.patient_name = "Patient name is required.";
    }
    // Mobile number validation (Bangladesh example: 11 digits, starts with 01)
    const mobilePattern = /^01[0-9]{9}$/;
    if (!addFormData.mobileNo) {
      errors.mobile_no = "Mobile number is required.";
    } else if (!mobilePattern.test(addFormData.mobileNo)) {
      errors.mobile_no = "Invalid mobile number.";
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!addFormData.email) {
      errors.email_no = "Email is required.";
    } else if (!emailPattern.test(addFormData.email)) {
      errors.email_no = "Invalid email address.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        doctors_id: addFormData.doctorId,
        appointment_date: addFormData.appointmentDate,
        days: addFormData.days,
        patient_name: addFormData.patientName,
        mobile_no: addFormData.mobileNo,
        email_no: addFormData.email,
        patient_id: addFormData.patientId,
        remarks: addFormData.remarks,
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/appointment/create`, {
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
          appointmentDate: '',
          days: '',
          patientName: '',
          patientId: '',
          mobileNo: '',
          email: '',
          remarks: '',
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
        appointmentDate: '',
        days: '',
        patientName: '',
        patientId: '',
        mobileNo: '',
        email: '',
        remarks: '',
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

 // Helper Function: doctorsInfo convert to react-select option
 const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
   speciality: doctor.speciality?.lookup_value 
  }));

 //for single doctor all schedule
 const fetchDoctorSchedule = async (doctorId) => {
    try {
      const result = await fetch(`${basURL}/chamber/getdoctorschedule/${doctorId}`, {
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // <-- must send token
      }
      });
      const response = await result.json();

      if (response.status === "success") {
        setDoctorScheduleDays(response.data); // data = schedule list
      } else {
        setDoctorScheduleDays([]);
      }

    } catch (err) {
      console.error("Error loading schedule:", err);
      setDoctorScheduleDays([]);
    }
  };


  //React select Style
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
              <div className='card-title'>New Appointment</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}appointment/dataTable`}>
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

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
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
                    <Form.Label>Appointment Date<span className='text-danger ms-1'>*</span></Form.Label>
                      <InputGroup className="">
                          <div className="form-control border-dark">
                            <DatePicker
                              className='border-0'
                              selected={addFormData.appointmentDate}
                              dateFormat="dd-MM-yyyy"
                              onChange={handleFromDateChange}
                              open={isOpenDate}
                              minDate={new Date()}
                              onClickOutside={() => setIsOpenDate(false)}
                            />
                          </div>
                        <InputGroup.Text id="basic-addon1" className="text-muted"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setIsOpenDate(true)}
                        >
                          <i className="ri-calendar-line"></i>
                        </InputGroup.Text>
                      </InputGroup>

                    {showValidationError.appointment_date && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.appointment_date}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>  

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Days<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Select
                        size="lg"
                        className={`border-dark p-2 ${showValidationError.days ? 'is-invalid' : ''}`}
                        name="days"
                        value={addFormData.days}
                        onChange={onChangeHandler}
                        aria-label="Select role"
                      >
                        <option value="">Select Days</option>
                        {filteredSchedule.length > 0 ? filteredSchedule.map((list) => (
                          <option key={list.id} value={`${list.time_from} To ${list.time_to}`}>{list.days} - {list.time_from} To ({list.time_to})</option>
                        )) : (
                          <option value="" disabled>This Doctor Has No Schedule</option>
                        )}
                      </Form.Select>

                    {showValidationError.days && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.days}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type patient name'
                        name='patientName'
                        value={addFormData.patientName}
                        isInvalid={!!showValidationError.patient_name}
                        onChange={onChangeHandler}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.patient_name}</Form.Control.Feedback>
                  </Form.Group>              
                </Row>

                <Row>
                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Patient Id<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type patient id'
                        name='patientId'
                        value={addFormData.patientId}
                        isInvalid={!!showValidationError.patient_id}
                        onChange={onChangeHandler}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.patient_id}</Form.Control.Feedback>
                  </Form.Group>

                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Mobile No<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Exp: 01xxxxxxxxx'
                        name='mobileNo'
                        value={addFormData.mobileNo}
                        isInvalid={!!showValidationError.mobile_no}
                        onChange={onChangeHandler}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.mobile_no}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Email<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='example@gmail.com'
                        name='email'
                        value={addFormData.email}
                        isInvalid={!!showValidationError.email_no}
                        onChange={onChangeHandler}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.email_no}</Form.Control.Feedback>
                  </Form.Group>

                    <Form.Group as={Col} md="6" controlId="validationCustom01">
                      <Form.Label>Remarks<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={4}
                          placeholder="Enter Remarks Doctor's..."
                          className='border-dark'
                          name='remarks'
                          value={addFormData.remarks}
                          isInvalid={!!showValidationError.remarks}
                          onChange={onChangeHandler}
                        />
                      <Form.Control.Feedback type='invalid'>{showValidationError.remarks}</Form.Control.Feedback>
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

export default AppointmentForm;
