import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const TestInfoEditForm = () => {

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
  

  const location = useLocation();
  const testInfoData = location.state?.test;
  const allTests = location.state?.allTests || [];
  const navigate = useNavigate();

  const [editFormData, setEditFormData] = useState({
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: ''

  })
  // console.log(editFormData)

  //Edit page Initial Data set
  useEffect(() => {
    if (!testInfoData) {
      navigate('/testinfo/dataTable');
    }
    if(testInfoData) {
      setEditFormData({
        test_code: testInfoData?.test_code,
        test_name: testInfoData?.test_name,
        delivery_instruction: testInfoData?.delivery_instruction,
        room_no: testInfoData?.room_no,
        amount: testInfoData?.amount
      })
    }
  }, [testInfoData, navigate])

  const [showValidationError, setValidationErrors] = useState({
    test_code: '',
    test_name: '',
    delivery_instruction: '',
    room_no: '',
    amount: ''
  });


  const handleEditFormChange = (event) => {

    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };


  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    const inputCode = editFormData.test_code.trim().toLowerCase();
    const inputName = editFormData.test_name.trim().toLowerCase();

    if (!inputCode) {
      errors.test_code = "Test Code is Required.";
    }

    if (!inputName) {
      errors.test_name = "Test Name is required.";
    }
    
    if (!editFormData.amount) {
      errors.amount = "Amount is required.";
    } else if (isNaN(editFormData.amount)) {
      errors.amount = "Amount must be a number.";
    }

    // DUPLICATE CHECK
    const isDuplicateCode = allTests.some(item =>
      item.id !==testInfoData.id && item.test_code?.trim().toLowerCase() === inputCode
    );
    const isDuplicateName = allTests.some(item =>
      item.id !==testInfoData.id && item.test_name?.trim().toLowerCase() === inputName
    );

    if (isDuplicateCode) {
      errors.test_code = "This Test Code Already Exists!";
    }

    if (isDuplicateName) {
      errors.test_name = "This Test Name Already Exists!";
    }



    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

        const submitData = {
          test_code: editFormData.test_code,
          test_name: editFormData.test_name,
          delivery_instruction: editFormData.delivery_instruction,
          room_no: editFormData.room_no,
          amount: editFormData.amount
        }

      //  console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/testinfo/update/${testInfoData.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message, {autoClose: 1000})
        navigate('/testinfo/dataTable')

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

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Test Information Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}bankinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form 
                noValidate 
                onSubmit={handleEditFormSubmit}
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
                      value={editFormData.test_code}
                      isInvalid={!!showValidationError.test_code}
                      onChange={handleEditFormChange}
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
                      value={editFormData.test_name}
                      isInvalid={!!showValidationError.test_name}
                      onChange={handleEditFormChange}
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
                      value={editFormData.delivery_instruction}
                      isInvalid={!!showValidationError.delivery_instruction}
                      onChange={handleEditFormChange}
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
                      value={editFormData.room_no}
                      isInvalid={!!showValidationError.room_no}
                      onChange={handleEditFormChange}
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
                      value={editFormData.amount}
                      isInvalid={!!showValidationError.amount}
                      onChange={handleEditFormChange}
                      tabIndex={5}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.amount}</Form.Control.Feedback>
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

export default TestInfoEditForm;