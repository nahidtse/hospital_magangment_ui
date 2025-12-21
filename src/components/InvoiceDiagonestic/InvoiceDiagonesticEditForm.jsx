import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { intervalToDuration, format } from "date-fns";
import EditTestSelectFormTable from './EditTestSelectFormTable';
import EditTestCalculetion from './EditTestCalculetion';
const basURL = import.meta.env.VITE_API_BASE_URL;


const InvoiceDiagonesticEditForm = ({
  setShowData,
  setInvoiceMaster, //render for only id
  passEditFormData, //Edit data/id
  setPassingEditFormData,
  existingInvoice, //for duplicate check
  fetchItems  // render list Page
}) => {

  console.log("Initial", passEditFormData);

  const [editFormData, setEditFormData] = useState({
    invoiceNo: '',
    doctorId: '',
    doctorName: '',
    invoiceDate: '',
    referenceType: '',
    patientName: '',
    patientId: '',
    mobileNo: '',
    email: '',
    dob: '',
    ageYear: '',
    ageMonth: '',
    ageDay: '',
    address: '',
    test_id: '',
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: '',
    testList: [],
    totalAmount: '',
    discountPercent: '',
    discountAmount: '',
    serviceCharge: '',
    urgentCharge: '',
    vatPercent: '',
    vatAmount: '',
    advanceAmount: '',
    dueAmount: '',
    grossTotal: '',
  })

  console.log("Edit Form", editFormData)

  const [isHidden, setIsHidden] = useState([false]);

  const [doctorsInfo, setDoctorsInfo] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null); //For React Select
  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
  const [patientInfo, setPatientInfo] = useState([]); // Patient all get

  // console.log(doctorScheduleDays)

  const [showValidationError, setValidationErrors] = useState({
    doctor: '',
    patient_name: '',      
  });


  useEffect(() => {
    //Get React Select Intitial Value For Edit
      if(passEditFormData && doctorsInfo.length > 0) {
        const selectedDoctor = doctorsInfo.find(
          doctor => doctor.id == passEditFormData.doctor_id
        );

        if(selectedDoctor) {
          setSelectedDoctor ({
            value: selectedDoctor.id,
            label: selectedDoctor.doctor_name
          })
        }
      }
      setEditFormData({
        invoiceNo: passEditFormData.invoice_no || '',
        doctorId: passEditFormData.doctor_id || '',
        doctorName: passEditFormData.doctor_name || '',
        invoiceDate: passEditFormData.invoice_date ? new Date(passEditFormData.invoice_date) : null,
        referenceType: passEditFormData.doctor_ref || '',
        patientName: passEditFormData.patient_name || '',
        patientId: passEditFormData.patient_id || '',
        mobileNo: passEditFormData.mobile_no || '',
        email: passEditFormData.email || '',
        dob: passEditFormData.dob ? format(new Date(passEditFormData.dob), "dd-MM-yyyy") : '',
        ageYear: passEditFormData.age_year || '',
        ageMonth: passEditFormData.age_month || '',
        ageDay: passEditFormData.age_day || '',
        sex: passEditFormData.sex || '',
        address: passEditFormData.address || '',
        testList: passEditFormData.invoice_details?.map(item => ({
          id: item.id || '',
          test_id: item.test_id || '',
          quantity: item.quantity || '',
          baseAmount: item.test_info?.amount || "",
          test_code: item.test_info?.test_code || "",
          test_name: item.test_info?.test_name || "",
          room_no: item.test_info?.room_no || "",
          delivery_instruction: item.test_info?.delivery_instruction || "",
          amount: item.test_info?.amount || "",

        })),
        discountPercent:passEditFormData.dis_per || '',
        discountAmount:passEditFormData.dis_amount || '',
        serviceCharge:passEditFormData.ser_amount || '',
        urgentCharge:passEditFormData.urgent_amount || '',
        vatPercent:passEditFormData.vat_per || '',
        vatAmount:passEditFormData.vat_amount || '',
        advanceAmount:passEditFormData.adv_amount || '',
        dueAmount:passEditFormData.due_amount || '',
        grossTotal:passEditFormData.gross_total || '',
      });
  }, [passEditFormData, doctorsInfo]);


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
      if(editFormData.dob) {
        const age = ageCalculetor(editFormData.dob)

        setEditFormData(prev => ({
          ...prev,
            ageYear: age.years,
            ageMonth: age.months,
            ageDay: age.days,
        }))
      }
    }, [editFormData.dob])
   // -------------------------------
    // AGE CALCULATOR FUNCTION END
    // -------------------------------

  /**  
    * Module
    * TODO:: Optimize
   */
  //Get all Doctor's Start For React Select
    useEffect(() => {
      fetch(`${basURL}/doctors`)
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
      setEditFormData(prev => ({
        ...prev,
            doctorId: selected ? selected.value : '',  // doctor name (optional)
      }))
    }
  //Get all Doctor's End For React Select

  //Get all Patient start
    const fetchPatients = async() => {
      try {
        const response = await fetch(`${basURL}/patient`);
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

    // react-select Patient onChange handler
    const handlePatientSelect = (selectedPatient) => {
        if(!selectedPatient) {
          return;
        }

        if(selectedPatient) {
          const selectedPatientInfo  = patientInfo.find(patient => patient.id === selectedPatient.value);

          setEditFormData(prev => ({
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
  //Get all Patient end

  //Change Doctor Ref
    const changeRefarence = (e) => {
      const value = e.target.value
      // setReferenceType(value)

      setEditFormData(prev => ({
        ...prev,
        referenceType: value,
        doctorId: '',
        doctorName: ''
      }))

      // setSelectedDoctor(null);
    }

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {

      setEditFormData({
          ...editFormData,
          invoiceDate: selectedDate
      });
  };

  //Total Calculetion Start 
  useEffect(() => {
    const total = editFormData.testList.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    setEditFormData(prev => ({
      ...prev,
      totalAmount: total
    }));
  }, [editFormData.testList]);
 //Total Calculetion End

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if(!editFormData.doctorId && !editFormData.doctorName) {
      errors.doctor = "Doctor's Name Required"
    }

    if(!editFormData.patientName) {
      errors.patient_name = "Patient Name Required"
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
        const submitDataMaster = {
          invoice_date: format(editFormData.invoiceDate, "yyyy-MM-dd HH:mm:ss"),
          doctor_ref: editFormData.referenceType,
          doctor_id: editFormData.doctorId,
          doctor_name: editFormData.doctorName,
          patient_id: editFormData.patientId,
          patient_name: editFormData.patientName,
          mobile_no: editFormData.mobileNo,
          email: editFormData.email,
          dob: editFormData.dob,
          sex: editFormData.sex,
          age_year:editFormData.ageYear,
          age_month:editFormData.ageMonth,
          age_day:editFormData.ageDay,
          address: editFormData.address,
          dis_per: editFormData.discountPercent,
          dis_amount: editFormData.discountAmount,
          ser_amount: editFormData.serviceCharge,
          urgent_amount: editFormData.urgentCharge,
          vat_per: editFormData.vatPercent,
          vat_amount: editFormData.vatAmount,
          adv_amount: editFormData.advanceAmount,
          due_amount: editFormData.dueAmount,
          gross_total: editFormData.grossTotal,
          total_amount: editFormData.totalAmount,
        }

        const submitDataDelaits = {
          test_list: editFormData.testList,
        }

        const payload = {
          master: submitDataMaster,
          details: submitDataDelaits
        }

      console.log(payload)
      // return;

      const result = await fetch(`${basURL}/invoice_master/update/${passEditFormData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const response = await result.json();
      console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);

        setInvoiceMaster((prevInvoice) =>
          prevInvoice.map((invoice) =>
            invoice.id === response.data.id ? { ...invoice, ...response.data } : invoice
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
              <div className='card-title'>Invoice (Diagonestic) Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}invoicediagonestic/dataTable`}>
                  <button className="btn btn-sm btn-primary" onClick={goToLeaveList}>List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Col md={8}>
                    <Row className='mb-2'>
                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                            <Form.Label>Invoice No<span className='text-danger ms-1'>*</span></Form.Label>
                            <Form.Control
                              type="text"
                              className='border-dark readableInputBgColor'
                              readOnly
                              value={passEditFormData.invoice_no || ""}
                            />
                      </Form.Group>

                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Invoice Date<span className='text-danger ms-1'>*</span></Form.Label>

                        <InputGroup className="">
                              <div className="form-control border-dark">
                                <DatePicker
                                  className='border-0'
                                  selected={editFormData.invoiceDate}
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
                      </Form.Group>

                       <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Doctor's Reference's<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Select 
                            size="lg"
                            className={'border-dark'}
                            value={editFormData.referenceType}
                            onChange={changeRefarence}
                            aria-label="Select role"
                          >
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                          </Form.Select>

                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.doctor_name}</Form.Control.Feedback> */}
                      </Form.Group>  

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Doctor's Name<span className='text-danger ms-1'>*</span></Form.Label>
                          {editFormData.referenceType === "internal" ? 
                          (
                            <Select
                              styles={customStyles}
                              classNamePrefix="react-select"
                              className='border-dark'
                              options={doctorOptions || []}
                              value={selectedDoctor}
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
                              value={editFormData.doctorName}
                              isInvalid={!!showValidationError.doctor}
                              onChange={(e)=> setEditFormData (prev => ({ ...prev, doctorName: e.target.value }))}
                            />
                          )}
                        {showValidationError.doctor && (
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.doctor}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Row>

                    <Row className='mb-2'> 
                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Search (Mobile No + Name)<span className='text-danger ms-1'>*</span></Form.Label>
                        <Select
                          styles={customStyles} 
                          options={patientOptions}
                          classNamePrefix="react-select"
                          onChange={handlePatientSelect}
                          value={patientOptions.find(option => option.value === editFormData.patientId) || null}
                          placeholder="Select Name + Number"
                          isSearchable={true}
                          isClearable={true}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Control
                            className='border-dark readableInputBgColor'
                            value={editFormData.patientName || ''}
                            placeholder="Patient Name"
                            readOnly
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
                            value={editFormData.mobileNo || ''}
                            placeholder="Mobile No"
                            readOnly
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
                            value={editFormData.email || ''}
                            readOnly
                          />
                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.email}</Form.Control.Feedback> */}
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
                            value={editFormData.dob || ''}
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.dob}</Form.Control.Feedback>
                      </Form.Group> 

                      <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Age (Year | Month | Day)<span className='text-danger ms-1'></span></Form.Label>
                          <InputGroup className="mb-3 input-group-dark">
                                <Form.Control aria-label="First name" value={editFormData.ageYear || '00'} className='readableInputBgColor' readOnly tabIndex={-1}/>
                                <Form.Control aria-label="Last name" value={editFormData.ageMonth || '00'} className='readableInputBgColor' readOnly tabIndex={-1}/>
                                <Form.Control aria-label="Last name" value={editFormData.ageDay || '00'} className='readableInputBgColor' readOnly tabIndex={-1}/>
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
                            value={editFormData.sex || ''}
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
                            value={editFormData.address || ''}
                            readOnly
                            tabIndex={-1}
                          />
                        <Form.Control.Feedback type='invalid'>{showValidationError.address}</Form.Control.Feedback>
                      </Form.Group>             
                    </Row>   

                    <EditTestSelectFormTable 
                      editFormData = {editFormData}
                      setEditFormData = {setEditFormData}
                      customStyles={customStyles}
                      showValidationError= {showValidationError}
                    />

                  </Col> 

                  <Col md={4}>
                     <EditTestCalculetion editFormData={editFormData} setEditFormData={setEditFormData}/>
                  </Col>   
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

export default InvoiceDiagonesticEditForm;