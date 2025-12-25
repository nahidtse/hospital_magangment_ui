import { useEffect, useRef, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { format } from "date-fns";
const baseURL = import.meta.env.VITE_API_BASE_URL;


export function DuesCollectionModal({ show, onHide, due, fetchItems }) {


  // console.log(due)
  if (!due) return null;

   //-------------Auto Focus Start ---------------
     const referenceSelectRef = useRef(null);  //For auto fucus
      // Component mount then focus 
      useEffect(() => {
        referenceSelectRef.current?.focus();
      }, []);
   //-------------Auto Focus End ---------------


    const [showValidationError, setValidationErrors] = useState({
        activity_type_id: '',
        mr_amount: '',
    });

    const [addFormData, setAddFormData] = useState({
        money_receipt_date: new Date(),
        invoice_master_id: '',
        patient_id: '',
        mr_amount: '',
        activity_type_id: null,
        due_amount: '',
        remarks: ''
    })
    console.log(addFormData)


    //Modal Initial Value to Paretn State
    useEffect(() => {
      if(due) {
        setAddFormData(prev =>({
          ...prev,
          // due_amount: due.due_amount,
          invoice_master_id: due.id,
          patient_id: due.patient_id
        }))
      }
    }, [due])

    const [activityType, setActivityType]= useState([]); //For activityType React Select

    const onChangeHandler = (e) => {
        const {name, value} = e.target;

        setAddFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    //Clean Input
    const initialFormData = {
        mr_amount: '',
        activity_type_id: null,
        remarks: ''
    };



     //----------React Select paymentType, activityType Start----------
        //Lookup value Get By Code
        const getLookupValueDataByCode = async (code) => {
          try {
            const response = await fetch(`${baseURL}/lookupvalue/multiplefilter/${code}`)
            const result = await response.json()
      
            if(!result?.data) return ;
      
            if(code === 'AT') {
              setActivityType(result.data);
            }
            //----CASH Initial Value set in activity_type_id Start-----
            const cashOption = result.data.find(
              (item) => item.lookup_value.toLowerCase() === "cash"
            );
            
            if (cashOption) {
              setAddFormData((prev) => ({
                ...prev,
                activity_type_id: cashOption.id,
              }));
            }
            //----CASH Initial Value set in activity_type_id End-----
          } catch (err) {
              console.error(`Failed to load lookup value for code ${code}:`, err);
          }
        }
      
        useEffect(()=> {
          const lookupValueCode = ['AT'];
      
          lookupValueCode.forEach((code) => {
            getLookupValueDataByCode(code);
          })
        }, []);
    
        const activityTypeOptions = activityType.map(activity => ({
          value: activity.id,
          label: `${activity.lookup_value} (${activity.lookup_code})` 
        }));
    
        // react-select  onChange handler
        const activityTypeChange = (selectedOption) => {
          setAddFormData(prev => ({
          ...prev,
          activity_type_id: selectedOption? selectedOption.value : null
          }));
        };
      //----------React Select paymentType, activityType End---------- 


    //Submit Form Data
    const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!addFormData.activity_type_id) {
      errors.activity_type_id = "Type is required.";
    }
    if (!addFormData.mr_amount) {
      errors.mr_amount = "Amount is required.";
    }
    if (addFormData.mr_amount > PresentDuesAmount) {
      errors.mr_amount = "Amount Cannot Exceed Current Dues.";
    }
    

    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

      const submitData = {
        money_receipt_date: format(addFormData.money_receipt_date, "yyyy-MM-dd HH:mm:ss"),
        invoice_master_id: addFormData.invoice_master_id,
        patient_id: addFormData.patient_id,
        due_amount: addFormData.due_amount,
        activity_type_id: addFormData.activity_type_id,
        mr_amount: addFormData.mr_amount,
        remarks: addFormData.remarks,
      }

      console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/money_receipt/create`, {
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
        onHide()
        fetchItems()

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
        setAddFormData(prev => ({
            ...prev,           // preserve other fields
            mr_amount: '',
            activity_type_id: null,
            remarks: ''
        }));
        setValidationErrors({});
    }

    //-----------Adv & Toatal Collection Amount Calculetion Start---------
    const totalDuesAmountCollection = due?.money_receipt?.reduce(
        (sum, item) => sum + Number(item?.mr_amount || 0),
        0
    ) || 0;

    const PresentDuesAmount = due.gross_total - totalDuesAmountCollection;
    //-----------Adv & Toatal Collection Amount Calculetion End---------

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
            show={show} onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title as="h6" className="modal-title" id="contained-modal-title-vcenter">
                    Dues Collection
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                  onSubmit={handleSubmit} 
                  noValidate
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
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Collection Date<span className='text-danger ms-1'></span></Form.Label>
                            <Form.Control
                              type="text"
                              value={addFormData.money_receipt_date ? format(addFormData.money_receipt_date, "dd-MM-yyyy") : ''}
                              placeholder="Select date"
                              className="form-control flex-grow-1 border-dark readableInputBgColor" 
                              readOnly
                            />
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Invoice No<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="patientId"
                            className='border-dark readableInputBgColor'
                            value={due.invoice_no || ''}
                            readOnly
                            tabIndex={-1}
                        />
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Patient Name<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="patientId"
                            className='border-dark readableInputBgColor'
                            value={due.patient_name || ''}
                            readOnly
                            tabIndex={-1}
                        />
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Dues Amount<span className='text-danger ms-1'>*</span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="patientId"
                            className='border-dark readableInputBgColor'
                            value={PresentDuesAmount || '0.00'}
                            readOnly
                            tabIndex={-1}
                        />
                        </Form.Group>
                    </Row>
                    <Row className="mt-3">
                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Collection Type<span className='text-danger ms-1'></span></Form.Label>
                        <Select
                            ref={referenceSelectRef}
                            styles={customStyles}
                            classNamePrefix="react-select"
                            options={activityTypeOptions}
                            onChange={activityTypeChange}
                            value={activityTypeOptions.find(option => option.value === addFormData.activity_type_id) || null}
                            placeholder= "Select Type"
                            isSearchable={true}
                            isClearable={true}
                            className='flex-grow-1' 
                            aria-label="First name"
                            tabIndex={1} 
                        />
                        {showValidationError.activity_type_id && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.activity_type_id}
                            </Form.Control.Feedback>
                        )}
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>Collection Amount<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                            type= 'text' 
                            name="mr_amount"
                            className={`border-dark ${showValidationError.mr_amount ? 'is-invalid' : ''}`}
                            onChange={onChangeHandler}
                            value={addFormData.mr_amount}
                            placeholder="Amount"
                            tabIndex={2}
                        />

                        {showValidationError.mr_amount && (
                            <Form.Control.Feedback type="invalid" className="d-block">
                            {showValidationError.mr_amount}
                            </Form.Control.Feedback>
                        )}
                        </Form.Group>

                        <Form.Group as={Col} md="6" controlId="validationCustom02">
                        <Form.Label>Remarks<span className='text-danger ms-1'></span></Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={1} 
                            name="remarks"
                            className='border-dark'
                            onChange={onChangeHandler}
                            value={addFormData.remarks}
                            placeholder="Enter Remarks Here"
                            tabIndex={3}
                        />
                        </Form.Group>
                    </Row>

                    <div className='d-flex justify-content-end mt-3'>
                        <button onClick={onHide} className="btn btn-outline-info me-2" tabIndex={-1}>Close</button>
                        <button onClick={resetHandling} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" tabIndex={-1}>Reset</button>
                        <Button tabIndex={4} type="submit">Save</Button>
                    </div>
                </Form>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer> */}
        </Modal>
    );
}