import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const PendingInvoiceForm = () => {

  const location = useLocation();
  const stateBankInfo = location.state?.bankInfo;  //For Duplicate Check

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
;

  const [showValidationError, setValidationErrors] = useState({
    bank_name: '',
    bu_id: ''
  });

  const [addFormData, setFormData] = useState({
    bank_name: '',
    short_name: '',
    bu_id: '',
    status: 1
  })


  const [businessUnit, setBusinessUnit] = useState([]); //Speciality Update

  // console.log(businessUnit)

  

  const onChangeHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;


    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setFormData(newFormData);
  }


  //Inpute Clear Function
  const inputClear = {
    bank_name: '',
    short_name: '',
    bu_id: '',
    status: 1
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    const inputName = addFormData.bank_name.trim().toLowerCase();

    if (!inputName) {
      errors.bank_name = "Bank name is required.";
    }

    if (!addFormData.bu_id) {
      errors.bu_id = "Business Unit is required.";
    }

    // ✅ DUPLICATE CHECK
    const isDuplicate = stateBankInfo.some(item =>
      item.bank_name?.trim().toLowerCase() === inputName
    );

    if (isDuplicate) {
      errors.bank_name = "This bank name already exists!";
    }

    // STOP HERE
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {

      const submitData = {
        bank_name: addFormData.bank_name,
        short_name: addFormData.short_name,
        bu_id: addFormData.bu_id,
        is_active: addFormData.status,
      }

      console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/bank_info/create`, {
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

  //----------React Select Business unit Start--------
    useEffect(() => {
      fetch(`${baseURL}/business_unit`)
        .then((response) => response.json())
        .then((data) => {
          setBusinessUnit(data.data);
        })
    }, [])

    const businessUnitOptions = businessUnit.map(bu => ({
    value: bu.id,
    label: `${bu.business_unit}`
    }));

    // react-select  onChange handler
    const selectChange = (selectedOption) => {
      setFormData(prev => ({
        ...prev,
        bu_id: selectedOption? selectedOption.value : null
      }))
    };
 //----------React Select Business unit End--------



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
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>New Pending Invoice</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}bankinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Bank Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      ref={referenceSelectRef}
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Bank name"
                      name='bank_name'
                      value={addFormData.bank_name}
                      isInvalid={!!showValidationError.bank_name}
                      onChange={onChangeHandler}
                      tabIndex={1}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.bank_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Short Name <span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Doctor name"
                      name='short_name'
                      value={addFormData.short_name}
                      isInvalid={!!showValidationError.short_name}
                      onChange={onChangeHandler}
                      tabIndex={2}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.short_name}</Form.Control.Feedback>
                  </Form.Group>              
                </Row>

                <Row>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Business Unit<span className='text-danger'> *</span> </Form.Label>

                    <Select
                      styles={customStyles}
                      name="bu_id"
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={businessUnitOptions}
                      value={businessUnitOptions.find(option => option.value === addFormData.bu_id) || null}
                      onChange={selectChange}
                      tabIndex={3}
                      isSearchable={true}
                      isClearable={true}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.degree_id}</Form.Control.Feedback>
                  </Form.Group>  

                  <Form.Group as={Col} md="6" controlId="validationCustom01">
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
                  <Button tabIndex={4} type="submit">Save</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PendingInvoiceForm;
