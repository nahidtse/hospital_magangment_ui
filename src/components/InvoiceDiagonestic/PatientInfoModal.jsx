import { useEffect, useRef, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import {intervalToDuration} from "date-fns";
const basURL = import.meta.env.VITE_API_BASE_URL;


export function PatientInfoModal(props) {

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


    const [showValidationError, setValidationErrors] = useState({
        patientName: '',
        mobileNo: '',
        email:'',
        dob: null,
        age: '',
        sex:'',
        address: '',
    });

    const [addFormData, setAddFormData] = useState({
        patientName: '',
        mobileNo: '',
        email:'',
        dob: new Date(),
        age: { years: '', months: '', days: '' },
        sex:'Male',
        address: '',
    })
    // console.log(addFormData)
    const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon

    const onChangeHandler = (e) => {
        const {name, value} = e.target;

        if (name === "mobileNo" && value.length > 11) return;  //For Type Only 11 Mobile No

        setAddFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

      // -------------------------------
      // AGE CALCULATOR FUNCTION
      // -------------------------------
    const ageCalculetor = (date) => {
        const today = new Date();

        const duration = intervalToDuration({
            start: date,
            end: today,
        });

        return {
            years: duration.years,
            months: duration.months,
            days: duration.days,
        }
    }

    const handleFromDateChange = (date) => {
        const age = ageCalculetor(date) //call age calculetor function
        setAddFormData(prev => ({
            ...prev,
            dob: date,
            age: age, // age set addFormData
        }));
    }

    //dob change/update use year input
    const handleAgeChange = (e) => {
      const value = e.target.value;
      if (isNaN(value)) return;

      const today = new Date();

      //New date create
      const newDob= new Date(
        today.getFullYear() - Number(value),
        today.getMonth(),
        today.getDate()
      )

      const newAge = ageCalculetor(newDob) //Age calculate use age calculetor function

      setAddFormData(prev => ({
          ...prev,
          dob: newDob,
          age: newAge
      }));
    }

    //Clean Input
    const initialFormData = {
        patientName: '',
        mobileNo: '',
        email: '',
        dob: new Date(),
        age: { years: '', months: '', days: '' },
        sex: 'Male',
        address: '',
    };


    //Submit Form Data
    const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.patientName) {
      errors.patientName = "Patient name is required.";
    }
    
    // Mobile number validation (Bangladesh example: 11 digits, starts with 01)
    const mobilePattern = /^01[0-9]{9}$/;
    if (!addFormData.mobileNo) {
      errors.mobileNo = "Mobile number is required.";
    } else if (!mobilePattern.test(addFormData.mobileNo)) {
      errors.mobileNo = "Invalid mobile number.";
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (addFormData.email && !emailPattern.test(addFormData.email)) {
      errors.email = "Invalid email address.";
    }

    if (!addFormData.dob) {
      errors.dob = "Date of Birth is required.";
    }
    if (!addFormData.sex) {
      errors.sex = "Sex is required.";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        patient_name: addFormData.patientName,
        mobile_no: addFormData.mobileNo,
        // patient_id: addFormData.patientId,
        email: addFormData.email || null,
        dob: addFormData.dob ? addFormData.dob.toISOString().slice(0, 10) : null,
        sex: addFormData.sex,
        address: addFormData.address ||null,
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${basURL}/patient/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      // console.log(response)
      // return

      if (response.status == 'success') {
        toast.success(response.message);

        setAddFormData(initialFormData);
        setValidationErrors({});
        props.onSubmit()
        props.onHide()

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

    

    

    //Reset Input 
    const resetHandling = () => {
        setAddFormData(initialFormData);
        setValidationErrors({});
    }
    
     return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title as="h6" className="modal-title" id="contained-modal-title-vcenter">
                    Patient Registetion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} noValidate>
                    <Row>
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="patientName"
                            className={`border-dark ${showValidationError.patientName ? 'is-invalid' : ''}`}
                            onChange={onChangeHandler}
                            value={addFormData.patientName}
                            placeholder="Patient Name"
                            autoFocus
                        />

                        {showValidationError.patientName && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.patientName}
                            </Form.Control.Feedback>
                        )}
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Mobile No<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="mobileNo"
                            className={`border-dark ${showValidationError.mobileNo ? 'is-invalid' : ''}`}
                            onChange={onChangeHandler}
                            value={addFormData.mobileNo}
                            placeholder="Mobile No"
                        />

                        {showValidationError.mobileNo && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.mobileNo}
                            </Form.Control.Feedback>
                        )}
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Patient Id<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="patientId"
                            className='border-dark readableInputBgColor'
                            readOnly
                            tabIndex={-1}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Email<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="email"
                            className={`border-dark ${showValidationError.email ? 'is-invalid' : ''}`}
                            onChange={onChangeHandler}
                            value={addFormData.email}
                            placeholder="Enter Your Email"
                        />

                        {showValidationError.email && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.email}
                            </Form.Control.Feedback>
                        )}
                        </Form.Group>
                    </Row>
                    <Row className="mt-3">
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                            <Form.Label>Date of Birth<span className='text-danger ms-1'>*</span></Form.Label>
                                <InputGroup className="">
                                    <div className="form-control border-dark p-1">
                                    <DatePicker
                                        style={{ width: '70px' }}
                                        className='border-0 border-dark w-100'
                                        selected={addFormData.dob}
                                        dateFormat="dd-MM-yyyy"
                                        onChange={handleFromDateChange}
                                        open={isOpenDate}
                                        maxDate={new Date()}
                                        showYearDropdown={true}
                                        scrollableYearDropdown = {true}
                                        yearDropdownItemNumber={100} 
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

                            {showValidationError.dob && (
                                <Form.Control.Feedback type="invalid" className="d-block">
                                {showValidationError.dob}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom01">
                            <Form.Label>Age (Year | Month | Day)<span className='text-danger ms-1'></span></Form.Label>
                            <InputGroup className="mb-3 input-group-dark">
                                <Form.Control aria-label="First name" onChange={handleAgeChange} value={addFormData.age.years || ""}/>
                                <Form.Control aria-label="Last name" value={addFormData.age.months ||"00"} readOnly tabIndex={-1} className="readableInputBgColor"/>
                                <Form.Control aria-label="Last name" value={addFormData.age.days || "00"} readOnly tabIndex={-1} className="readableInputBgColor"/>
                            </InputGroup>
                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                        </Form.Group> 
                        
                        <Form.Group as={Col} md="3" controlId="validationCustom01">
                          <Form.Label>Sex<span className='text-danger ms-1'>*</span></Form.Label>
                          <Form.Select  
                            size="lg"
                            className={`border-dark ${showValidationError.sex ? 'is-invalid' : ''}`}
                            name="sex"
                            onChange={onChangeHandler}
                            value={addFormData.sex}
                            aria-label="Select role"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </Form.Select>
                        {showValidationError.sex && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.sex}
                            </Form.Control.Feedback>
                        )}
                      </Form.Group> 

                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Address<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={2} 
                            name="address"
                            className='border-dark'
                            onChange={onChangeHandler}
                            value={addFormData.address}
                            placeholder="Enter Address Here"
                        />

                        {/* {showValidationError.doctor_name && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.doctor_name}
                            </Form.Control.Feedback>
                        )} */}
                        </Form.Group>
                    </Row>

                    <div className='d-flex justify-content-end mt-3'>
                        <button onClick={props.onHide} className="btn btn-outline-info me-2" tabIndex={-1}>Close</button>
                        <button onClick={resetHandling} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" tabIndex={-1}>Reset</button>
                        <Button type="submit">Save</Button>
                    </div>
                </Form>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer> */}
        </Modal>
    );
}