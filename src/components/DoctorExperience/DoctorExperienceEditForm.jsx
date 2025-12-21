import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const basURL = import.meta.env.VITE_API_BASE_URL;

const DoctorExperienceEditForm = ({
  setShowData,
  setDoctorExperience, //render for only id
  passEditFormData,
  setPassingEditFormData,
  existingDoctorExperience, //for duplicate check
  fetchItems  // render list Page
}) => {

  // console.log(passEditFormData);

  const [editFormData, setEditFormData] = useState({
    doctorsId: '',
    instituteId: '',
    designationId: '', 
    departmentId: '',
    fromDate: '',
    toDate: '',      
    period: '',      
    isCurrent: '',      
    serialNo: '',
  })

  console.log(editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState('');
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //For React Select
  const [itLookupData, setItLookupData] = useState([]);
  const [desigLookupData, setDesigLookupData] = useState([]);
  const [deptLookupData, setDeptLookupData] = useState([]);
  // console.log(deptLookupData)

  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    specialityName: '',
    institute_name: '',
    desg_name: '', 
    dept_name: '',
    from_date: '',
    toDate: '',      
    period: '',      
    isCurrent: '',      
    serial_no: '',      
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
        instituteId: passEditFormData.institute_id || '',
        designationId: passEditFormData.desig_id || '',
        departmentId: passEditFormData.dept_id || '',
        fromDate: passEditFormData.from_date || '',
        toDate: passEditFormData.to_date || '',
        period: passEditFormData.period || '',
        isCurrent: passEditFormData.is_current ?? 0,
        serialNo: passEditFormData.serial_no || '',
      });
    }
  }, [passEditFormData, doctorsInfo]);

  /**  
    * Module
    * TODO:: Optimize
   */
  useEffect(() => {
    fetch(`${basURL}/doctors`)
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

    if (!editFormData.instituteId) {
      errors.institute_name = "Institute is required.";
    }
    if (!editFormData.departmentId) {
      errors.dept_name = "Department Time is required.";
    }
    if (!editFormData.designationId) {
      errors.desg_name = "Designation is required.";
    }
    if (!editFormData.serialNo) {
      errors.serial_no = "Serial no is required.";
    }
    if (!editFormData.fromDate) {
      errors.from_date = "From date is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

        const submitData = {
        doctors_id: editFormData.doctorsId,
        institute_id: editFormData.instituteId,
        desig_id: editFormData.designationId,
        dept_id: editFormData.departmentId,
        from_date: editFormData.fromDate,
        to_date: editFormData.toDate,
        period: editFormData.period,
        is_current: editFormData.isCurrent,
        serial_no: editFormData.serialNo,
      }

      console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/experience/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);

        setDoctorExperience((prevDoctorExperience) =>
          prevDoctorExperience.map((experience) =>
            experience.id === response.data.id ? { ...experience, ...response.data } : experience
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

  //react select without doctor,s react select
  const reactSelectChange = (seletedOption, actionMeta) => {
      const name = actionMeta.name;

      setEditFormData(prev => ({
        ...prev,
        [name]: seletedOption ? seletedOption.value : ''
      }));
  }

  // Date minus function
  useEffect(() => {
    if (editFormData.fromDate && editFormData.toDate) {
      const from = new Date(editFormData.fromDate);
      const to = new Date(editFormData.toDate);

      // শুধু year difference
      const years = to.getFullYear() - from.getFullYear();

      setEditFormData((prev) => ({
        ...prev,
        period: years >= 0 ? years : 0, // negative হলে 0
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        period: '',
      }));
    }
  }, [editFormData.fromDate, editFormData.toDate]);

  //checkbox function 
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setEditFormData((prev) => ({
        ...prev,
        isCurrent: checked ? 1 : 0,
        toDate: checked ? '' : prev.toDate,  
        period: checked ? '' : prev.period,   
      }));
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

  const goToDoctorExperienceList = () => {
    setShowData(false);
    setPassingEditFormData(null);

  };

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Doctor Experience Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}doctorexperience/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToDoctorExperienceList}>List</button>
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

                  <Form.Group as={Col} md="2" controlId="validationCustom01">
                        <Form.Label>Speciality <span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          readOnly
                          value={selectedDoctorSpeciality || editFormData.specialityName}
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
                      value={instituteType.find(option => option.value === editFormData.instituteId) || null}
                      placeholder="Search and Select Doctor"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.institute_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.institute_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Designation<span className='text-danger ms-1'>*</span></Form.Label>

                    <Select 
                      styles={customStyles}
                      name="designationId"
                      options={designationType}
                      className={`react-select-container ${showValidationError.desg_name ? 'is-invalid' : ''}`}
                      onChange={reactSelectChange}
                      value={designationType.find(option => option.value === editFormData.designationId) || null}
                      placeholder="Search and Select Doctor"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.desg_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.desg_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom02">
                    <Form.Label>Department<span className='text-danger ms-1'>*</span></Form.Label>

                    <Select 
                      styles={customStyles}
                      name="departmentId"
                      options={departmentType}
                      className={`react-select-container ${showValidationError.dept_name ? 'is-invalid' : ''}`}
                      onChange={reactSelectChange}
                      value={departmentType.find(option => option.value === editFormData.departmentId) || null}
                      placeholder="Search and Select Doctor"
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
                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>From Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="date"
                          className='border-dark'
                          name='fromDate'
                          value={editFormData.fromDate}
                          isInvalid={!!showValidationError.from_date}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.from_date}</Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>To Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="date"
                          className='border-dark'
                          name='toDate'
                          value={editFormData.toDate}
                          isInvalid={!!showValidationError.to_date}
                          onChange={handleEditFormChange}
                          disabled={editFormData.isCurrent == 1}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.to_date}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Form.Label>is_current <span className='text-danger ms-1'></span></Form.Label>
                        <Form.Check
                          type="checkbox"
                          label={editFormData.isCurrent ? 'Yes' : 'No'}
                          name="isCurrent"
                          checked={!!editFormData.isCurrent}
                          onChange={handleCheckboxChange}
                        />
                    </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Period<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          name='period'
                          placeholder="Period Time"
                          value={editFormData.period}
                          isInvalid={!!showValidationError.period}
                          readOnly 
                          disabled={editFormData.isCurrent == 1}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.period}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Serial No<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark'
                          name='serialNo'
                          placeholder='Exp: 1'
                          value={editFormData.serialNo}
                          isInvalid={!!showValidationError.serial_no}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.serial_no}</Form.Control.Feedback>
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

export default DoctorExperienceEditForm;