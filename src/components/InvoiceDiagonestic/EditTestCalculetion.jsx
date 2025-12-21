import { useEffect } from "react";
import { Form, Col, InputGroup } from "react-bootstrap";

function EditTestCalculetion({editFormData, setEditFormData}) {


    // Discount Percent Change
    const handleDiscountPercent = (e) => {
        const percent = e.target.value;

        setEditFormData(prev =>({
            ...prev,
            discountPercent:percent,
            discountAmount: percent ? ((editFormData.totalAmount * percent) / 100).toFixed(2) : ''
        }))
    };

    // Discount Amount Change
    const handleDiscountAmount = (e) => {
        const amount = e.target.value;

        setEditFormData(prev =>({
            ...prev,
            discountAmount:amount,
            discountPercent: amount ? ((editFormData.totalAmount / amount) * 100).toFixed(2) : ''
        }))
    };

    // Service Charge
    const handleServiceCharge = (e) => {
        const value = e.target.value;

        setEditFormData(prev =>({
            ...prev,
            serviceCharge:value,
        }))
    };

    // Urgent Charge
    const handleUrgentCharge = (e) => {
        const value = e.target.value;

        setEditFormData(prev =>({
            ...prev,
            urgentCharge:value,
        }))
    };

    // VAT Percent
    const handleVatPercent  = (e) => {
        const value = e.target.value;

        setEditFormData(prev =>({
            ...prev,
            vatPercent:value,
            vatAmount:  value ? ((editFormData.totalAmount * value) / 100).toFixed(2) : ''
        }))
    };
    
    
    //Gross Toatal
    const grossTotal = Number(editFormData.totalAmount) + 
                        Number(editFormData.serviceCharge || 0) + 
                        Number(editFormData.urgentCharge || 0) + 
                        Number(editFormData.vatAmount || 0) - 
                        Number(editFormData.discountAmount || 0);
    
    useEffect(() => {
        setEditFormData(prev => ({
            ...prev, 
            grossTotal: grossTotal,
            advanceAmount: '',
            dueAmount: ''
        }))
    }, [editFormData.totalAmount, 
        editFormData.serviceCharge, 
        editFormData.urgentCharge, 
        editFormData.vatAmount, 
        editFormData.vatPercent, 
        editFormData.discountAmount,  
        editFormData.discountPercent,  
        grossTotal, 
        setEditFormData])
    
    // Advance Amount
    const handleAdvanceToatal  = (e) => {
        const value = e.target.value;

        setEditFormData(prev =>({
            ...prev,
            advanceAmount:value,
            dueAmount: grossTotal - (value || 0)
        }))                
    };

  return (
    <>
        <Form.Group as={Col} md="12" controlId="validationCustom01">
            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
            <InputGroup className="mb-1 mt-3 input-group-dark">
                <InputGroup.Text style={{width: '130px'}}>Discount(%)</InputGroup.Text>
                <Form.Control type="number" value={editFormData.discountPercent} onChange={handleDiscountPercent} tabIndex={6} className="text-end" aria-label="First name" />
                <InputGroup.Text style={{width: '110px'}}>Discount</InputGroup.Text>
                <Form.Control type="number" value={editFormData.discountAmount} onChange={handleDiscountAmount} tabIndex={7} className="text-end" aria-label="Last name" />
            </InputGroup>
        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
        </Form.Group>
        
        <Form.Group as={Col} md="12" controlId="validationCustom01">
            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
            <InputGroup className="mb-1 mt-1 input-group-dark">
                <InputGroup.Text style={{width: '130px'}}>Service Charge</InputGroup.Text>
                <Form.Control type="number" onChange={handleServiceCharge} value={editFormData.serviceCharge} tabIndex={8} className="text-end" aria-label="First name" />
                <InputGroup.Text style={{width: '110px'}}>Urgent</InputGroup.Text>
                <Form.Control type="number" onChange={handleUrgentCharge} value={editFormData.urgentCharge} tabIndex={9} className="text-end" aria-label="Last name"/>
            </InputGroup>
        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
        </Form.Group>
        <Form.Group as={Col} md="12" controlId="validationCustom01">
            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
            <InputGroup className="mb-1 mt-1 input-group-dark">
                <InputGroup.Text style={{width: '130px'}}>VAT (%)</InputGroup.Text>
                <Form.Control type="number" onChange={handleVatPercent} value={editFormData.vatPercent} tabIndex={10} className="text-end" aria-label="First name" />
                <InputGroup.Text style={{width: '110px'}}>VAT Amount</InputGroup.Text>
                <Form.Control value={editFormData.vatAmount} readOnly tabIndex={-1} className='readableInputBgColor text-end' aria-label="Last name"/>
            </InputGroup>
        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
        </Form.Group>

        <Form.Group as={Col} md="12" controlId="validationCustom01">
            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
            <InputGroup className="mb-1 mt-1 input-group-dark">
                <InputGroup.Text style={{width: '130px'}}>Total Amount</InputGroup.Text>
                <Form.Control aria-label="First name" value={editFormData.totalAmount} readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
                <InputGroup.Text style={{width: '110px'}}>Gross Total</InputGroup.Text>
                <Form.Control value={grossTotal} aria-label="Last name" readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
            </InputGroup>
        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
        </Form.Group>

        <Form.Group as={Col} md="12" controlId="validationCustom01">
            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
            <InputGroup className="mb-1 mt-1 input-group-dark">
                <InputGroup.Text style={{width: '130px'}}>Advance Amount</InputGroup.Text>
                <Form.Control type="number" onChange={handleAdvanceToatal} value={editFormData.advanceAmount} tabIndex={11} className="text-end" aria-label="First name" />
                <InputGroup.Text style={{width: '110px'}}>Due Amount</InputGroup.Text>
                <Form.Control value={editFormData.dueAmount} aria-label="Last name" readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
            </InputGroup>
        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
        </Form.Group>
    </>
  )
}

export default EditTestCalculetion