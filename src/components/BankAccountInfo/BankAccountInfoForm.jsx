import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from "date-fns";
const basURL = import.meta.env.VITE_API_BASE_URL;


const BankAccountInfoForm = () => {

   //-----------Focus Input Start-----------------------------------
   const referenceSelectRef = useRef(null);  //For auto fucus
    // Component mount then focus 
    useEffect(() => {
      // small timeout for render then focus
      const timer = setTimeout(() => {
        if (referenceSelectRef.current) {
          referenceSelectRef.current.focus();
          
          // Focus Style Add
          // referenceSelectRef.current.classList.add('form-select-focused');
        }
      }, 100);
      return () => clearTimeout(timer);
    }, []);
  //-----------Focus Input End-----------------------------------  

  const location = useLocation();
  const existingBankAccountInfo = location.state?.bankAccount || []; //for duplicate check
  // console.log(existingBankAccountInfo);


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
    ac_name: '',
    ac_number: '',
    bank_id: '',
    branch_name: '',
    opening_date: null,
    opening_balance: '',
    bu_id: '',
    route_no: '',
    status: ''
  });

  const [addFormData, setFormData] = useState({
    ac_name: '',
    ac_number: '',
    bank_id: '',
    branch_name: '',
    opening_date: new Date(),
    opening_balance: '',
    bu_id: '',
    route_no: '',
    status: 1
  })

  // console.log(addFormData)

  const [bankInfo, setBankInfo] = useState([]);
  const [businessUnit, setBusinessUnit] = useState([]); //React Select
  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
  // console.log(bankInfo)


  const onChangeHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;


    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }

  //handleOpeningDateChange
  const handleFromDateChange = (selectedDate) => {
      setFormData({
          ...addFormData,
          opening_date: selectedDate
      });
  };

  //-----Input Clear---------
  const inputClear = {
    ac_name: '',
    ac_number: '',
    bank_id: '',
    branch_name: '',
    opening_date: new Date(),
    opening_balance: '',
    bu_id: '',
    route_no: '',
    status: 1
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    
    if (!addFormData.bank_id) {
      errors.bank_id = "Bank name is required.";
    }
    if (!addFormData.branch_name) {
      errors.branch_name = "Branch name is required.";
    }
    if (!addFormData.ac_number) {
      errors.ac_number = "Account Number is required.";
    }
    
    const inputAcName = addFormData.ac_number.trim().toLowerCase();
    
    // DUPLICATE CHECK
    const isDuplicate = existingBankAccountInfo.some(item =>
      item.ac_number?.trim().toLowerCase() === inputAcName
    );

    if (isDuplicate) {
      errors.ac_number = "This Account already exists!";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        ac_name: addFormData.ac_name,
        ac_number: addFormData.ac_number,
        bank_id: addFormData.bank_id,
        branch_name: addFormData.branch_name,
        opening_date: format(addFormData.opening_date, "yyyy-MM-dd"),
        opening_balance: addFormData.opening_balance,
        bu_id: addFormData.bu_id,
        route_no: addFormData.route_no,
        is_active: addFormData.status,
      }

      console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/bank_account/create`, {
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
        toast.success(response.message);

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

  /**  
   * Module
   * TODO:: Optimize
  */
 //---------React Select Bank Info Start--------------
    useEffect(() => {
      fetch(`${basURL}/bank_info`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setBankInfo(data.data);
        })
    }, []);

    // Helper Function: bankInfo convert to react-select option
    const bankOptions = bankInfo.map(bank => ({
      value: bank.id,
      label: `${bank.bank_name} (${bank.short_name})`
      }));
    
    const handleBankSelectChange = (selectedOption) => {
      setFormData(prev => ({
        ...prev,
        bank_id: selectedOption ? selectedOption.value : null
      }))
    };  
 //---------React Select Bank Info End--------------

  //---------React Select Business Unit Start--------------
    useEffect(() => {
      fetch(`${basURL}/business_unit`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // <-- must send token
        }
      })
        .then((response) => response.json())
        .then((data) => {
          setBusinessUnit(data.data);
        })
    }, []);

    // Helper Function: bankInfo convert to react-select option
    const businessUnitOptions = businessUnit.map(business => ({
      value: business.id,
      label: `${business.business_unit} (${business.short_name})`
      }));

    const handleBUSelectChange = (selectedOption) => {
      setFormData(prev => ({
        ...prev,
        bu_id: selectedOption ? selectedOption.value : null
      }))
    };  
 //---------React Select Business Unit End--------------


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
              <div className='card-title'>New Bank Account</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}bankaccount/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>

                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Account Name<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        ref={referenceSelectRef}
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Account Name'
                        name='ac_name'
                        value={addFormData.ac_name}
                        isInvalid={!!showValidationError.ac_name}
                        onChange={onChangeHandler}
                        tabIndex={1}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.ac_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Account Number<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Account Number'
                        name='ac_number'
                        value={addFormData.ac_number}
                        isInvalid={!!showValidationError.ac_number}
                        onChange={onChangeHandler}
                        tabIndex={2}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.ac_number}</Form.Control.Feedback>
                  </Form.Group> 

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Bank Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles} 
                      classNamePrefix="react-select"
                      options={bankOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      onChange={handleBankSelectChange}
                      value={bankOptions.find(option => option.value === addFormData.bank_id) || null}
                      placeholder="Select Bank"
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={3}
                    />

                    {showValidationError.bank_id && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.bank_id}
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
                        placeholder='Type Branch name'
                        name='branch_name'
                        value={addFormData.branch_name}
                        isInvalid={!!showValidationError.branch_name}
                        onChange={onChangeHandler}
                        tabIndex={4}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.branch_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Route No<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Route No'
                        name='route_no'
                        value={addFormData.route_no}
                        isInvalid={!!showValidationError.route_no}
                        onChange={onChangeHandler}
                        tabIndex={5}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.route_no}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Business Unit<span className='text-danger ms-1'></span></Form.Label>
                    <Select
                      styles={customStyles} 
                      classNamePrefix="react-select"
                      options={businessUnitOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      onChange={handleBUSelectChange}
                      value={businessUnitOptions.find(option => option.value === addFormData.bu_id || null)}
                      placeholder="Search and Select Business Unit"
                      isSearchable={true}
                      isClearable={true}
                      tabIndex={5}
                    />

                    {showValidationError.doctor_name && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.doctor_name}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group> 
                </Row>

                <Row className='mt-2'>
                   <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Opening Date<span className='text-danger ms-1'></span></Form.Label>
                      <InputGroup className="">
                          <div className="form-control border-dark">
                            <DatePicker
                              className='border-0'
                              selected={addFormData.opening_date}
                              dateFormat="dd-MM-yyyy"
                              onChange={handleFromDateChange}
                              open={isOpenDate}
                              onClickOutside={() => setIsOpenDate(false)}
                              tabIndex={7}
                            />
                          </div>
                        <InputGroup.Text id="basic-addon1" className="text-muted"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setIsOpenDate(true)}
                        >
                          <i className="ri-calendar-line"></i>
                        </InputGroup.Text>
                      </InputGroup>

                    {showValidationError.opening_date && (
                      <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.opening_date}
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
                        name='opening_balance'
                        value={addFormData.opening_balance}
                        isInvalid={!!showValidationError.opening_balance}
                        onChange={onChangeHandler}
                        tabIndex={8}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.opening_balance}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>
                    
                    <Form.Group controlId="tickCheckbox">
                        <Form.Check
                          type="checkbox"
                          label={addFormData.status ? 'active' : 'Deactive'}
                          name="status"
                          checked={addFormData.status === 1}
                          onChange={(e) =>
                            setFormData({
                              ...addFormData,
                              status: e.target.checked ? 1 : 0,
                            })
                          }
                        />
                    </Form.Group>
                    <Form.Control.Feedback type='invalid'>{showValidationError.status}</Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className='mb-3'>      
                </Row>
                
                <div className='d-flex justify-content-end'>
                  <button tabIndex={-1} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                  <Button tabIndex={9} type="submit">Save</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default BankAccountInfoForm;
