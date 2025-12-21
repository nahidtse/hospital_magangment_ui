import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { format } from "date-fns";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const MoneyReceiptFormFunction = ({onSubmit}) => {

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


    const [addFormData, setFormData]= useState({
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

    // console.log(addFormData)

    const [patientInfo, setPatientInfo]= useState([]); //For patient React Select
    const [paymentType, setPaymentType]= useState([]); //For paymentType React Select
    const [activityType, setActivityType]= useState([]); //For activityType React Select
    const [bankInfo, setBankInfo]= useState([]); //For Bank React Select
    const [isSubmitting, setIsSubmitting] = useState(false); // For Duble submit Problem
    // console.log(paymentType)
    // console.log(activityType)

  //onChangeHandler all basic input
  const onChangeHandler = (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
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
        setFormData(prev => ({
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
      setFormData(prev => ({
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
      setFormData(prev => ({
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
        setFormData(prev => ({
          ...prev,
          bank_id: selectedOption? selectedOption.value : null
        }))
      };
  //----------React Select Bank End-----------



  //-----------onChange Hide function Start------------
    const isCash = addFormData.activity_type_name === "CASH" //if cash then hide 4 bank input    
    const mobileBanking = ['Bkash', 'Nagat', 'Roket']  //if Select Mobile banking then Mobile no input Show
    const isMobileBanking = mobileBanking.includes(addFormData.activity_type_name)
        useEffect(() => { 
            if(isMobileBanking || isCash) {
                setFormData(prev => ({
                    ...prev,
                    cheque_no: '',
                    bank_id: null,
                    branch_name: '',
                    cheque_date: null
                }))
            }

            if (!isMobileBanking) {
                setFormData(prev => ({
                ...prev,
                mobile_no: '',
                }));
            }
        }, [isMobileBanking, isCash]); //if !isMobileBanking clear mobil_no input

    const showBankFields = !isCash && !isMobileBanking;    
  //-----------onChange hide function End--------------



  //-------Handle submit Form Start----------
    const handleSubmit = async (e) => {
      e.preventDefault();

      if(!validateForm()) return;

      setIsSubmitting(true);

      const submitData = {
          money_receipt_date: format(addFormData.money_receipt_date, "yyyy-MM-dd"),
          patient_id: addFormData.patient_id,
          payment_type_id: addFormData.payment_type_id,
          activity_type_id: addFormData.activity_type_id,
          mobile_no: addFormData.mobile_no,
          branch_name: addFormData.branch_name,
          mr_amount: addFormData.mr_amount,
          cheque_no: addFormData.cheque_no,
          bank_id: addFormData.bank_id,
          cheque_date: addFormData.cheque_date ? format(addFormData.cheque_date, "yyyy-MM-dd") : null,
          remarks: addFormData.remarks,
        }

      // console.log(submitData)
      // return;
      const success = await onSubmit(submitData);  //Pass State Data to Parent function 

      if (success) {
        setFormData(inputClear);   // guaranteed reset
        setErrors({});
      }
      setIsSubmitting(false);
    }
  //-------Handle submit Form End----------


  //-----Input Clear---------
  const inputClear = {
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
  }

  //Validation Error Function Start 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!addFormData.patient_id) newErrors.patient_id = true;
    if (!addFormData.payment_type_id) newErrors.payment_type_id = true;
    if (!addFormData.activity_type_id) newErrors.activity_type_id = true;

    if (!addFormData.mr_amount || Number(addFormData.mr_amount) <= 0) {
      newErrors.mr_amount = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetInputFunction = () => {
    setFormData(inputClear)
    setErrors({})
  }

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
    <>
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

            <Row>
                <InputGroup>
                <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Money Receipt No</InputGroup.Text>
                <Form.Control
                    className='border-dark readableInputBgColor' 
                    aria-label="First name"
                    readOnly 
                />
                </InputGroup>              
            </Row>
            <Row>
                <InputGroup>
                <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Money Receipt Date</InputGroup.Text>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={addFormData.money_receipt_date || null}
                    onChange={(date) =>
                      setFormData({ ...addFormData, money_receipt_date: date })
                    }
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
                    value={patientOptions.find(option => option.value === addFormData.patient_id) || null}
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
                    value={paymentTypeOptions.find(option => option.value === addFormData.payment_type_id) || null}
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
                    value={activityTypeOptions.find(option => option.value === addFormData.activity_type_id) || null}
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
                        value={addFormData.mobile_no || ''}
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
                    value={addFormData.mr_amount || ''}
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
                            value={addFormData.cheque_no}
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
                            value={bankOptions.find(option => option.value === addFormData.bank_id) || null}
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
                            value={addFormData.branch_name || ''}
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
                            selected={addFormData.cheque_date || null}
                            onChange={(date) =>
                                setFormData({ ...addFormData, cheque_date: date })
                            }
                            placeholderText="Select Cheque date"
                            className="form-control flex-grow-1 border-dark"
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
                    value={addFormData.remarks || ''}
                    onChange={onChangeHandler}
                    tabIndex={12}
                    />
                </InputGroup>              
            </Row>

            <Row className='mb-3'>      
            </Row>
            
            <div className='d-flex justify-content-end'>
                <button type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" onClick={resetInputFunction} >Reset</button>
                <Button tabIndex={16} type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Submit"}</Button>
            </div>
        </Form>
    </>
  )
}

export default MoneyReceiptFormFunction