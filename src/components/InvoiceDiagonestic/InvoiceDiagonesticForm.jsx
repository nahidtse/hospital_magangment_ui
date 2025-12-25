import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, NavItem, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import {PatientInfoModal} from './PatientInfoModal'
import {intervalToDuration, format } from "date-fns";
import TestCalculetion from './TestCalculetion';
import TestSelectFormTable from './TestSelectFormTable';
import InvoicePrint from './InvoicePrint';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const InvoiceDiagonesticForm = () => {

  //---------------Auto Focus Start----------------
  const referenceSelectRef = useRef(null);  //For auto fucus
  // Component mount then focus 
  useEffect(() => {
    // small timeout for render then focus
    const timer = setTimeout(() => {
      if (referenceSelectRef.current) {
        referenceSelectRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  //---------------Auto Focus End----------------

  const [showValidationError, setValidationErrors] = useState({
    doctor: '',
    patient_name: '',
    test_id: ''
  });

  const [addFormData, setFormData] = useState({
    invoiceDate: new Date(),
    referenceType: 'internal',
    doctorId: '',
    doctorName: '',
    patientId: '',
    patientName: '',
    mobileNo: '',
    email: '',
    dob: null,
    sex: '',
    age: { years: '', months: '', days: '' }, //for age calculetor
    address: '',
    testId: '',
    testCode: '',
    testName: '',
    deliveryInstruction: '',
    roomNo: '',
    amount: '',
    testListStor: [],
    discountPercent: '',
    discountAmount: '',
    serviceCharge: '',
    urgentCharge: '',
    vatPercent: '',
    vatAmount: '',
    advanceAmount: '',
    dueAmount: '',
    grossTotal: '',
    totalAmount: '',
    activity_type_id: '',
    mr_amount: ''
  })

  console.log(addFormData)

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); //React Select--CreatableSelect
  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
  const [patientInfo, setPatientInfo] = useState([]); // Patient all get
  const [modalShow, setModalShow] = useState(false);  //Patient's Info Modal
  const [resInvoiceData, setResInvoiceData] = useState(null);  //Patient's Info Modal
  const [isSubmitting, setIsSubmitting] = useState(false);  // For Submit button Dubble click control
  // console.log(resInvoiceData)

  // react-select Patient onChange handler
  const handlePatientSelect = (selectedPatient) => {
      if(!selectedPatient) {
        return;
      }

      if(selectedPatient) {
        const selectedPatientInfo  = patientInfo.find(patient => patient.id === selectedPatient.value);

        setFormData(prev => ({
          ...prev,
  
          patientId: selectedPatientInfo .id,
          patientName: selectedPatientInfo .patient_name,
          mobileNo: selectedPatientInfo .mobile_no,
          email: selectedPatientInfo .email || '',
          dob: selectedPatientInfo .dob || '',
          sex: selectedPatientInfo .sex || '',
          address: selectedPatientInfo .address || ''
        }))
      }

  }

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {

      setFormData({
          ...addFormData,
          invoiceDate: selectedDate
      });
  };


  //Clear Input
  const clearInput = {
    invoiceDate: new Date(),
    referenceType: 'internal',
    doctorId: '',
    doctorName: '',
    patientId: '',
    patientName: '',
    mobileNo: '',
    email: '',
    dob: null,
    sex: '',
    age: { years: '', months: '', days: '' },
    address: '',
    testId: '',
    testCode: '',
    testName: '',
    deliveryInstruction: '',
    roomNo: '',
    amount: '',
    testListStor: [],
    discountPercent: '',
    discountAmount: '',
    serviceCharge: '',
    urgentCharge: '',
    vatPercent: '',
    vatAmount: '',
    advanceAmount: '',
    dueAmount: '',
    grossTotal: '',
    totalAmount: '',
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return; // prevent double submit
      setIsSubmitting(true)

    const errors = {};

    if(!addFormData.doctorId && !addFormData.doctorName) {
      errors.doctor = "Doctor's Name Required"
    }

    if(addFormData.testListStor.length === 0) {
      errors.test_id = "Minimum One Test Required"
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {

      const submitDataMaster = {
        invoice_date: format(addFormData.invoiceDate, "yyyy-MM-dd HH:mm:ss"),
        doctor_ref: addFormData.referenceType,
        doctor_id: addFormData.doctorId,
        doctor_name: addFormData.doctorName,
        patient_id: addFormData.patientId,
        patient_name: addFormData.patientName,
        mobile_no: addFormData.mobileNo,
        email: addFormData.email,
        dob: addFormData.dob,
        sex: addFormData.sex,
        age_year:addFormData.age.years,
        age_month:addFormData.age.months,
        age_day:addFormData.age.days,
        address: addFormData.address,
        dis_per: addFormData.discountPercent,
        dis_amount: addFormData.discountAmount,
        ser_amount: addFormData.serviceCharge,
        urgent_amount: addFormData.urgentCharge,
        vat_per: addFormData.vatPercent,
        vat_amount: addFormData.vatAmount,
        adv_amount: addFormData.advanceAmount,
        due_amount: addFormData.dueAmount,
        gross_total: addFormData.grossTotal,
        total_amount: addFormData.totalAmount,
      }

      const submitDataDelaits = {
        test_list: addFormData.testListStor,
      }

      const submitDataMoneyReceipt = {
        activity_type_id: addFormData.activity_type_id,
        mr_amount: addFormData.mr_amount,
        money_receipt_date: format(addFormData.invoiceDate, "yyyy-MM-dd HH:mm:ss"),
        patient_id: addFormData.patientId,
      }

      const payload = {
        master: submitDataMaster,
        details: submitDataDelaits,
        moneyReceipt: submitDataMoneyReceipt
      }

      console.log(payload)
      // return;

      const result = await fetch(`${baseURL}/invoice_master/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const response = await result.json();
      console.log(response)
      // return
      
      if (response.status == 'success') {
        toast.success(response.message);
        setResInvoiceData(response.data)
        console.log(response.data)
        // Clear formd
        setFormData(clearInput)
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

    } finally {
    setIsSubmitting(false);
  }

  }

  const resetHandling = () => {
    setFormData(clearInput);
    setValidationErrors({}) //Validation Errors Clear
  }

  /**  
   * Module
   * TODO:: Optimize
  */
  useEffect(() => {
    fetch(`${baseURL}/doctors`)
      .then((response) => response.json())
      .then((data) => {
        setDoctorsInfo(data.data);
      })
  }, []);

 // Helper Function: doctorsInfo convert to react-select option
 const doctorOptions = doctorsInfo.map(doctor => ({
   value: doctor.id,
   label: `${doctor.doctor_name} (${doctor.bmdc_no})`,
  }));

  const onChangeDoctorSelect = (selected) => {
    setSelectedDoctor(selected);
    setFormData(prev => ({
      ...prev,
          doctorId: selected ? selected.value : '',  // doctor name (optional)
    }))
  }

  const changeRefarence = (e) => {
    const value = e.target.value
    // setReferenceType(value)

    setFormData(prev => ({
      ...prev,
      referenceType: value,
      doctorId: '',
      doctorName: ''
    }))

    setSelectedDoctor(null);
  }


 //Get all Patient start
  const fetchPatients = async() => {
    try {
      const response = await fetch(`${baseURL}/patient`);
      const data = await response.json();
      setPatientInfo(data.data || []);
    }  catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, [])

 // Helper Function: doctorsInfo convert to react-select option
 const patientOptions = patientInfo.map(patient => ({
   value: patient.id,
   label: `${patient.patient_name} (${patient.mobile_no})`,
  }));
  //Get all Patient end

   // -------------------------------
    // AGE CALCULATOR FUNCTION START
    // -------------------------------
    const ageCalculetor = (dob) => {
        if (!dob) return { years: '', months: '', days: '' };

        const birthDate = dob instanceof Date ? dob : new Date(dob); //Convert String to Object
        const today = new Date();

        const duration = intervalToDuration({
            start: birthDate,
            end: today,
        });

        return {
            years: duration.years,
            months: duration.months,
            days: duration.days,
        }
    }

    useEffect(() => {
      if(addFormData.dob) {
        const age = ageCalculetor(addFormData.dob)

        setFormData(prev => ({
          ...prev,
          age: age,
        }))
      }
    }, [addFormData.dob])
   // -------------------------------
    // AGE CALCULATOR FUNCTION END
    // -------------------------------


  //Total Calculetion Start 
  const totalAmount = addFormData.testListStor.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalAmount: totalAmount
    }));
  }, [totalAmount]);
 //Total Calculetion End

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
              <div className='card-title'>New Invoice (Diagonestic)</div>
              <div className="prism-toggle">

                <Fragment>    
                    <Button className="btn btn-sm btn-info me-2" onClick={() => setModalShow(true)}>
                        Registetion
                    </Button>
                    <PatientInfoModal show={modalShow} onSubmit={()=> fetchPatients()} onHide={() => setModalShow(false)} />               
                </Fragment>

                <Link to={`${import.meta.env.BASE_URL}invoicediagonestic/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form 
                noValidate 
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  const activeEl = document.activeElement;

                  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {

                    // Allow Enter on submit button
                    if (activeEl?.type === "submit") {
                      return;
                    }

                    // Allow Enter on Add button
                    if (activeEl?.tagName === "BUTTON" && activeEl?.type === "button") {
                      return;
                    }

                    // Otherwise block Enter
                    e.preventDefault();
                  }
                }}
              >
                <Row>
                  <Col md="8">

                    <Row className="mb-2">
                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Invoice No<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control 
                          name="testName"
                          className='border-dark readableInputBgColor'
                          readOnly
                          tabIndex={-1}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Invoice Date<span className='text-danger ms-1'>*</span></Form.Label>
                          <InputGroup className="">
                              <div className="form-control border-dark p-1">
                                <DatePicker
                                  style={{width: '70px'}}
                                  className='border-0'
                                  selected={addFormData.invoiceDate || ''}
                                  dateFormat="dd-MM-yyyy"
                                  onChange={handleFromDateChange}
                                  open={isOpenDate}
                                  minDate={new Date()}
                                  onClickOutside={() => setIsOpenDate(false)}
                                  tabIndex={-1}
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

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Doctor's Reference's<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Select
                            ref={referenceSelectRef}  
                            size="lg"
                            className={'border-dark'}
                            value={addFormData.referenceType}
                            onChange={changeRefarence}
                            aria-label="Select role"
                            tabIndex={1}
                            autoFocus 
                          >
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                          </Form.Select>

                        <Form.Control.Feedback type='invalid'>{showValidationError.doctor_name}</Form.Control.Feedback>
                      </Form.Group>      

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Doctor's Name<span className='text-danger ms-1'>*</span></Form.Label>
                          {addFormData.referenceType === "internal" ? 
                          (
                            <Select
                              styles={customStyles}
                              classNamePrefix="react-select"
                              className='border-dark'
                              options={doctorOptions || []}
                              value={doctorOptions.find(option => option.value === addFormData.doctorId) || null}
                              placeholder={"Search Doctor's"}
                              onChange={onChangeDoctorSelect}
                              isSearchable={true}
                              isClearable={true}
                              tabIndex={2}
                            />
                          ) : (
                            <Form.Control
                              required
                              type="text"
                              className='border-dark'
                              placeholder="Enter Doctor name"
                              name='doctorName'
                              value={addFormData.doctorName}
                              isInvalid={!!showValidationError.doctor}
                              onChange={(e)=> setFormData (prev => ({ ...prev, doctorName: e.target.value }))}
                              tabIndex={2}
                            />
                          )}
                        {showValidationError.doctor && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.doctor}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>              
                    </Row>

                    <Row className="mb-2">
                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Search (Mobile No + Name)<span className='text-danger ms-1'>*</span></Form.Label>
                        <Select
                          styles={customStyles} 
                          options={patientOptions}
                          classNamePrefix="react-select"
                          className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                          onChange={handlePatientSelect}
                          value={patientOptions.find(option => option.value === addFormData.patientId) || null}
                          placeholder="Select Name + Number"
                          isSearchable={true}
                          isClearable={true}
                          tabIndex={3}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            className='border-dark readableInputBgColor'
                            value={addFormData.patientName || ''}
                            placeholder="Patient Name"
                            readOnly
                            tabIndex={-1}
                          />

                        {showValidationError.patient_name && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.patient_name}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group> 

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Mobile No<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            type="text"
                            className='border-dark readableInputBgColor'
                            value={addFormData.mobileNo || ''}
                            placeholder="Mobile No"
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.mobile_no}</Form.Control.Feedback>
                      </Form.Group>      

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Email Address<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            required
                            type="text"
                            className='border-dark readableInputBgColor'
                            placeholder='Email Address'
                            value={addFormData.email || ''}
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.email}</Form.Control.Feedback>
                      </Form.Group>              
                    </Row>

                    <Row className="mb-2">
                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Date Of Birth<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            required
                            type="text"
                            className='border-dark readableInputBgColor'
                            placeholder='Date of birth'
                            value={addFormData.dob || ''}
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.dob}</Form.Control.Feedback>
                      </Form.Group> 

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Age (Year | Month | Day)<span className='text-danger ms-1'></span></Form.Label>
                          <InputGroup className="mb-3 input-group-dark">
                                <Form.Control aria-label="First name" value={addFormData.age.years || '00'} className='readableInputBgColor' readOnly tabIndex={-1}/>
                                <Form.Control aria-label="Last name" value={addFormData.age.months || '00'} className='readableInputBgColor' readOnly tabIndex={-1}/>
                                <Form.Control aria-label="Last name" value={addFormData.age.days || '00'} className='readableInputBgColor' readOnly tabIndex={-1}/>
                            </InputGroup>
                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                      </Form.Group> 

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Sex<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            required
                            type="text"
                            className='border-dark readableInputBgColor'
                            placeholder='Sex'
                            value={addFormData.sex}
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.sex}</Form.Control.Feedback>
                      </Form.Group>        

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Address<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            required
                            as='textarea'
                            rows={2}
                            className='border-dark readableInputBgColor'
                            placeholder='Address'
                            value={addFormData.address}
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.address}</Form.Control.Feedback>
                      </Form.Group>             
                    </Row>


                    <TestSelectFormTable 
                        addFormData={addFormData}
                        setFormData={setFormData}
                        customStyles={customStyles}
                        showValidationError={showValidationError}
                        totalAmount={totalAmount}
                    />

                  </Col>

                  <Col md="4">
                      <TestCalculetion
                        customStyles = {customStyles} 
                        totalAmount={totalAmount} 
                        addFormData={addFormData} 
                        setFormData={setFormData}
                      />
                  </Col>

                </Row>

                <Row className='mb-3'>
                  
                </Row>
                
                <div className='d-flex justify-content-end'>
                  <button type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling} tabIndex={-1}>Reset</button>
                  <Button type="submit" tabIndex={14} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>

      {resInvoiceData && (
        <div style={{display: 'none'}}>
          <InvoicePrint 
            resInvoiceData = {resInvoiceData}
            onDone = {()=> setResInvoiceData(null)}
          />
        </div>
      )} 
    </Fragment>
  );
};

export default InvoiceDiagonesticForm;
