import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setShowData, singleInvoice, setSingleData }) => {


    // console.log(singleInvoice)


    const goToInvoiceList = () => {
        setSingleData(null);
        setShowData(false);
    }
    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Invoice (Diagonestic) Show</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}invoicediagonestic/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToInvoiceList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row>
                                    <Col md={8}>
                                            <Row className="mb-2">
                                                <Form.Group as={Col} md="3" >
                                                    <Form.Label>Invoice No</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.invoice_no || ""}

                                                    />

                                                </Form.Group>
                                                <Form.Group as={Col} md="3" >
                                                    <Form.Label>Invoice Date</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.invoice_date || ""}

                                                    />
                                                </Form.Group>
                                                
                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Doctor Ref.</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.doctor_ref || ""}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Doctor Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.doctor_info?.doctor_name ?? singleInvoice.doctor_name}
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row className="mb-2">
                                                 <Form.Group as={Col} md="3">
                                                    <Form.Label>Patient Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.patient_name || ""}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Mobile No</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.mobile_no || ""}
                                                    />
                                                </Form.Group>
                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Email </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.email || ""}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Date Of Birth</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.dob || ""}
                                                    />
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-2">
                                                <Form.Group as={Col} md="3" controlId="validationCustom01">
                                                    <Form.Label>Age (Year | Month | Day)<span className='text-danger ms-1'></span></Form.Label>
                                                    <InputGroup className="mb-3 input-group-dark">
                                                            <Form.Control aria-label="First name" value={singleInvoice.age_year|| '00'} className='readableInputBgColor' readOnly />
                                                            <Form.Control aria-label="Last name" value={singleInvoice.age_month || '00'} className='readableInputBgColor' readOnly />
                                                            <Form.Control aria-label="Last name" value={singleInvoice.age_day || '00'} className='readableInputBgColor' readOnly />
                                                        </InputGroup>
                                                    {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                                </Form.Group> 

                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Sex</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.sex || ""}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} md="3">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control
                                                        as='textarea'
                                                        rows={2}
                                                        className='readableInputBgColor border-dark'
                                                        readOnly
                                                        value={singleInvoice.address || ""}
                                                    />
                                                </Form.Group>
                                            </Row>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
                                            <InputGroup className="mb-1 mt-3 input-group-dark">
                                                <InputGroup.Text style={{width: '130px'}}>Discount(%)</InputGroup.Text>
                                                <Form.Control type="text" value={singleInvoice.dis_per || "0%"} className='readableInputBgColor text-end' aria-label="First name" readOnly/>
                                                <InputGroup.Text style={{width: '110px'}}>Discount</InputGroup.Text>
                                                <Form.Control type="text" value={singleInvoice.per_amount || "00"} className='readableInputBgColor text-end' aria-label="Last name" readOnly/>
                                            </InputGroup>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                        </Form.Group>
                                        
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
                                            <InputGroup className="mb-1 mt-1 input-group-dark">
                                                <InputGroup.Text style={{width: '130px'}}>Service Charge</InputGroup.Text>
                                                <Form.Control type="text" value={singleInvoice.ser_amount || "00"} className='readableInputBgColor text-end' aria-label="First name" readOnly/>
                                                <InputGroup.Text style={{width: '110px'}}>Urgent</InputGroup.Text>
                                                <Form.Control value={singleInvoice.urgent_amount || "00"} type="text" className='readableInputBgColor text-end' aria-label="Last name"readOnly/>
                                            </InputGroup>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                        </Form.Group>
                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
                                            <InputGroup className="mb-1 mt-1 input-group-dark">
                                                <InputGroup.Text style={{width: '130px'}}>VAT (%)</InputGroup.Text>
                                                <Form.Control type="text" value={singleInvoice.vat_per || "0%"} className='readableInputBgColor text-end' aria-label="First name" readOnly/>
                                                <InputGroup.Text style={{width: '110px'}}>VAT Amount</InputGroup.Text>
                                                <Form.Control value={singleInvoice.vat_amount || '00'}  readOnly className='readableInputBgColor text-end' aria-label="Last name"/>
                                            </InputGroup>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                        </Form.Group>

                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
                                            <InputGroup className="mb-1 mt-1 input-group-dark">
                                                <InputGroup.Text style={{width: '130px'}}>Total Amount</InputGroup.Text>
                                                <Form.Control aria-label="First name" value={singleInvoice.total_amount || '00'} readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
                                                <InputGroup.Text style={{width: '110px'}}>Gross Total</InputGroup.Text>
                                                <Form.Control  aria-label="Last name" value={singleInvoice.gross_total || '00'} readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
                                            </InputGroup>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                        </Form.Group>

                                        <Form.Group as={Col} md="12" controlId="validationCustom01">
                                            {/* <Form.Label>Discount<span className='text-danger ms-1'></span></Form.Label> */}
                                            <InputGroup className="mb-1 mt-1 input-group-dark">
                                                <InputGroup.Text style={{width: '130px'}}>Advance Amount</InputGroup.Text>
                                                <Form.Control type="text" value={singleInvoice.adv_amount || '00'} className='readableInputBgColor text-end' aria-label="First name" readOnly/>
                                                <InputGroup.Text style={{width: '110px'}}>Due Amount</InputGroup.Text>
                                                <Form.Control  aria-label="Last name" value={singleInvoice.due_amount || '00'} readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
                                            </InputGroup>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    );

};

export default SingleTableFunction;