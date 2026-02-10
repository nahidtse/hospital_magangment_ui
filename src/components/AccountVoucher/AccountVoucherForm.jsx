import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const AccountVoucherForm = () => {

  const location = useLocation();
  const stateTestInfo = location.state?.testInfo;  //For Duplicate Check

  //-----------Focus Input Start-----------------------------------
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
  //-----------Focus Input End-----------------------------------  

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
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: ''
  });

  const [rows, setRows] = useState([]); // জমা হওয়া ডাটাগুলো এখানে থাকবে

  const [addFormData, setFormData] = useState({
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: '',
    account: null,
    acSource: null,
    acSourceName: null,
    drAmount: '',
    crAmount: ''
  })

  // console.log(addFormData)

  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
   //New Start
  const [attachments, setAttachments] = useState([
    { title: '', file: null }
  ]);

  const addAttachmentRow = () => {
    setAttachments([...attachments, { title: '', file: null }]);
  };

  const handleAttachmentChange = (index, field, value) => {
    const updated = [...attachments];
    updated[index][field] = value;
    setAttachments(updated);
  };

  const removeAttachmentRow = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  //New End

  const handleAddRow = () => {
    if ((!addFormData.drAmount && !addFormData.crAmount)) {
      toast.error("Please select an account!");
      return;
    }
    
    // নতুন ডাটা অ্যারেতে যোগ করা
    setRows([...rows, { ...addFormData, id: Date.now() }]);

    // ইনপুট ফিল্ডগুলো খালি করে দেওয়া
    setFormData({
      account: null,
      acSource: null,
      acSourceName: null,
      drAmount: '',
      crAmount: ''
    });
  };


  const onChangeHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;


    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }


  //Inpute Clear Function
  const inputClear = {
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: ''
  }

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {
      const formattedDate = selectedDate.toISOString().split("T")[0]; //only date find

      // setFormData({
      //     ...addFormData,
      //     appointmentDate: formattedDate
      // });

  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    const inputCode = addFormData.test_code.trim().toLowerCase();
    const inputName = addFormData.test_name.trim().toLowerCase();

    if (!inputCode) {
      errors.test_code = "Test Code is Required.";
    }

    if (!inputName) {
      errors.test_name = "Test Name is required.";
    }
    
    if (!addFormData.amount) {
      errors.amount = "Amount is required.";
    }

    if (isNaN(addFormData.amount)) {
      errors.amount = "Amount must be a number.";
    }

    // DUPLICATE CHECK
    const isDuplicateCode = stateTestInfo.some(item =>
      item.test_code?.trim().toLowerCase() === inputCode
    );
    const isDuplicateName = stateTestInfo.some(item =>
      item.test_name?.trim().toLowerCase() === inputName
    );

    if (isDuplicateCode) {
      errors.test_code = "This Test Code Already Exists!";
    }

    if (isDuplicateName) {
      errors.test_name = "This Test Name Already Exists!";
    }

    // STOP HERE
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {

      const submitData = {
        test_code: addFormData.test_code,
        test_name: addFormData.test_name,
        delivery_instruction: addFormData.delivery_instruction,
        room_no: addFormData.room_no,
        amount: addFormData.amount
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/testinfo/create`, {
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
        toast.success(response.message, {autoClose: 1000});

        // Clear formd
        setFormData(inputClear);
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
    setFormData(inputClear);
    setValidationErrors({}) //Validation Errors Clear
  }




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

  const customStylesForTable = {
    control: (base) => ({
      ...base,
      minHeight: '32px',
      height: '32px',
      fontSize: '0.8rem',
      borderColor: '#000',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 6px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '32px',
    }),
  };





  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Account Voucher</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}testinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form 
               noValidate 
               onSubmit={handleSubmit}
               onKeyDown={(e) => {
                  const activeEl = document.activeElement; // active element define
                  if (e.key === "Enter" && e.target.tagName !== 'TEXTAREA') {
                    if (activeEl && activeEl.type === "submit") {
                      return; 
                    } else {
                      e.preventDefault();
                    }
                  }
               }}
              >
                <Row className='mb-2'>

                  <Col md="4" className='border border-2 py-2 px-4' style={{ borderColor: '#CCCCCC' }}>
                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                      <Form.Label>Voucher Date<span className='text-danger ms-1'>*</span></Form.Label>
                        <InputGroup className="">
                            <div className="form-control border-dark">
                              <DatePicker
                                className='border-0'
                                // selected={addFormData.appointmentDate}
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

                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                      <Form.Label>Voucher Type<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                        styles={customStyles} 
                        classNamePrefix="react-select"
                        // options={doctorOptions}
                        // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                        // onChange={handleDoctorChange}
                        // value={selectedDoctorOption}
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

                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                      <Form.Label>Voucher No<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark readableInputBgColor'
                        placeholder="Enter Test name"
                        // value={addFormData.test_name}
                        readOnly
                      />
                      <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                    </Form.Group>              

                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                      <Form.Label>Location<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                        styles={customStyles} 
                        classNamePrefix="react-select"
                        // options={doctorOptions}
                        // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                        // onChange={handleDoctorChange}
                        // value={selectedDoctorOption}
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

                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                      <Form.Label>Payment Type<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                        styles={customStyles} 
                        classNamePrefix="react-select"
                        // options={doctorOptions}
                        // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                        // onChange={handleDoctorChange}
                        // value={selectedDoctorOption}
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

                    <Form.Group as={Col} md="12" controlId="validationCustom05">
                        <Form.Label>Paid To<span className='text-danger'> *</span> </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark'
                          placeholder="Enter Amount"
                          name='amount'
                          value={addFormData.amount}
                          isInvalid={!!showValidationError.amount}
                          onChange={onChangeHandler}
                          tabIndex={5}
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.amount}</Form.Control.Feedback>
                     </Form.Group>

                    <Form.Group as={Col} md="12" controlId="validationCustom02">
                      <Form.Label>Through<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                        styles={customStyles} 
                        classNamePrefix="react-select"
                        // options={doctorOptions}
                        // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                        // onChange={handleDoctorChange}
                        // value={selectedDoctorOption}
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
                  </Col>

                  <Col md="4" className='border border-2 py-2 px-4' style={{ borderColor: '#CCCCCC' }}>
                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Business Unit<span className='text-danger ms-1'>*</span></Form.Label>
                        <Select
                          styles={customStyles} 
                          classNamePrefix="react-select"
                          // options={doctorOptions}
                          // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                          // onChange={handleDoctorChange}
                          // value={selectedDoctorOption}
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

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Priode Name<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Voucher Amount<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="12" controlId="validationCustom05">
                        <Form.Label>Voucher Source<span className='text-danger'> *</span> </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.amount}</Form.Control.Feedback>
                     </Form.Group> 

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Voucher Source Link<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Voucher Status<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Approval Code<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>
                  </Col>

                  <Col md="4" className='border border-2 py-2 px-4' style={{ borderColor: '#CCCCCC' }}>
                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Bank Account<span className='text-danger ms-1'>*</span></Form.Label>
                        <Select
                          styles={customStyles} 
                          classNamePrefix="react-select"
                          // options={doctorOptions}
                          // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                          // onChange={handleDoctorChange}
                          // value={selectedDoctorOption}
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

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Cheque No<span className='text-danger ms-1'>*</span></Form.Label>
                        <Select
                          styles={customStyles} 
                          classNamePrefix="react-select"
                          // options={doctorOptions}
                          // className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                          // onChange={handleDoctorChange}
                          // value={selectedDoctorOption}
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

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Cheque Date<span className='text-danger ms-1'>*</span></Form.Label>
                          <InputGroup className="">
                              <div className="form-control border-dark">
                                <DatePicker
                                  className='border-0'
                                  // selected={addFormData.appointmentDate}
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

                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Cheque Amount<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Is Posted?<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} md="12" controlId="validationCustom02">
                        <Form.Label>Is Reconciled?<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                          required
                          type="text"
                          className='border-dark readableInputBgColor'
                          placeholder="Enter Test name"
                          // value={addFormData.test_name}
                          readOnly
                        />
                        <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                      </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-1">
                  <Col xl={12}>
                    <Card className="custom-card">
                      <Card.Header>
                        {/* <div className="card-title">Voucher Details</div> */}
                      </Card.Header>

                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered mb-0">
                            <thead className="table-light bg-primary">
                              <tr className='text-center'>
                                <th style={{ width: '30%', color: 'white'}}>Account Name</th>
                                <th style={{ width: '15%', color: 'white' }}>A/C Source</th>
                                <th style={{ width: '15%', color: 'white' }}>A/C Source Name</th>
                                <th style={{ width: '15%', color: 'white' }}>DR Amount</th>
                                <th style={{ width: '15%', color: 'white' }}>CR Amount</th>
                                <th style={{ width: '10%', color: 'white' }}>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              <tr>
                                {/* React Select 1 */}
                                <td>
                                  <Select
                                    styles={customStylesForTable}
                                    classNamePrefix="react-select"
                                    placeholder="Select Account"
                                    isSearchable
                                    isClearable
                                  />
                                </td>

                                {/* React Select 2 */}
                                <td>
                                  <Select
                                    styles={customStylesForTable}
                                    classNamePrefix="react-select"
                                    placeholder="Select Sub Head"
                                    isSearchable
                                    isClearable
                                  />
                                </td>

                                {/* React Select 3 */}
                                <td>
                                  <Select
                                    styles={customStylesForTable}
                                    classNamePrefix="react-select"
                                    placeholder="Select Sub Head"
                                    isSearchable
                                    isClearable
                                  />
                                </td>

                                {/* Manual Input 1 */}
                                <td>
                                  <Form.Control
                                    type="number"
                                    className="border-dark form-control-sm"
                                    placeholder="Debit"
                                    value={addFormData.drAmount}
                                    onChange={(e) => setFormData({...addFormData, drAmount: e.target.value})}
                                  />
                                </td>

                                {/* Manual Input 2 */}
                                <td>
                                  <Form.Control
                                    type="number"
                                    className="border-dark form-control-sm"
                                    placeholder="Credit"
                                    value={addFormData.crAmount}
                                    onChange={(e) => setFormData({...addFormData, crAmount: e.target.value})}
                                  />
                                </td>

                                {/* Action */}
                                <td className="text-center">
                                  <span size="sm" onClick={handleAddRow}>
                                    <i className="bi bi-plus-circle btn-sm btn-success"></i>
                                  </span>
                                </td>
                              </tr>
                              {/* --- Store Array Data for map --- */}
                                {rows.map((row, index) => (
                                  <tr key={row.id || index}>
                                    <td>{row.account?.label}</td>
                                    <td>{row.acSource?.label}</td>
                                    <td>{row.acSourceName?.label}</td>
                                    <td className="text-end">{row.drAmount}</td>
                                    <td className="text-end">{row.crAmount}</td>
                                    <td className="text-center">
                                      <span 
                                        size="sm" 
                                        onClick={() => setRows(rows.filter((_, i) => i !== index))}
                                      >
                                        <i className="bi bi-trash btn-sm bg-danger"></i>
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                            {/* For Total CR & DR Amount */}
                            {rows.length > 0 && (
                              <tfoot className="table-light">
                                <tr>
                                  <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                  <td className="text-end"><strong>{rows.reduce((sum, r) => sum + Number(r.drAmount || 0), 0)}</strong></td>
                                  <td className="text-end"><strong>{rows.reduce((sum, r) => sum + Number(r.crAmount || 0), 0)}</strong></td>
                                  <td></td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                    <Form.Label>Remarks (Maximum 200 Characters)<span className='text-danger ms-1'></span></Form.Label>
                    <div className="mb-3">
                      <Form.Control
                        required
                        as='textarea'
                        rows={5}
                        className='border-dark'
                        // id="validationTextarea"
                        placeholder="Remarks"
                        // name='aboutdoctor'
                        // value={addFormData.aboutdoctor}
                        // onChange={onChangeHandler}
                      ></Form.Control>
                    </div>
                    <Form.Control.Feedback type='invalid'>{showValidationError.about_doctor}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row>
                  <Col xl={12}>
                    <Card className="custom-card">
                      <Card.Header className="d-flex justify-content-between align-items-center p-0">
                        <div className="card-title">Attachments</div>
                      </Card.Header>

                      <Card.Body className="p-0">
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered mb-0">
                            <thead className="table-light bg-primary text-center">
                              <tr >
                                <th style={{ width: '40%', color:'white' }}>File Name</th>
                                <th style={{ width: '40%', color:'white' }}>Attachment</th>
                                <th style={{ width: '20%', color:'white' }} className="text-center">
                                  Action 
                                  <span className='ms-2' onClick={addAttachmentRow}>
                                    <i className="bi bi-plus-circle btn-sm bg-success"></i>
                                  </span>
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {attachments.map((row, index) => (
                                <tr key={index}>
                                  {/* Manual Input */}
                                  <td>
                                    <Form.Control
                                      type="text"
                                      className="form-control-sm border-dark"
                                      placeholder="Enter attachment name"
                                      value={row.title}
                                      onChange={(e) =>
                                        handleAttachmentChange(index, 'title', e.target.value)
                                      }
                                    />
                                  </td>

                                  {/* File Upload */}
                                  <td>
                                    <Form.Control
                                      type="file"
                                      className="form-control-sm border-dark"
                                      onChange={(e) =>
                                        handleAttachmentChange(index, 'file', e.target.files[0])
                                      }
                                    />
                                  </td>

                                  {/* Action */}
                                  <td className="text-center">
                                    {attachments.length > 0 && (
                                      <span
                                        size="sm"
                                        onClick={() => removeAttachmentRow(index)}
                                      >
                                        <i className="bi bi-trash btn-sm bg-danger"></i>
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>



                <Row className='mb-3'>                 
                </Row>
                
                <div className='d-flex justify-content-end'>
                  <button tabIndex={-1} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                  <Button tabIndex={6} type="submit">Save</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AccountVoucherForm;
