import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const basURL = import.meta.env.VITE_API_BASE_URL;


const DoctorExperienceForm = () => {

  const location = useLocation();
  const existingDoctorExperience = location.state?.chamberSchedule || []; //for duplicate check
  // console.log(existingDoctorExperience);

  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    institute_name: '',
    dept_name: '',
    desg_name: '',
    from_date: '',
    serial_no: '',
  });

  const [addFormData, setFormData] = useState({
    doctorId: '',
    instituteId: '',
    designationId: '',
    departmentId: '',
    fromDate: '',
    toDate: '',
    period: '',
    isCurrent: 0,
    serialNo: '',
  })

  // console.log(addFormData)

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState(''); //Speciality Update
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //React Select
  const [itLookupData, setItLookupData] = useState(null); //React Select
  const [desigLookupData, setDesigLookupData] = useState(null); //React Select
  const [deptLookupData, setDeptLookupData] = useState(null); //React Select
  // console.log(deptLookupData)


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

  //checkbox function 
  const handleCheckboxChange = (event) => {
  const checked = event.target.checked;

  setFormData((prev) => ({
      ...prev,
      isCurrent: checked ? 1 : 0,
      toDate: checked ? '' : prev.toDate,  
      period: checked ? '' : prev.period,   
    }));
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.doctorId) {
      errors.doctor_name = "Doctor's name is required.";
    }

    if (!addFormData.instituteId) {
      errors.institute_name = "Institute is required.";
    }
    if (!addFormData.departmentId) {
      errors.dept_name = "Department is required.";
    }
    if (!addFormData.designationId) {
      errors.desg_name = "Designation is required.";
    }
    if (!addFormData.serialNo) {
      errors.serial_no = "Serial no is required.";
    }
    if (!addFormData.fromDate) {
      errors.from_date = "Form date is required.";
    }



    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        doctors_id: addFormData.doctorId,
        institute_id: addFormData.instituteId,
        desig_id: addFormData.designationId,
        dept_id: addFormData.departmentId,
        from_date: addFormData.fromDate,
        to_date: addFormData.toDate,
        period: addFormData.period,
        is_current: addFormData.isCurrent,
        serial_no: addFormData.serialNo,
      }

      console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/experience/create`, {
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
          instituteId: '',
          designationId: '',
          departmentId: '',
          fromDate: '',
          toDate: '',
          period: '',
          isCurrent: 0,
          serialNo: '',
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
      instituteId: '',
      designationId: '',
      departmentId: '',
      fromDate: '',
      toDate: '',
      period: '',
      isCurrent: 0,
      serialNo: '',
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

      if(code === 'IT') {
        setItLookupData(result.data);
      }else if (code === 'DESIG') {
        setDesigLookupData(result.data);
      }else if (code === 'DEPT') {
        setDeptLookupData(result.data);
      }

    } catch (err) {
        console.error(`Failed to load lookup value for code ${code}:`, err);
    }
  }

  useEffect(()=> {
    const lookupValueCode = ['IT', 'DESIG', 'DEPT']

    lookupValueCode.forEach((code) => {
      getLookupValueDataByCode(code);
    })
  }, [])

  // For React select formet
  const instituteType = itLookupData?.map((institute) => ({
    value : institute.id,
    label : institute.lookup_value
  })) || [];

  const designationType = desigLookupData?.map((designation) => ({
    value : designation.id,
    label : designation.lookup_value
  })) || [];

  const departmentType = deptLookupData?.map((department) => ({
    value : department.id,
    label : department.lookup_value
  })) || [];

  // Date minus function
  useEffect(() => {
    if (addFormData.fromDate && addFormData.toDate) {
      const from = new Date(addFormData.fromDate);
      const to = new Date(addFormData.toDate);

      // only year difference
      const years = to.getFullYear() - from.getFullYear();

      setFormData((prev) => ({
        ...prev,
        period: years >= 0 ? years : 0, // negative for 0
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        period: '',
      }));
    }
  }, [addFormData.fromDate, addFormData.toDate]);


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
              <div className='card-title'>New Doctor Experience</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}doctorexperience/dataTable`}>
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
                    <Form.Label>Institute<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles} 
                      name="instituteId"
                      options={instituteType}
                      className={`react-select-container ${showValidationError.institute_name ? 'is-invalid' : ''}`}
                      onChange={reactSelectChange}
                      value={instituteType.find(opt => opt.value === addFormData.instituteId) || null}
                      placeholder="Search and Select Institute"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.institute_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.institute_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>  

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Designation<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                      styles={customStyles} 
                      name="designationId"
                      options={designationType}
                      className={`react-select-container ${showValidationError.desg_name ? 'is-invalid' : ''}`}
                      onChange={reactSelectChange}
                      value={designationType.find(opt => opt.value === addFormData.designationId) || null}
                      placeholder="Select Designation"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.desg_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.desg_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>              
                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>Department<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                      styles={customStyles} 
                      name="departmentId"
                      options={departmentType}
                      className={`react-select-container ${showValidationError.dept_name ? 'is-invalid' : ''}`}
                      onChange={reactSelectChange}
                      value={departmentType.find(opt => opt.value === addFormData.departmentId) || null}
                      placeholder="Select Department"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.dept_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.dept_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>              
                </Row>

                <Row>
                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                        <Form.Label>From Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="date"
                          className='border-dark'
                          name='fromDate'
                          value={addFormData.fromDate}
                          isInvalid={!!showValidationError.from_date}
                          onChange={onChangeHandler}

                        />
                      <Form.Control.Feedback type='invalid'>{showValidationError.from_date}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                        <Form.Label>To Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="date"
                          className='border-dark'
                          name='toDate'
                          value={addFormData.toDate}
                          isInvalid={!!showValidationError.to_date}
                          onChange={onChangeHandler}
                          disabled= {addFormData.isCurrent == 1}
                        />
                      <Form.Control.Feedback type='invalid'>{showValidationError.to_date}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>is_current <span className='text-danger ms-1'></span></Form.Label>
                    {/* <Form.Group controlId="tickCheckbox"> */}
                        <Form.Check
                            type="checkbox"
                            label={addFormData.isCurrent ? 'Yes' : 'No'}
                            name="isCurrent"
                            checked={addFormData.isCurrent === 1}
                            onChange={handleCheckboxChange}
                        />
                    {/* </Form.Group> */}
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                        <Form.Label>Period<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          readOnly
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Period Time"
                          name='period'
                          value={addFormData.period}
                          disabled={addFormData.isCurrent == 1}
                        />
                      <Form.Control.Feedback type='invalid'>{showValidationError.time_to}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                      <Form.Label>Serial No<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark'
                          placeholder="Exp: 1"
                          name='serialNo'
                          value={addFormData.serialNo}
                          isInvalid={!!showValidationError.serial_no}
                          onChange={onChangeHandler}
                        />
                      <Form.Control.Feedback type='invalid'>{showValidationError.serial_no}</Form.Control.Feedback>
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

export default DoctorExperienceForm;
