import { useEffect, useRef, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


export function PatientLinkModal(props) {
  
    // ---------------- Hooks FIRST ----------------
  const referenceSelectRef = useRef(null);

  const [showValidationError, setValidationErrors] = useState({});

  const [addFormData, setAddFormData] = useState({ 
    register_patient_id: '' 
  });


  //-----------Auth Checek Start-------------
  const token = localStorage.getItem('auth_token');
  const expiry = localStorage.getItem('auth_token_expiry');
  const user_id = localStorage.getItem('user_id') //for Updated by

  // auth check
  useEffect(() => {
    if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, []);
  //-----------Auth Checek End-------------

  // modal open reset
  useEffect(() => {
    if (props.show) {
      setValidationErrors({});
      setAddFormData({ register_patient_id: '' });
    }
  }, [props.show]);

  // auto focus
  useEffect(() => {
    if (!props.show) return;
    const timer = setTimeout(() => {
      referenceSelectRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [props.show]);



    //Submit Form Data
    const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationErrors({});

    const errors = {};

    if (!addFormData.register_patient_id) {
      errors.register_patient_id = "Patient name is required";
    }

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        register_patient_id: addFormData.register_patient_id,
        updated_by: user_id
      }

      // console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/appointment/status/${props.appointment.id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      // console.log(response)
      // return

      if (response.status == 'success') {
        toast.success(response.message);

        setValidationErrors({});
        props.fetchItems()
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


  //----------React Select Business Unit Start--------
      const [registeredPatient, setRegisteredPatient] = useState([])

      useEffect(() => {
        fetch(`${baseURL}/patient`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // <-- must send token
          }
        })
          .then((response) => response.json())
          .then((data) => {
            setRegisteredPatient(data.data);
          })
      }, [])
  
      const patientOptions = registeredPatient.map(patient => ({
        value: patient.id,
        label: `${patient.patient_name} (${patient.mobile_no})`
      }));
  
      // react-select  onChange handler
      const selectPatientChange = (selectedOption) => {
        setAddFormData(prev => ({
          ...prev,
          register_patient_id: selectedOption? selectedOption.value : null
        }))
      };
    //----------React Select Business Unit End--------


  //React select
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
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title as="h6" className="modal-title" id="contained-modal-title-vcenter">
                Link With Registered Patient
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit} noValidate>
                <Row>
                    <Form.Group as={Col} md="8" controlId="validationCustom02">
                    <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                      <Select
                        ref={referenceSelectRef}
                        styles={customStyles}
                        classNamePrefix="react-select" 
                        options={patientOptions}
                        onChange={selectPatientChange}
                        value={patientOptions.find(option => option.value === addFormData.register_patient_id) || null}
                        placeholder="Search and Select Patient"
                        isSearchable={true}
                        isClearable={true}
                        tabIndex={1}
                        autoFocus
                      />

                    {showValidationError.register_patient_id && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                        {showValidationError.register_patient_id}
                        </Form.Control.Feedback>
                    )}
                    </Form.Group>
                </Row>

                <div className='d-flex justify-content-end mt-3'>
                    <button onClick={props.onHide} className="btn btn-outline-info me-2" tabIndex={-1}>Close</button>
                    <Button tabIndex={2} type="submit">Save</Button>
                </div>
            </Form>
        </Modal.Body>
        {/* <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
    </Modal>
  );
}