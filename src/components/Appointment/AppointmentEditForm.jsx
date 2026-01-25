import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const AppointmentEditForm = ({
  setShowData,
  setDoctorAppointment, //render for only id
  passEditFormData, //Edit data/id
  setPassingEditFormData,
  existingAppointment, //for duplicate check
  fetchItems  // render list Page
}) => {

  // console.log(passEditFormData);

  const datePickerRef = useRef(null); //for Date picker

  //*********Check Authentication Start***********
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry');  // token expire check
  const user_id = localStorage.getItem('user_id') // for updated_by

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********

  const [editFormData, setEditFormData] = useState({
    doctorId: '',
    appointmentDate: null,
    days: '',
    patientName: '',
    patientId: '',
    mobileNo: '',
    email: '',
    remarks: '',
    bu_id: '',
    consultation_fee: '',
    status: ''
  })

  // console.log(editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState('');
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //For React Select
  const [doctorScheduleDays, setDoctorScheduleDays] = useState([]); // one doctor all schedule
  const [filteredSchedule, setFilteredSchedule] = useState([]); // filter weekend day
  const [businessUnit, setBusinessUnite] = useState([]) // for react select Business Unit
  // console.log(businessUnit)

  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    appointment_date: '',
    days: '',
    patient_name: '',
    mobile_no: '',
    email_no: '',
    remarks: '', 
    bu_id: '',
    status: '',
    consultation_fee: ''   
  });


  useEffect(() => {
    //get React select initial value  
    if (passEditFormData && doctorsInfo.length > 0) {
      const selectedDoctor = doctorsInfo.find(
        doctor => doctor.id === passEditFormData.doctors_id
      );

      if (selectedDoctor) {
        setSelectedDoctorOption({
          value: selectedDoctor.id,
          label: `${selectedDoctor.doctor_name} (${selectedDoctor.bmdc_no})`,
          speciality: selectedDoctor.speciality?.lookup_value,
        });

        setSelectedDoctorSpeciality(selectedDoctor.speciality?.lookup_value || '');
        fetchDoctorSchedule(selectedDoctor.id);
      }

      setEditFormData({
        doctorId: passEditFormData.doctors_id || '',
        specialityName: passEditFormData.doctor?.speciality?.lookup_value || '',
        appointmentDate: passEditFormData.appointment_date ? new Date(passEditFormData.appointment_date) : null,
        days: passEditFormData.days || '',
        patientName: passEditFormData.patient_name || '',
        patientId: passEditFormData.patient_id || '',
        mobileNo: passEditFormData.mobile_no || '',
        email: passEditFormData.email_no || '',
        remarks: passEditFormData.remarks || '',
        status: passEditFormData.status || '',
        bu_id: passEditFormData.bu_id || '',
        consultation_fee: passEditFormData.consultation_fee || ''
      });
    }
  }, [passEditFormData, doctorsInfo]);


  //find winkend day and match days
  useEffect(() => {
    if (
      passEditFormData &&
      doctorScheduleDays.length > 0 &&
      editFormData.appointmentDate
    ) {
      const dayName = new Date(editFormData.appointmentDate)
        .toLocaleDateString("en-US", { weekday: "short" }); // Date to day fond Exp: Sat

      const daySchedule = doctorScheduleDays.filter(s => s.days === dayName);// doctor schedule to day filter
      setFilteredSchedule(daySchedule); 

      // Extract only the time part from saved days
      const savedTime = passEditFormData.days?.split(" - ")[1]?.trim();

      if (savedTime) {
        const matchingSlot = daySchedule.find(
          slot => `${slot.time_from} To ${slot.time_to}` === savedTime
        );

        if (matchingSlot) {
          setEditFormData(prev => ({
            ...prev,
            days: `${matchingSlot.time_from} To ${matchingSlot.time_to}`
          }));
        }
      }
    }
  }, [doctorScheduleDays, editFormData.appointmentDate]);

  /**  
    * Module
    * TODO:: Optimize
   */
  useEffect(() => {
    fetch(`${baseURL}/doctors/login_user`, {
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

  const handleEditFormChange = (event) => {

    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };


   // react-select doctor's  onChange handler
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctorOption(selectedOption);

    setFilteredSchedule([]);
    
    if (selectedOption) {
      setEditFormData(prev => ({
        ...prev,
        doctorId: selectedOption.value,
        consultation_fee: selectedOption.consultation_fee ?? '', // optional (backend send )
        appointmentDate: null,
        days: '',
      }));
      
      setSelectedDoctorSpeciality(selectedOption.speciality || '');
      fetchDoctorSchedule(selectedOption.value) // for doctor schedule api call

    } else {
        setEditFormData(prev => ({
        ...prev,
        doctorId: '',
        consultation_fee: '',
        appointmentDate: null,
        days: ''
      }));
      setSelectedDoctorSpeciality('');
    }
  };

  const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
   speciality: doctor.speciality?.lookup_value,
   consultation_fee: doctor.consultation_fee
  }));

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {
    setEditFormData(prev => ({
      ...prev,
      appointmentDate: selectedDate
    }));

    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'short' });
    const daySchedule = doctorScheduleDays.filter(s => s.days === dayName);
    setFilteredSchedule(daySchedule);
  };


  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.doctorId) {
      errors.doctor_name = "Doctor's name is required.";
    }
    
    if (!editFormData.appointmentDate) {
      errors.appointment_date = "Appointment date is required.";
    }
    if (!editFormData.days) {
      errors.days = "Day Schedule is required.";
    }
    if (!editFormData.patientName) {
      errors.patient_name = "Patient name is required.";
    }
    // Mobile number validation (Bangladesh example: 11 digits, starts with 01)
    const mobilePattern = /^01[0-9]{9}$/;
    if (!editFormData.mobileNo) {
      errors.mobile_no = "Mobile number is required.";
    } else if (!mobilePattern.test(editFormData.mobileNo)) {
      errors.mobile_no = "Invalid mobile number.";
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editFormData.email) {
      errors.email_no = "Email is required.";
    } else if (!emailPattern.test(editFormData.email)) {
      errors.email_no = "Invalid email address.";
    }
    if (!editFormData.bu_id) {
      errors.bu_id = "Business Unit is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
       //for 2025-11-19 23:00:00 - 23:00:00 when no edit
       const formattedDate = editFormData.appointmentDate
                              ? editFormData.appointmentDate.toISOString().split('T')[0]
                              : null;
        
        
        const submitData = {
          doctors_id: editFormData.doctorId,
          appointment_date: formattedDate,
          days: editFormData.days,
          patient_name: editFormData.patientName,
          mobile_no: editFormData.mobileNo,
          email_no: editFormData.email,
          patient_id: editFormData.patientId,
          remarks: editFormData.remarks,
          status: editFormData.status,
          bu_id: editFormData.bu_id,
          consultation_fee: editFormData.consultation_fee,
          updated_by: user_id
        }

      // console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/appointment/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);

        setDoctorAppointment((prevAppointment) =>
          prevAppointment.map((appointment) =>
            appointment.id === response.data.id ? { ...appointment, ...response.data } : appointment
          )
        );

        if (fetchItems) {
          fetchItems();
        }

        setShowData(false);
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

  //for single doctor all schedule
 const fetchDoctorSchedule = async (doctorId) => {
    try {
      const result = await fetch(`${baseURL}/chamber/getdoctorschedule/${doctorId}`, {
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


  //----------React Select Business Unit Start--------
      useEffect(() => {
        fetch(`${baseURL}/business_unit/login_user`, {
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
  
      useEffect(() => {
        if (activeBusinessUnitOptions.length > 0 && !editFormData.bu_id) {
          setEditFormData(prev => ({
            ...prev,
            bu_id: activeBusinessUnitOptions[0].value
          }));
        }
      }, [activeBusinessUnitOptions]);
  
      // react-select  onChange handler
      const selectBusinessUnitChange = (selectedOption) => {
        setEditFormData(prev => ({
          ...prev,
          bu_id: selectedOption? selectedOption.value : ''  //bu-> bussness_unit
        }))
      };
  //----------React Select Business Unit End--------


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

  const goToLeaveList = () => {
    setShowData(false);
    setPassingEditFormData(null);

  };

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Appointment Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}appointment/dataTable`}>
                  <button className="btn btn-primary" onClick={goToLeaveList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>

                <Row className="mb-3">
                  <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Business Unit<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={{
                        ...customStyles,
                        control: (base, state) => ({
                          ...base,
                          borderColor: '#000', // dark border
                          backgroundColor: activeBusinessUnitOptions.length === 1 ? '#EEEEEE' : '#fff', // single option color, normal otherwise
                          pointerEvents: activeBusinessUnitOptions.length === 1 ? 'none' : 'auto', // readonly effect
                          opacity: 1,
                          minHeight: '40px',
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: '#000',
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
                      options={activeBusinessUnitOptions}
                      className={`border-dark readableInputBgColor ${showValidationError.bu_id ? 'is-invalid' : ''}`}
                      onChange={selectBusinessUnitChange}
                      value={
                        activeBusinessUnitOptions.find(
                          option => option.value === editFormData.bu_id
                        ) || null
                      }
                      placeholder="Business Unit"
                      isSearchable={activeBusinessUnitOptions.length > 1}
                      disabled= {false}
                    />

                    {showValidationError.bu_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.bu_id}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Doctor Name & BMDC Number<span className='text-danger ms-1'>*</span></Form.Label>

                    <Select 
                      styles={customStyles}
                      name="doctorId"
                      options={doctorOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      onChange={handleDoctorChange}
                      value={selectedDoctorOption || null}
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
                        <Form.Label>Speciality <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          readOnly
                          value={selectedDoctorSpeciality || editFormData.specialityName || ''}
                        />
                  </Form.Group>

                  <Form.Group as={Col} md="2">
                    <Form.Label>
                      Appointment Date<span className="text-danger ms-1">*</span>
                    </Form.Label>

                    <InputGroup>
                      <DatePicker
                        ref={datePickerRef}
                        selected={editFormData.appointmentDate}
                        onChange={handleFromDateChange}
                        dateFormat="dd-MM-yyyy"
                        minDate={passEditFormData ? null : new Date()}
                        customInput={
                          <Form.Control
                            className="border-dark"
                            isInvalid={!!showValidationError.appointment_date}
                          />
                        }
                      />

                      <InputGroup.Text
                        style={{ cursor: 'pointer' }}
                        onClick={() => datePickerRef.current?.setOpen(true)}
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

                  <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Days<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Select
                          size="lg"
                          className={`border-dark p-2 ${showValidationError.days ? 'is-invalid' : ''}`}
                          name="days"
                          value={editFormData.days}
                          onChange={handleEditFormChange}
                          aria-label="Select role"
                        >
                        <option value="">Select Days</option>
                        {filteredSchedule.length > 0 ? filteredSchedule.map((list) => (
                          <option key={list.id} value={`${list.time_from} To ${list.time_to}`}>{list.days} - {list.time_from} To {list.time_to}</option>
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
                      
                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark'
                          name='patientName'
                          value={editFormData.patientName || ''}
                          isInvalid={!!showValidationError.patient_name}
                          onChange={handleEditFormChange}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.patient_name}</Form.Control.Feedback>
                      </Form.Group>
                </Row>

                 <Row>
                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Patient Id<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark'
                          name='patientId'
                          value={editFormData.patientId || ''}
                          isInvalid={!!showValidationError.patient_id}
                          onChange={handleEditFormChange}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.patient_id}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Mobile number<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark'
                          name='mobileNo'
                          value={editFormData.mobileNo || ''}
                          isInvalid={!!showValidationError.mobile_no}
                          onChange={handleEditFormChange}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.mobile_no}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Email<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark'
                          name='email'
                          value={editFormData.email || ''}
                          isInvalid={!!showValidationError.email_no}
                          onChange={handleEditFormChange}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.email_no}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Consultation Fee<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          value={editFormData.consultation_fee || ''}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.consultation_fee}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01">
                          <Form.Label>Status <span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            type="text"
                            className='border-dark readableInputBgColor'
                            readOnly
                            value= "Booked"
                          />
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Remarks<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={4}
                          className='border-dark'
                          name='remarks'
                          placeholder='Exp: 1'
                          value={editFormData.remarks || ''}
                          isInvalid={!!showValidationError.remarks}
                          onChange={handleEditFormChange}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.remarks}</Form.Control.Feedback>
                      </Form.Group>
                </Row> 

                <Row className='mt-2'>
                  
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

export default AppointmentEditForm;