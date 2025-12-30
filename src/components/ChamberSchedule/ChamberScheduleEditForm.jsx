import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const basURL = import.meta.env.VITE_API_BASE_URL;


const ChamberScheduleEditForm = ({
  setShowData,
  setChamberSchedule,
  passEditFormData,
  setPassingEditFormData,
  existingChamberSchedule, //for duplicate check
  fetchItems
}) => {

  // console.log(passEditFormData);

  //*********Check Authentication Start***********
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********

  const [editFormData, setEditFormData] = useState({
    doctorsId: '',
    specialityName: '',
    days: '',
    shift: '',
    timefrom: '',
    timeto: ''
  })

  // console.log(editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState('');
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //For React Select

  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    days: '',
    shift: '',
    time_from: '',
    time_to: ''
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
          speciality: selectedDoctor.speciality?.lookup_value
        });

        setSelectedDoctorSpeciality(selectedDoctor.speciality?.lookup_value || '');
      }

      setEditFormData({
        doctorsId: passEditFormData.doctors_id || '',
        specialityName: passEditFormData.doctor?.speciality?.lookup_value || '',
        days: passEditFormData.days || '',
        shift: passEditFormData.shift_name || '',
        timefrom: passEditFormData.time_from || '',
        timeto: passEditFormData.time_to || ''
      });
    }
  }, [passEditFormData, doctorsInfo]);

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
  }, [])


  const goToChamberScheduleList = () => {
    setShowData(false);
    setPassingEditFormData(null);

  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };


   // react-select  onChange handler
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctorOption(selectedOption);
    
    if (selectedOption) {
      const newFormData = { ...editFormData };
      newFormData.doctorsId = selectedOption.value;
      setEditFormData(newFormData);
      
      setSelectedDoctorSpeciality(selectedOption.speciality || '');
    } else {
      const newFormData = { ...editFormData };
      newFormData.doctorsId = '';
      setEditFormData(newFormData);
      setSelectedDoctorSpeciality('');
    }
  };

  const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
   speciality: doctor.speciality?.lookup_value 
  }));


  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.doctorsId) {
      errors.doctor_name = "Doctor's name is required.";
    }

    if (!editFormData.days) {
      errors.days = "Days is required.";
    }
    if (!editFormData.shift) {
      errors.shift = "Shift Time is required.";
    }
    if (!editFormData.timefrom) {
      errors.time_from = "Time (From) is required.";
    }
    if (!editFormData.timeto) {
      errors.time_to = "Time (To) is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

        const submitData = {
        doctors_id: editFormData.doctorsId,
        days: editFormData.days,
        shift_name: editFormData.shift,
        time_from: editFormData.timefrom,
        time_to: editFormData.timeto,
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/chamber/update/${passEditFormData.id}`, {
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

        setChamberSchedule((prevChamberSchedule) =>
          prevChamberSchedule.map((schedule) =>
            schedule.id === response.data.id ? { ...schedule, ...response.data } : schedule
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
              <div className='card-title'>Chamber Schedule Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}chamberschedule/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToChamberScheduleList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Doctor Name & BMDC Number<span className='text-danger ms-1'>*</span></Form.Label>

                    <Select 
                      styles={customStyles}
                      name="doctorsId"
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
                        <Form.Label>Speciality <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          readOnly
                          value={selectedDoctorSpeciality || editFormData.specialityName}
                        />
                  </Form.Group>

                   <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Days<span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.lookupvalue_id ? 'is-invalid' : ''}`}
                      name="days"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                      value={editFormData.days}
                    >
                      <option value="">Select Days</option>
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

                   <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Shift Time<span className='text-danger ms-1'>*</span></Form.Label>

                    <Form.Select
                      size="lg"
                      className={`border-dark p-2 ${showValidationError.lookupvalue_id ? 'is-invalid' : ''}`}
                      name="shift"
                      onChange={handleEditFormChange}
                      aria-label="Select role"
                      value={editFormData.shift}
                    >
                      <option value="">Select Shift Time</option>
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
                    <Form.Group as={Col} md="4" controlId="validationCustom01" className='mt-2'>
                    <Row>
                      <Form.Group as={Col} md="6" controlId="validationCustom01" >
                        <Form.Label>Time (From) <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark'
                          placeholder="Exp: 09:00 (AM)"
                          name='timefrom'
                          value={editFormData.timefrom}
                          isInvalid={!!showValidationError.time_from}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.time_from}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="6" controlId="validationCustom01" >
                        <Form.Label>Time (To) <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark'
                          placeholder="Exp: 12:00 (PM)"
                          name='timeto'
                          value={editFormData.timeto}
                          isInvalid={!!showValidationError.time_to}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.time_to}</Form.Control.Feedback>
                      </Form.Group>
                    </Row>
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

export default ChamberScheduleEditForm;