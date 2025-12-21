import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const basURL = import.meta.env.VITE_API_BASE_URL;


const LeaveInfoForm = () => {

  const location = useLocation();
  const existingDoctorLeave = location.state?.doctorLeave || []; //for duplicate check
  console.log(existingDoctorLeave);

  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    leave_type: '',
    leave_from: '',
  });

  const [addFormData, setFormData] = useState({
    doctorId: '',
    leaveTypeId: '',
    totalDay: '',
    leaveFrom: '',
    leaveTo: '',
    joinDate: '',
    remarks: '',
  })

  // console.log(addFormData)

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState(''); //Speciality Update
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //React Select
  const [leaveLookupData, setLeaveLookupData] = useState(null); //React Select
  // console.log(leaveLookupData)


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
      
      setSelectedDoctorSpeciality(selectedOption.speciality || '');
    } else {
      const newFormData = { ...addFormData };
      newFormData.doctorId = '';
      setFormData(newFormData);
      setSelectedDoctorSpeciality('');
    }
  };

  //react select without doctor,s react select
  const reactSelectChange = (seletedOption, actionMeta) => {
      const name = actionMeta.name;

      setFormData(prev => ({
        ...prev,
        [name]: seletedOption ? seletedOption.value : ''
      }));
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.doctorId) {
      errors.doctor_name = "Doctor's name is required.";
    }

     // Duplicate Check
    const isDuplicate = existingDoctorLeave.some(item =>
      item.doctors_id == addFormData.doctorId
    );

    if (isDuplicate) {
      errors.doctor_name = "This doctor already has leave.";
    }
    
    if (!addFormData.leaveTypeId) {
      errors.leave_type = "Leave Type is required.";
    }
    if (!addFormData.leaveFrom) {
      errors.leave_from = "Leave From is required.";
    }



    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        doctors_id: addFormData.doctorId,
        leave_type_id: addFormData.leaveTypeId,
        total_days: addFormData.totalDay,
        leave_from: addFormData.leaveFrom,
        leave_to: addFormData.leaveTo,
        join_date: addFormData.joinDate,
        remarks: addFormData.remarks,
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/leave/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
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
          leaveTypeId: '',
          totalDay: '',
          leaveFrom: '',
          leaveTo: '',
          joinDate: '',
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
          leaveTypeId: '',
          totalDay: '',
          leaveFrom: '',
          leaveTo: '',
          joinDate: '',
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
    fetch(`${basURL}/doctors`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setDoctorsInfo(data.data);
      })
  }, []);

 // Helper Function: doctorsInfo convert to react-select option
 const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
   speciality: doctor.speciality?.lookup_value 
  }));

  //Lookup value Get By Code
  const getLookupValueDataByCode = async (code) => {
    try {
      const response = await fetch(`${basURL}/lookupvalue/multiplefilter/${code}`)
      const result = await response.json()

      if(!result?.data) return ;

      if(code === 'LV') {
        setLeaveLookupData(result.data);
      }

    } catch (err) {
        console.error(`Failed to load lookup value for code ${code}:`, err);
    }
  }

  useEffect(()=> {
    const lookupValueCode = ['LV'];

    lookupValueCode.forEach((code) => {
      getLookupValueDataByCode(code);
    })
  }, []);

  //For React select Formet
  const leaveType = leaveLookupData?.map((institute) => ({
    value : institute.id,
    label : institute.lookup_value
  })) || [];

 // Date minus function
  useEffect(() => {
    if (addFormData.leaveFrom && addFormData.leaveTo) {
      const from = new Date(addFormData.leaveFrom);
      const to = new Date(addFormData.leaveTo);

      // convert ml secound
      const diffTime = to.getTime() - from.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 so both dates are inclusive

      setFormData((prev) => ({
        ...prev,
        totalDay: diffDays > 0 ? diffDays : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        totalDay: '',
      }));
    }
  }, [addFormData.leaveFrom, addFormData.leaveTo]);


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
              <div className='card-title'>New Leave</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}leaveinfo/dataTable`}>
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
                    <Form.Label>Leave Type<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles} 
                      name="leaveTypeId"
                      options={leaveType}
                      className={`react-select-container ${showValidationError.leave_type ? 'is-invalid' : ''}`}
                      onChange={reactSelectChange}
                      value={leaveType.find(opt => opt.value === addFormData.leaveTypeId) || null}
                      placeholder="Search and Select Institute"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.leave_type && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.leave_type}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>  

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Leave From<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        type="date"
                        className='border-dark'
                        name='leaveFrom'
                        value={addFormData.leaveFrom}
                        isInvalid={!!showValidationError.leave_from}
                        onChange={onChangeHandler}

                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.leave_from}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Leave To<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        required
                        type="date"
                        className='border-dark'
                        name='leaveTo'
                        value={addFormData.leaveTo}
                        isInvalid={!!showValidationError.leave_to}
                        onChange={onChangeHandler}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.leave_to}</Form.Control.Feedback>
                  </Form.Group>              
                </Row>

                <Row>
                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Total Days<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        type="text"
                        className='border-dark readableInputBgColor'
                        placeholder="Speciality"
                        value={addFormData.totalDay}
                        readOnly
                      />
                  </Form.Group>

                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Join Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="date"
                          className='border-dark'
                          name='joinDate'
                          value={addFormData.joinDate}
                          isInvalid={!!showValidationError.join_date}
                          onChange={onChangeHandler}

                        />
                      <Form.Control.Feedback type='invalid'>{showValidationError.join_date}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="8" controlId="validationCustom01">
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

export default LeaveInfoForm;
