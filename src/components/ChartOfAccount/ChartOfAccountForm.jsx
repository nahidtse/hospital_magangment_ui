import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row, InputGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const ChartOfAccountForm = () => {


  const treeData = [
    {
      id: "1000000000", account_head: "Assets", level: 1,
      children: [
        {
          id: "1010000000", account_head: "Non Current Asset", level: 2,
          children: [
            {
              id: "1011000000", account_head: "Intangible Asset", level: 3,
              children: [
                {
                  id: "1011100000", account_head: "License", level: 4,
                  children: [
                    { id: "1011100001", account_head: "Software Licenses & Installation", level: 5 },
                    { id: "1011100002", account_head: "Accumulated Depreciation-Software", level: 5 },
                  ],
                },
                {
                  id: "1011200000", account_head: "Preliminary Expenses", level: 4,
                  children: [
                    { id: "1011200001", account_head: "Consultancy Fees", level: 5 },
                    { id: "1011200002", account_head: "License & Renewal Fees", level: 5 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // ফন্ট সাইজ নির্ধারণ করার ফাংশন (আপনার কোড অনুযায়ী)
  const getFontSize = (level) => {
    if (level === 1) return '18px';
    if (level === 2) return '16px';
    if (level === 3) return '14px';
    return '12px';
  };

  const renderTree = (nodes) => (
  <ul className="tree">
    {nodes.map((node) => (
      <li key={node.id}>

        {node.children && node.children.length > 0 ? (

          <details open>
            <summary>
              <span
                style={{
                  fontSize: getFontSize(node.level),
                  fontWeight: node.level <= 3 ? '900' : '500'
                }}
              >
                {node.id}-{node.account_head} ({node.level})
              </span>
            </summary>

            {renderTree(node.children)}

          </details>

        ) : (

          <div className="leaf-node">
            <span
              style={{
                fontSize: getFontSize(node.level),
                fontWeight: node.level <= 3 ? '900' : '500'
              }}
            >
              {node.id}-{node.account_head} ({node.level})
            </span>
          </div>

        )}

      </li>
    ))}
  </ul>
);

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

              
              <Row>
                <Col md= '7'>
                    {renderTree(treeData)}
                </Col>

                <Col md= '5'>
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


                    <Row className='mb-3'>                 
                    </Row>
                    
                    <div className='d-flex justify-content-end'>
                      <button tabIndex={-1} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetHandling}>Reset</button>
                      <Button tabIndex={6} type="submit">Save</Button>
                    </div>
                  </Form>
                </Col>
              </Row>
              

            </Card.Body>

          </Card>
        </Col>
      </Row>


      <style>{`
        .coa-container {
          padding: 20px;
          background: #fff;
        }

        .tree {
          list-style: none;
          padding-left: 25px;
          position: relative;
          margin: 0;
        }

        /* খাড়া লাইন (Vertical Line) */
        .tree::before {
          content: "";
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 1.5px;
          background-color: #ccc;
        }

        .tree li {
          position: relative;
          margin: 0;
          padding: 8px 0 0 15px;
        }

        /* আড়াআড়ি লাইন (Horizontal Line) */
        .tree li::before {
          content: "";
          position: absolute;
          left: -18px;
          top: 22px;
          width: 18px;
          height: 1.5px;
          background-color: #ccc;
        }

        /* ডট (Dot) ডিজাইন */
        summary {
          display: block;
          outline: none;
          cursor: pointer;
          position: relative;
        }

        summary::-webkit-details-marker {
          display: none; /* ডিফল্ট অ্যারো হাইড করা */
        }

        summary::before {
          content: "";
          position: absolute;
          left: -24px;
          top: 8px;
          width: 10px;
          height: 10px;
          background-color: #5c665a;
          border-radius: 50%;
          z-index: 2;
        }

        .tree a {
          text-decoration: none;
          color: #333;
          display: inline-block;
          line-height: 1.5;
        }

        /* প্রথম রুটের জন্য লাইন হাইড করা */
        .coa-container > .tree::before,
        .coa-container > .tree > li::before {
          display: none;
        }
        
        .coa-container > .tree > li > details > summary::before {
            left: -10px;
        }
        .coa-container > .tree > li {
            padding-left: 0;
        }

        .leaf-node{
            position: relative;
            padding-left: 0;
        }

        .leaf-node::before{
            content: "";
            position: absolute;
            left: -24px;
            top: 6px;
            width: 10px;
            height: 10px;
            background-color: #5c665a;
            border-radius: 50%;
        }

      `}</style>
    </Fragment>
  );
};

export default ChartOfAccountForm;
