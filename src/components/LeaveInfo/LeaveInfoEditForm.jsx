import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const basURL = import.meta.env.VITE_API_BASE_URL;


const LeaveInfoEditForm = ({
  setShowData,
  setDoctorLeave, //render for only id
  passEditFormData,
  setPassingEditFormData,
  existingDoctorLeave, //for duplicate check
  fetchItems  // render list Page
}) => {

  // console.log(passEditFormData);

  const [editFormData, setEditFormData] = useState({
    doctorId: '',
    specialityName: '',
    leaveTypeId: '',
    totalDay: '',
    leaveFrom: '',
    leaveTo: '',
    joinDate: '',
    remarks: '',
  })

  // console.log(editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctorSpeciality, setSelectedDoctorSpeciality] = useState('');
  const [selectedDoctorOption, setSelectedDoctorOption] = useState(null); //For React Select
  const [leaveLookupData, setLeaveLookupData] = useState(null); //React Select
  // console.log(leaveLookupData)

  const [showValidationError, setValidationErrors] = useState({
    doctor_name: '',
    leave_type: '',
    leave_from: '',      
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
        doctorId: passEditFormData.doctors_id || '',
        specialityName: passEditFormData.doctor?.speciality?.lookup_value || '',
        leaveTypeId: passEditFormData.leave_type.id || '',
        totalDay: passEditFormData.total_days || '',
        leaveFrom: passEditFormData.leave_from || '',
        leaveTo: passEditFormData.leave_to || '',
        joinDate: passEditFormData.join_date || '',
        remarks: passEditFormData.remarks || '',
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
      newFormData.doctorId = selectedOption.value;
      setEditFormData(newFormData);
      
      setSelectedDoctorSpeciality(selectedOption.speciality || '');
    } else {
      const newFormData = { ...editFormData };
      newFormData.doctorId = '';
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

    if (!editFormData.doctorId) {
      errors.doctor_name = "Leave is required.";
    }

     // Duplicate Check
    const isDuplicate = existingDoctorLeave.some(item =>
      item.doctors_id == editFormData.doctorId && item.id !== passEditFormData.id
    );

    if (isDuplicate) {
      errors.doctor_name = "This doctor already has leave.";
    }

    if (!editFormData.leaveTypeId) {
      errors.institute_name = "Leave Type is required.";
    }
    if (!editFormData.leaveFrom) {
      errors.dept_name = "Leave From Time is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

        const submitData = {
        doctors_id: editFormData.doctorId,
        leave_type_id: editFormData.leaveTypeId,
        total_days: editFormData.totalDay,
        leave_from: editFormData.leaveFrom,
        leave_to: editFormData.leaveTo,
        join_date: editFormData.joinDate,
        remarks: editFormData.remarks,
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/leave/update/${passEditFormData.id}`, {
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

        setDoctorLeave((prevLeave) =>
          prevLeave.map((leave) =>
            leave.id === response.data.id ? { ...leave, ...response.data } : leave
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
    if (editFormData.leaveFrom && editFormData.leaveTo) {
      const from = new Date(editFormData.leaveFrom);
      const to = new Date(editFormData.leaveTo);

      // convert ml secound
      const diffTime = to.getTime() - from.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 so both dates are inclusive

      setEditFormData((prev) => ({
        ...prev,
        totalDay: diffDays > 0 ? diffDays : 0,
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        totalDay: '',
      }));
    }
  }, [editFormData.leaveFrom, editFormData.leaveTo]);


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
              <div className='card-title'>Leave Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}leaveinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToLeaveList}>List</button>
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
                          value={selectedDoctorSpeciality || editFormData.specialityName}
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
                      value={leaveType.find(option => option.value === editFormData.leaveTypeId) || null}
                      placeholder="Search and Select Doctor"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.leave_type && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.leave_type}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Leave From<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="date"
                          className='border-dark'
                          name='leaveFrom'
                          value={editFormData.leaveFrom || ''}
                          isInvalid={!!showValidationError.leave_from}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.leave_from}</Form.Control.Feedback>
                      </Form.Group>
                      
                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Leave To<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="date"
                          className='border-dark'
                          name='leaveTo'
                          value={editFormData.leaveTo || ''}
                          isInvalid={!!showValidationError.to_date}
                          onChange={handleEditFormChange}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.to_date}</Form.Control.Feedback>
                      </Form.Group>
                </Row>

                 <Row>
                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Total Days<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          type="text"
                          className='border-dark readableInputBgColor'
                          name='totalDay'
                          placeholder="Total Days"
                          value={editFormData.totalDay || ''}
                          isInvalid={!!showValidationError.total_days}
                          readOnly 
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.total_days}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="2" controlId="validationCustom01" >
                        <Form.Label>Join Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="date"
                          className='border-dark'
                          name='joinDate'
                          value={editFormData.joinDate || ''}
                          isInvalid={!!showValidationError.join_date}
                          onChange={handleEditFormChange}

                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.join_date}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="8" controlId="validationCustom01" >
                        <Form.Label>Remarks<span className='text-danger ms-1'>*</span></Form.Label>
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

export default LeaveInfoEditForm;