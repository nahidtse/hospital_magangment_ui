import { Fragment, useState } from 'react';

import { Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { format, parseISO } from "date-fns";
import InvoicePrint from '../../common/utils/InvoicePrint';


const SingleTableFunction = ({ setShowData, singleInvoice, setSingleData }) => {


    console.log(singleInvoice)

    //--------Adv & total Collection Amount Start -----------
    const totalDuesAmountCollection = singleInvoice?.money_receipt?.reduce(
        (sum, item) => sum + Number(item?.mr_amount || 0),
        0
    ) || 0;

    const PresentDuesAmount = singleInvoice.gross_total - totalDuesAmountCollection;
    //--------Adv & total Collection Amount End -----------


    //-----------Invoice Pdf Start------------------
    const [invoiceData, setInvoiceData] = useState(null);  //For Invoice
    const [actionType, setActionType] = useState("download");  //For Invoice ActionType "Print"/"Download"
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);  // For Duble Click problem
    


    const handleInvoiceAction = (singleInvoice, type) => {
        if (isGeneratingPdf) return; // block double click
        setIsGeneratingPdf(true);
        setActionType(type) //set action type

        const formatedData = {
            master : {...singleInvoice},
            details: singleInvoice.invoice_details || [],
            moneyReceipt: singleInvoice.money_receipt || [],
            doctorNameById: singleInvoice.doctor_info || null
        }
        setInvoiceData(formatedData); // triggers useEffect
    };
    //-----------Invoice Pdf End------------------


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

                                <span 
                                    onClick={() => !isGeneratingPdf && handleInvoiceAction(singleInvoice, "download")} 
                                    className={`btn btn-md me-2 px-3 ${isGeneratingPdf ? "bg-secondary" : "bg-success"}`}
                                    style={{ cursor: isGeneratingPdf ? "not-allowed" : "pointer" }}
                                >
                                    <i className="bi bi-file-pdf"></i>
                                </span>

                                {/* Hidden invoice render */}
                                {invoiceData && (
                                <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                                    <InvoicePrint
                                        invoiceData={invoiceData} 
                                        actionType={actionType} 
                                        onDone={() => {
                                            setInvoiceData(null);
                                            setIsGeneratingPdf(false); // unlock
                                        }}
                                    />
                                </div>
                                )}

                                <Link to={`${import.meta.env.BASE_URL}invoicediagonestic/dataTable`}>
                                    <button className="btn btn-md btn-primary" onClick={goToInvoiceList}>List</button>
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
                                                    value={singleInvoice.invoice_date ? format(parseISO(singleInvoice.invoice_date), "dd-MM-yyyy") : ""}
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
                                                    value={singleInvoice.dob ? format(parseISO(singleInvoice.dob), "dd-MM-yyyy") : ""}
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

                                        <Row>
                                            <Table size="sm" bordered hover responsive className="table text-nowrap table-bordered mt-2">
                                                <thead>
                                                     <tr className="text-center">
                                                        <th className="bg-primary text-white">Code</th>
                                                        <th className="bg-primary text-white">Test Name</th>
                                                        <th className="bg-primary text-white">Delivery Instraction</th>
                                                        <th className="bg-primary text-white">Room No</th>
                                                        <th className="bg-primary text-white">Qty</th>
                                                        <th className="bg-primary text-white">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {singleInvoice.invoice_details.length > 0 ? (
                                                    <>
                                                    {singleInvoice.invoice_details.map((item, index) => (
                                                        <tr key={item.id || index}>
                                                            <td className="text-center">{item.test_info.test_code}</td>
                                                            <td>{item.test_info.test_name}</td>
                                                            <td>{item.test_info.delivery_instruction}</td>
                                                            <td className="text-center">{item.test_info.room_no}</td>
                                                            <td className="text-end">{item.quantity}</td>
                                                            <td className="text-end">{ item.test_info.amount }</td>
                                                        </tr>
                                                    ))}

                                                    {/* Total Amount Row */}
                                                    <tr>
                                                        <td colSpan="5" style={{ padding: '5px 5px' }} className="text-end fw-bold">Total Amount:</td>
                                                        <td className="fw-bold text-end">{Number(singleInvoice?.total_amount).toLocaleString("en-US") || '0.00'}</td>
                                                    </tr>
                                                    </>
                                                ):(<tr><td  colSpan="7" className="text-center">No Tests Added</td></tr>)}
                                                </tbody>
                                            </Table>
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
                                                <Form.Control type="text" value={totalDuesAmountCollection || '00'} className='readableInputBgColor text-end' aria-label="First name" readOnly/>
                                                <InputGroup.Text style={{width: '110px'}}>Due Amount</InputGroup.Text>
                                                <Form.Control  aria-label="Last name" value={PresentDuesAmount || '00'} readOnly tabIndex={-1} className='readableInputBgColor text-end'/>
                                            </InputGroup>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.test}</Form.Control.Feedback> */}
                                        </Form.Group>

                                        <Row className="mt-1 p-3">
                                            <Col md={12} className="p-2 border border-dark rounded">
                                                {singleInvoice?.money_receipt?.length > 0 ? (
                                                <Table bordered size="sm">
                                                    <thead>
                                                    <tr className="text-center">
                                                        <th className="bg-primary text-white">Date</th>
                                                        <th className="bg-primary text-white">Type</th>
                                                        <th className="bg-primary text-white">Amount</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {singleInvoice.money_receipt.map((item, index) => (
                                                        <tr key={item.id || index}>
                                                        <td className="text-center">
                                                            {item?.money_receipt_date
                                                            ? format(parseISO(item.money_receipt_date), "dd-MM-yyyy")
                                                            : ""}
                                                        </td>
                                                        <td className="text-center">{item?.activity_type?.lookup_value}</td>
                                                        <td className="text-end">
                                                            {Number(item?.mr_amount || 0).toLocaleString("en-US")}
                                                        </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={2} className="text-end fw-bold">Total:</td>
                                                            <td className="text-end fw-bold">{totalDuesAmountCollection.toLocaleString("en-US")}</td>
                                                        </tr>
                                                    </tfoot>
                                                </Table>
                                                ) : (
                                                "Money Receipt Not Found"
                                                )}
                                            </Col>
                                        </Row>
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