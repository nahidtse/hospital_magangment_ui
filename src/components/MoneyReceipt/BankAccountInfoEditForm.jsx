import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
const basURL = import.meta.env.VITE_API_BASE_URL;


const BankAccountInfoEditForm = ({
  setShowData,
  setBankAccountInfo, //render for only id
  passEditFormData, //Edit data/id
  setPassingEditFormData,
  existingBankAccount, //for duplicate check
  fetchItems  // render list Page
}) => {

  // console.log(passEditFormData);

  const [editFormData, setEditFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    openingDate: new Date(),
    openingBalance: '',
    businessUnit: '',
    routeNo: '',
    status: ''
  })

  console.log(editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
  // console.log(doctorScheduleDays)

  const [showValidationError, setValidationErrors] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    branchName: '',
    openingDate: null,
    openingBalance: '',
    businessUnit: '',
    routeNo: '',
    status: ''      
  });


  useEffect(() => {
    //get React select initial value  
    if (passEditFormData && doctorsInfo.length > 0) {
      const selectedDoctor = doctorsInfo.find(
        doctor => doctor.id === passEditFormData.doctors_id
      );

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


   // react-select doctor's  onChange handler
  const handleDoctorChange = (selectedOption) => {
    
    if (selectedOption) {
      const newFormData = { ...editFormData };
      newFormData.doctorId = selectedOption.value;
      setEditFormData(newFormData);
      
      fetchDoctorSchedule(selectedOption.value) // for doctor schedule api call

    } else {
      const newFormData = { ...editFormData };
      newFormData.doctorId = '';
      setEditFormData(newFormData);
    }
  };

  const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
   speciality: doctor.speciality?.lookup_value 
  }));

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {
    setEditFormData({
        ...editFormData,
        openingDate: selectedDate
    });

  };


  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    // if (!editFormData.bankName) {
    //   errors.bankName = "Bank name is required.";
    // }
    


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {  
        const submitData = {
          account_name: editFormData.accountName,
          account_number: editFormData.accountNumber,
          bank_name: editFormData.bankName,
          branch_name: editFormData.branchName,
          opening_date: format(editFormData.openingDate, "yyyy-MM-dd"),
          opening_balance: editFormData.openingBalance,
          business_unit: editFormData.businessUnit,
          route_no: editFormData.routeNo,
          status: editFormData.status,
        }

      console.log(submitData)
      return;

      const result = await fetch(`${basURL}/appointment/update/${passEditFormData.id}`, {
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

        setBankAccountInfo((prevBankAccountInfo) =>
          prevBankAccountInfo.map((account) =>
            account.id === response.data.id ? { ...account, ...response.data } : account
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

  const goToBankAccountInfoList = () => {
    setShowData(false);
    setPassingEditFormData(null);

  };

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Bank Account Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}moneyreceipt/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToBankAccountInfoList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Account Name<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type patient name'
                        name='accountName'
                        value={editFormData.accountName}
                        isInvalid={!!showValidationError.accountName}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.accountName}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Account Number<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Your Account Name'
                        name='accountNumber'
                        value={editFormData.accountNumber}
                        isInvalid={!!showValidationError.accountNumber}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.accountNumber}</Form.Control.Feedback>
                  </Form.Group> 

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Bank Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles} 
                      name="doctorId"
                      // options={doctorOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      // onChange={handleDoctorChange}
                      // value={selectedDoctorOption}
                      placeholder="Select Bank"
                      isSearchable={true}
                      isClearable={true}
                    />

                    {showValidationError.bankName && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.bankName}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>              
                </Row>

                <Row className='mt-2'>
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Branch Name<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Branch Name'
                        name='branchName'
                        value={editFormData.branchName}
                        isInvalid={!!showValidationError.branchName}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.branchName}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Opening Date<span className='text-danger ms-1'></span></Form.Label>
                      <InputGroup className="">
                          <div className="form-control border-dark">
                            <DatePicker
                              className='border-0'
                              selected={editFormData.openingDate}
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

                    {showValidationError.openingDate && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.openingDate}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group> 

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Opening Balance<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Opening Balance'
                        name='openingBalance'
                        value={editFormData.openingBalance}
                        isInvalid={!!showValidationError.openingBalance}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.openingBalance}</Form.Control.Feedback>
                  </Form.Group> 
                </Row>

                <Row className='mt-2'>
                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Business Unit<span className='text-danger ms-1'></span></Form.Label>
                    <Select
                      styles={customStyles} 
                      name="doctorId"
                      // options={doctorOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      // onChange={handleDoctorChange}
                      // value={selectedDoctorOption}
                      placeholder="Search and Select Business Unit"
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
                      <Form.Label>Route No<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Route No'
                        name='routeNo'
                        value={editFormData.routeNo}
                        isInvalid={!!showValidationError.routeNo}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.routeNo}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>
                    
                    <Form.Group controlId="tickCheckbox">
                        <Form.Check
                          type="checkbox"
                          label={editFormData.status ? 'active' : 'Deactive'}
                          name="status"
                          checked={editFormData.status === 1}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.target.checked ? 1 : 0,
                            })
                          }
                        />
                    </Form.Group>
                    <Form.Control.Feedback type='invalid'>{showValidationError.status}</Form.Control.Feedback>
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

export default BankAccountInfoEditForm;