import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const TestInfoForm = () => {

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

  const [showValidationError, setValidationErrors] = useState({
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: ''
  });

  const [addFormData, setFormData] = useState({
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: ''
  })

  // console.log(addFormData)

  

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
          "Content-type": "application/json"
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




  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Test</div>
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
                <Row className="mb-3">
                  <Form.Group as={Col} md="3" controlId="validationCustom01">
                    <Form.Label>Test Code<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      ref={referenceSelectRef}
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Test Code"
                      name='test_code'
                      value={addFormData.test_code}
                      isInvalid={!!showValidationError.test_code}
                      onChange={onChangeHandler}
                      tabIndex={1}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.test_code}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationCustom02">
                    <Form.Label>Test Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Test name"
                      name='test_name'
                      value={addFormData.test_name}
                      isInvalid={!!showValidationError.test_name}
                      onChange={onChangeHandler}
                      tabIndex={2}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.test_name}</Form.Control.Feedback>
                  </Form.Group>              

                  <Form.Group as={Col} md="3" controlId="validationCustom03">
                    <Form.Label>Delivery Instruction<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Delivery Time"
                      name='delivery_instruction'
                      value={addFormData.delivery_instruction}
                      isInvalid={!!showValidationError.delivery_instruction}
                      onChange={onChangeHandler}
                      tabIndex={3}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.delivery_instruction}</Form.Control.Feedback>
                  </Form.Group>              

                  <Form.Group as={Col} md="3" controlId="validationCustom04">
                    <Form.Label>Room No<span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Room No"
                      name='room_no'
                      value={addFormData.room_no}
                      isInvalid={!!showValidationError.room_no}
                      onChange={onChangeHandler}
                      tabIndex={4}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.room_no}</Form.Control.Feedback>
                  </Form.Group>              
                </Row>

                <Row>
                  <Form.Group as={Col} md="3" controlId="validationCustom05">
                    <Form.Label>Amount<span className='text-danger'> *</span> </Form.Label>
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

export default TestInfoForm;
