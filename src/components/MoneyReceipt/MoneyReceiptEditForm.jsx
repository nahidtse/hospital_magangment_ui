import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from "date-fns";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const MoneyReceiptEditForm = () => {
      const {id} = useParams();
      const navigate = useNavigate();
    // console.log(id)

    //---------------Auto Focus Start----------------
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
    //---------------Auto Focus End----------------


    const [editFormData, setEditFormData]= useState({
      money_receipt_no: '',
      money_receipt_date: new Date(),
      patient_id: null,
      payment_type_id: null,
      activity_type_id: null,
      activity_type_name: null,  // For Hide Input Fild When Select Cash/mobileBanking
      mobile_no: '',
      mr_amount: '',
      cheque_no: '',
      bank_id: null,
      branch_name: '',
      cheque_date: null,
      remarks: ''
    })
    // console.log(editFormData)

    useEffect(() => {
      if(!id) return;

      const fetchReceipt = async () => {
        const res = await fetch(`${baseURL}/money_receipt/single_data/${id}`);
        const data = await res.json();
        // console.log(data.data)
        if(data?.data){
          setEditFormData({
            money_receipt_no: data.data.money_receipt_no || '',
            money_receipt_date: new Date(data.data.money_receipt_date) || null,
            patient_id: data.data.patient_id || null,
            payment_type_id: data.data.payment_type_id || null,
            activity_type_id: data.data.activity_type_id || null,
            activity_type_name: data.data.activity_type?.lookup_value || null,
            mobile_no: data.data.mobile_no || '',
            mr_amount: data.data.mr_amount || '',
            cheque_no: data.data.cheque_no || '',
            bank_id: data.data.bank_id || null,
            branch_name: data.data.branch_name || '',
            cheque_date: data.data.cheque_date ? new Date(data.data.cheque_date) : null,
            remarks: data.data.remarks || ''
          })
        }
      };
    fetchReceipt();
    }, [id])

    const [patientInfo, setPatientInfo]= useState([]); //For patient React Select
    const [paymentType, setPaymentType]= useState([]); //For paymentType React Select
    const [activityType, setActivityType]= useState([]); //For activityType React Select
    const [bankInfo, setBankInfo]= useState([]); //For Bank React Select
    // console.log(paymentType)
    // console.log(activityType)

  //onChangeHandler all basic input
  const onChangeHandler = (e) => {
      const { name, value } = e.target;

      if (name === "mobile_no" && value.length > 11) return;

      setEditFormData((prev) => ({
          ...prev,
          [name]: value,
      }));

      setErrors(prev => ({
        ...prev,
        [name]: false,
      }));
  };

  //----------React Select Patient Start----------
      useEffect(() => {
        fetch(`${baseURL}/patient`)
          .then((response) => response.json())
          .then((data) => {
            setPatientInfo(data.data);
          })
      }, [])
  
      const patientOptions = patientInfo.map(patient => ({
      value: patient.id,
      label: `${patient.patient_name} (${patient.mobile_no})`
      }));
  
      // react-select  onChange handler
      const selectPatientChange = (selectedOption) => {
        setEditFormData(prev => ({
          ...prev,
          patient_id: selectedOption? selectedOption.value : null
        }))

        setErrors(prev => ({ ...prev, patient_id: false }));
      };
  //----------React Select Patient End-----------


  //----------React Select paymentType, activityType Start----------
    //Lookup value Get By Code
    const getLookupValueDataByCode = async (code) => {
      try {
        const response = await fetch(`${baseURL}/lookupvalue/multiplefilter/${code}`)
        const result = await response.json()
  
        if(!result?.data) return ;
  
        if(code === 'PT') {
          setPaymentType(result.data);
        }
        if(code === 'AT') {
          setActivityType(result.data);
        }
  
      } catch (err) {
          console.error(`Failed to load lookup value for code ${code}:`, err);
      }
    }
  
    useEffect(()=> {
      const lookupValueCode = ['PT', 'AT'];
  
      lookupValueCode.forEach((code) => {
        getLookupValueDataByCode(code);
      })
    }, []);

    const paymentTypeOptions = paymentType.map(payment => ({
      value: payment.id,
      label: `${payment.lookup_value} (${payment.lookup_code})`
    }));

    // react-select  onChange handler
    const selectpaymentTypeChange = (selectedOption) => {
      setEditFormData(prev => ({
      ...prev,
      payment_type_id: selectedOption? selectedOption.value : null
      }));

      setErrors(prev => ({ ...prev, payment_type_id: false }));
    };

    const activityTypeOptions = activityType.map(activity => ({
      value: activity.id,
      label: `${activity.lookup_value} (${activity.lookup_code})`,
      lookupValue: activity.lookup_value  //for hide input 
    }));

    // react-select  onChange handler
    const activityTypeChange = (selectedOption) => {
      setEditFormData(prev => ({
      ...prev,
      activity_type_id: selectedOption? selectedOption.value : null,
      activity_type_name: selectedOption? selectedOption.lookupValue : null //for hide input 
      }));

      setErrors(prev => ({ ...prev, activity_type_id: false }));
    };
  //----------React Select paymentType, activityType End---------- 
    
    
  //----------React Select Bank Start----------
      useEffect(() => {
        fetch(`${baseURL}/bank_info`)
          .then((response) => response.json())
          .then((data) => {
            setBankInfo(data.data);
          })
      }, [])
  
      const bankOptions = bankInfo.map(bank => ({
      value: bank.id,
      label: `${bank.bank_name} (${bank.short_name})`
      }));
  
      // react-select  onChange handler
      const selectBankChange = (selectedOption) => {
        setEditFormData(prev => ({
          ...prev,
          bank_id: selectedOption? selectedOption.value : null
        }))
      };
  //----------React Select Bank End-----------



  //-----------onChange Hide function Start------------
    // ===== Activity Type Normalize =====
    const activityName = editFormData.activity_type_name?.trim()?.toUpperCase();
    const isCash = activityName === "CASH" //if cash then hide 4 bank input    
    const mobileBanking = ['BKASH', 'NAGAD', 'ROKET'];  //if Select Mobile banking then Mobile no input Show
    const isMobileBanking = mobileBanking.includes(activityName);
        useEffect(() => { 
            if(isMobileBanking || isCash) {
                setEditFormData(prev => ({
                    ...prev,
                    cheque_no: '',
                    bank_id: null,
                    branch_name: '',
                    cheque_date: null
                }))
            }

            if (activityName && !isMobileBanking) {
                setEditFormData(prev => ({
                ...prev,
                mobile_no: '',
                }));
            }
        }, [activityName]); //if !isMobileBanking clear mobil_no input

    const showBankFields = !isCash && !isMobileBanking;    
  //-----------onChange hide function End--------------



  //-------Handle submit Form Start----------
    const handleEditFormSubmit = async (e) => {
      e.preventDefault();

      if(!validateForm()){
        console.log("VALIDATION FAILED");
        return;
      } 

      try {  
        const submitData = {
          money_receipt_date: format(editFormData.money_receipt_date, "yyyy-MM-dd HH:mm:ss"),
          patient_id: editFormData.patient_id,
          payment_type_id: editFormData.payment_type_id,
          activity_type_id: editFormData.activity_type_id,
          mobile_no: isMobileBanking ? editFormData.mobile_no : null,
          branch_name: showBankFields ? editFormData.branch_name : '',
          mr_amount: editFormData.mr_amount,
          cheque_no: showBankFields  ? editFormData.cheque_no : '',
          bank_id: showBankFields ? editFormData.bank_id : null,
          cheque_date: showBankFields && editFormData.cheque_date ? format(editFormData.cheque_date, "yyyy-MM-dd") : null,
          remarks: editFormData.remarks,
        }

        console.log(submitData)
        // return;

        const result = await fetch(`${baseURL}/money_receipt/update/${id}`, {
          method: 'POST',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(submitData)
        });

        const response = await result.json();
        // console.log("API RESPONSE =>", response);
        if (response.status == 'success') {
          toast.success(response.message);
          navigate('/moneyreceipt/dataTable')

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

    
    }
  //-------Handle submit Form End----------

  //Validation Error Function Start 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!editFormData.patient_id) newErrors.patient_id = true;
    if (!editFormData.payment_type_id) newErrors.payment_type_id = true;
    if (!editFormData.activity_type_id) newErrors.activity_type_id = true;

    if (!editFormData.mr_amount || Number(editFormData.mr_amount) <= 0) {
      newErrors.mr_amount = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  //React select Style
  const customStyles = (hasError) => ({
    control: (base, state) => ({
      ...base,
      borderColor: hasError ? 'red' : '#000',
      borderWidth: hasError ? '2px' : '1px',
      // borderRadius: '0.375rem',
      fontSize: '0.875rem',
      // padding: '1px',
      minHeight: '40px',
      '&:hover': {
        borderColor: hasError ? 'red' : '#000',
      }
    }),
  }); 

  

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Money Receipt Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}moneyreceipt/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Row>
                <Col md={4}>
                  <Form noValidate onSubmit={handleEditFormSubmit}>
                    <Row>
                      <InputGroup>
                      <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Money Receipt No</InputGroup.Text>
                      <Form.Control
                          className='border-dark readableInputBgColor' 
                          aria-label="First name"
                          value={editFormData.money_receipt_no}
                          readOnly 
                      />
                      </InputGroup>              
                    </Row>
                    <Row>
                        <InputGroup>
                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Money Receipt Date</InputGroup.Text>
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={editFormData.money_receipt_date || null}
                            onChange={(date) =>
                              setEditFormData({ ...editFormData, money_receipt_date: date })
                            }
                            maxDate={new Date()}
                            placeholderText="Select date"
                            className="form-control flex-grow-1 border-dark"
                            tabIndex={2}
                        />
                        </InputGroup>              
                    </Row>
                    <Row>
                        <InputGroup>
                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Patient</InputGroup.Text>
                        <Select
                            ref={referenceSelectRef}
                            styles={customStyles(errors.patient_id)}
                            options={patientOptions}
                            onChange={selectPatientChange}
                            value={patientOptions.find(option => option.value === editFormData.patient_id) || null}
                            isSearchable={true}
                            isClearable={true}
                            classNamePrefix="react-select"
                            className='flex-grow-1'
                            placeholder= "Select Patient" 
                            tabIndex={3}
                            autoFocus 
                        />
                        </InputGroup>              
                    </Row>
                    <Row>
                        <InputGroup>
                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Payment Type</InputGroup.Text>
                        <Select 
                            styles={customStyles(errors.payment_type_id)}
                            options={paymentTypeOptions}
                            onChange={selectpaymentTypeChange}
                            value={paymentTypeOptions.find(option => option.value === editFormData.payment_type_id) || null}
                            placeholder= "Select Payment Type"
                            isSearchable={true}
                            isClearable={true}
                            classNamePrefix="react-select"
                            className='flex-grow-1'
                            aria-label="First name"
                            tabIndex={5} 
                        />
                        </InputGroup>              
                    </Row>
                    <Row>
                        <InputGroup>
                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Activity Type</InputGroup.Text>
                        <Select
                            styles={customStyles(errors.activity_type_id)}
                            classNamePrefix="react-select"
                            options={activityTypeOptions}
                            onChange={activityTypeChange}
                            value={activityTypeOptions.find(option => option.value === editFormData.activity_type_id) || null}
                            placeholder= "Select Activity Type"
                            isSearchable={true}
                            isClearable={true}
                            className='flex-grow-1' 
                            aria-label="First name"
                            tabIndex={6} 
                        />
                        </InputGroup>              
                    </Row>
                    {isMobileBanking && (
                        <Row>
                            <InputGroup>
                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Mobile No</InputGroup.Text>
                            <Form.Control 
                                required
                                className='border-dark'
                                aria-label="First name"
                                name='mobile_no'
                                value={editFormData.mobile_no || ''}
                                onChange={onChangeHandler}
                                tabIndex={7} 
                            />
                            </InputGroup>              
                        </Row>
                    )}
                    <Row>
                        <InputGroup>
                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Amount*</InputGroup.Text>
                        <Form.Control 
                            className={`border ${
                              errors.mr_amount ? "border-danger border-2 shadow-sm" : "border-dark"
                            }`}
                            aria-label="First name"
                            name='mr_amount'
                            value={Number(editFormData.mr_amount || '').toFixed(0)}
                            onChange={onChangeHandler}
                            tabIndex={7} 
                        />
                        </InputGroup>              
                    </Row>

                    {showBankFields && (
                        <>
                            <Row>
                                <InputGroup>
                                <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Cheque/Ref No</InputGroup.Text>
                                <Form.Control
                                    aria-label="First name" 
                                    className='border-dark'
                                    name='cheque_no'
                                    value={editFormData.cheque_no}
                                    onChange={onChangeHandler}
                                    tabIndex={8}
                                />
                                </InputGroup>              
                            </Row>

                            <Row>
                                <InputGroup>
                                <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Bank Name</InputGroup.Text>
                                <Select
                                    styles={customStyles(errors.bank_id)}
                                    options={bankOptions}
                                    onChange={selectBankChange}
                                    value={bankOptions.find(option => option.value === editFormData.bank_id) || null}
                                    placeholder= "Select Bank Name Type"
                                    isSearchable={true}
                                    isClearable={true}
                                    classNamePrefix="react-select"
                                    className='flex-grow-1'
                                    tabIndex={9} 
                                />
                                </InputGroup>              
                            </Row>

                            <Row>
                                <InputGroup>
                                <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Bank Branch</InputGroup.Text>
                                <Form.Control
                                    aria-label="First name" 
                                    className='border-dark'
                                    name='branch_name'
                                    value={editFormData.branch_name || ''}
                                    onChange={onChangeHandler}
                                    tabIndex={10}
                                />
                                </InputGroup>              
                            </Row>

                            <Row>
                                <InputGroup>
                                <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Cheque Date</InputGroup.Text>
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={editFormData.cheque_date || null}
                                    onChange={(date) =>
                                        setEditFormData({ ...editFormData, cheque_date: date })
                                    }
                                    placeholderText="Select Cheque date"
                                    className="form-control flex-grow-1 border-dark"
                                    maxDate={new Date()}
                                    tabIndex={11}
                                />
                                </InputGroup>              
                            </Row>
                        </>
                    )}

                    <Row>
                        <InputGroup>
                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Remarks</InputGroup.Text>
                        <Form.Control
                            aria-label="First name"
                            className='border-dark'
                            name='remarks'
                            value={editFormData.remarks || ''}
                            onChange={onChangeHandler}
                            tabIndex={12}
                            />
                        </InputGroup>              
                    </Row>

                    <Row className='mt-2'>                
                    </Row> 
                    
                    <div className='d-flex justify-content-end'>
                    <Button type="submit" tabIndex={13}>Update</Button>
                    </div>
                  </Form>
                </Col>
                <Col md={8}></Col>
              </Row>


            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default MoneyReceiptEditForm;