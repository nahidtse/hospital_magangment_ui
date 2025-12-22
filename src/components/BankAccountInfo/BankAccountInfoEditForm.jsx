import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const BankAccountInfoEditForm = () => {

  const {id} = useParams()
  const location = useLocation();
  const getExistingAllData = location.state ? location.state.bankAccount : null; // For Dublicate Check
  const navigate = useNavigate();

  const [editFormData, setEditFormData] = useState({
    id: '',   //Dublicate Check
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

  const [isHidden, setIsHidden] = useState([false]);

  const [bankInfo, setBankInfo] = useState([]);
  const [bu_id, setBusinessUnit] = useState([]); //React Select
  const [isOpenDate, setIsOpenDate] = useState(false); //for date picker open use icon
  // console.log(doctorScheduleDays)

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

 const handleEditFormChange = (event) => {

    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  //handleFromDateChange
  const handleFromDateChange = (selectedDate) => {
    setEditFormData({
        ...editFormData,
        opening_date: selectedDate
    });
  };


  /**  
    * Module
    * TODO:: Optimize
   */

  //Get Edit Data Use api & id
    useEffect(() => {
        if(!id) return;
  
        fetch(`${baseURL}/bank_account/single_data/${id}`)
            .then((response) => response.json())
            .then((data) => {
              if(data.status === 'success') {
                setEditFormData({
                  id: data.data.id || '',  //Dublicate Check
                  ac_name: data.data.ac_name || '',
                  ac_number: data.data.ac_number || '',
                  bank_id: data.data.bank_id || '',
                  branch_name: data.data.branch_name || '',
                  opening_date: data.data.opening_date || '',
                  opening_balance: data.data.opening_balance || '',
                  bu_id: data.data.bu_id || '',
                  route_no: data.data.route_no || '',
                  status: data.data.is_active || ''
                });
              }
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });
  
    }, [id])

  //---------React Select Bank Info Start--------------
     useEffect(() => {
       fetch(`${baseURL}/bank_info`)
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
       setEditFormData(prev => ({
         ...prev,
         bank_id: selectedOption ? selectedOption.value : null
       }))
     };  
  //---------React Select Bank Info End--------------
 
   //---------React Select Business Unit Start--------------
     useEffect(() => {
       fetch(`${baseURL}/business_unit`)
         .then((response) => response.json())
         .then((data) => {
           setBusinessUnit(data.data);
         })
     }, []);
 
     // Helper Function: bankInfo convert to react-select option
     const businessUnitOptions = bu_id.map(business => ({
       value: business.id,
       label: `${business.business_unit} (${business.short_name})`
       }));
 
     const handleBUSelectChange = (selectedOption) => {
       setEditFormData(prev => ({
         ...prev,
         bu_id: selectedOption ? selectedOption.value : null
       }))
     };  
  //---------React Select Business Unit End--------------


  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.bank_id) {
      errors.bank_id = "Bank name is required.";
    }
    if (!editFormData.ac_number) {
      errors.ac_number = "Account Number is required.";
    }
    if (!editFormData.branch_name) {
      errors.branch_name = "Account Number is required.";
    }

    const inputAcNumber = editFormData.ac_number.trim().toLowerCase();

    const isDuplicate = getExistingAllData.some(item =>
      item.ac_number.trim().toLowerCase() === inputAcNumber &&
      item.id !== editFormData.id
    );

    if (isDuplicate) {
      errors.ac_number = "Duplicate Account Not Permited";
    }
    


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {  
        const submitData = {
          ac_name: editFormData.ac_name,
          ac_number: editFormData.ac_number,
          bank_id: editFormData.bank_id,
          branch_name: editFormData.branch_name,
          opening_date: format(editFormData.opening_date, "yyyy-MM-dd"),
          opening_balance: editFormData.opening_balance,
          bu_id: editFormData.bu_id,
          route_no: editFormData.route_no,
          is_active: editFormData.status,
        }

      console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/bank_account/update/${id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message);
        navigate('/bankaccount/dataTable')

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

 

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Bank Account Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}bankaccount/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Account Name<span className='text-danger ms-1'></span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type patient name'
                        name='ac_name'
                        value={editFormData.ac_name}
                        isInvalid={!!showValidationError.ac_name}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.ac_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                      <Form.Label>Account Number<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Your Account Name'
                        name='ac_number'
                        value={editFormData.ac_number}
                        isInvalid={!!showValidationError.ac_number}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.ac_number}</Form.Control.Feedback>
                  </Form.Group> 

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Bank Name<span className='text-danger ms-1'>*</span></Form.Label>
                    <Select
                      styles={customStyles} 
                      name="doctorId"
                      options={bankOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      onChange={handleBankSelectChange}
                      value={bankOptions.find(option => option.value === editFormData.bank_id)}
                      placeholder="Select Bank"
                      isSearchable={true}
                      isClearable={true}
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
                      <Form.Label>Branch Name<span className='text-danger ms-1'>*</span></Form.Label>
                      <Form.Control
                        required
                        type="text"
                        className='border-dark'
                        placeholder='Type Branch Name'
                        name='branch_name'
                        value={editFormData.branch_name}
                        isInvalid={!!showValidationError.branch_name}
                        onChange={handleEditFormChange}
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
                        value={editFormData.route_no}
                        isInvalid={!!showValidationError.route_no}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.route_no}</Form.Control.Feedback>
                  </Form.Group> 

                  <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Business Unit<span className='text-danger ms-1'></span></Form.Label>
                    <Select
                      styles={customStyles} 
                      name="doctorId"
                      options={businessUnitOptions}
                      className={`react-select-container ${showValidationError.doctor_name ? 'is-invalid' : ''}`}
                      onChange={handleBUSelectChange}
                      value={businessUnitOptions.find(option => option.value === editFormData.bu_id)}
                      placeholder="Search and Select Business Unit"
                      isSearchable={true}
                      isClearable={true}
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
                              selected={editFormData.opening_date}
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
                        value={editFormData.opening_balance}
                        isInvalid={!!showValidationError.opening_balance}
                        onChange={handleEditFormChange}
                      />
                    <Form.Control.Feedback type='invalid'>{showValidationError.opening_balance}</Form.Control.Feedback>
                  </Form.Group> 

                  <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>
                    
                    <Form.Group controlId="tickCheckbox">
                        <Form.Check
                          type="checkbox"
                          label={editFormData.status ? 'active' : 'Deactive'}
                          name="status"
                          checked={editFormData.status === 1}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              status: e.target.checked ? 1 : 0,
                            })
                          }
                        />
                    </Form.Group>
                    <Form.Control.Feedback type='invalid'>{showValidationError.status}</Form.Control.Feedback>
                  </Form.Group>
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

export default BankAccountInfoEditForm;