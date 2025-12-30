import { Fragment, useEffect, useState } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { format, parseISO } from "date-fns";
const baseURL = import.meta.env.VITE_API_BASE_URL;


const MoneyReceiptSingleTable = () => {

    const {id} = useParams();
    // console.log(id)

    //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
    //*********Check Authentication End***********
    

    const [moneyReceipt, setMoneyReceipt] = useState({});
    // console.log(moneyReceipt)

    useEffect(() => {
        // if(!id) return;

        fetch(`${baseURL}/money_receipt/single_data/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
            setMoneyReceipt(data.data);
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });

    }, [id])

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Money Receipt</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}moneyreceipt/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={4}>
                                    <Row>
                                        <InputGroup>
                                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Money Receipt No</InputGroup.Text>
                                        <Form.Control
                                            className='border-dark readableInputBgColor' 
                                            aria-label="First name"
                                            value={moneyReceipt.money_receipt_no || ""}
                                            readOnly 
                                        />
                                        </InputGroup>              
                                    </Row>
                                    <Row>
                                        <InputGroup>
                                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Money Receipt Date</InputGroup.Text>
                                        <Form.Control
                                            className='border-dark readableInputBgColor' 
                                            aria-label="First name"
                                            value={moneyReceipt.money_receipt_date ? format(parseISO(moneyReceipt.money_receipt_date), "dd-MM-yyyy") : ''}
                                            readOnly 
                                        />
                                        </InputGroup>              
                                    </Row>
                                    <Row>
                                        <InputGroup>
                                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Patient</InputGroup.Text>
                                        <Form.Control
                                            className='border-dark readableInputBgColor' 
                                            aria-label="First name"
                                            value={moneyReceipt?.patient_info?.patient_name || ''}
                                            readOnly 
                                        />
                                        </InputGroup>               
                                    </Row>
                                    <Row>
                                        <InputGroup>
                                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Payment Type</InputGroup.Text>
                                        <Form.Control
                                            className='border-dark readableInputBgColor' 
                                            aria-label="First name"
                                            value={moneyReceipt?.payment_type?.lookup_value || ''}
                                            readOnly 
                                        />             
                                        </InputGroup>              
                                    </Row>
                                    <Row>
                                        <InputGroup>
                                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Activity Type</InputGroup.Text>
                                        <Form.Control
                                            className='border-dark readableInputBgColor' 
                                            aria-label="First name"
                                            value={moneyReceipt?.activity_type?.lookup_value || ""}
                                            readOnly 
                                        />
                                        </InputGroup>             
                                    </Row>
                                    {moneyReceipt?.mobile_no  &&
                                        <Row>
                                            <InputGroup>
                                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Mobile no</InputGroup.Text>
                                            <Form.Control
                                                className='border-dark readableInputBgColor' 
                                                aria-label="First name"
                                                value={moneyReceipt.mobile_no || ''}
                                                readOnly 
                                            />
                                            </InputGroup>             
                                        </Row>
                                    }
                                    <Row>
                                        <InputGroup>
                                        <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Amount</InputGroup.Text>
                                        <Form.Control
                                            className='border-dark readableInputBgColor' 
                                            aria-label="First name"
                                            value={Number(moneyReceipt.mr_amount || '').toLocaleString('en-US')}
                                            readOnly 
                                        />
                                        </InputGroup>             
                                    </Row>
                                    {moneyReceipt?.cheque_no && 
                                        <Row>
                                            <InputGroup>
                                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Cheque?Ref No</InputGroup.Text>
                                            <Form.Control
                                                className='border-dark readableInputBgColor' 
                                                aria-label="First name"
                                                value={moneyReceipt.cheque_no || ''}
                                                readOnly 
                                            />
                                            </InputGroup>             
                                        </Row>
                                    }
                                    {moneyReceipt?.afm_bank?.bank_name && 
                                        <Row>
                                            <InputGroup>
                                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Bank Name</InputGroup.Text>
                                            <Form.Control
                                                className='border-dark readableInputBgColor' 
                                                aria-label="First name"
                                                value={moneyReceipt?.afm_bank?.bank_name}
                                                readOnly 
                                            />
                                            </InputGroup>             
                                        </Row>
                                    }
                                    {moneyReceipt?.branch_name && 
                                        <Row>
                                            <InputGroup>
                                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Branch Name</InputGroup.Text>
                                            <Form.Control
                                                className='border-dark readableInputBgColor' 
                                                aria-label="First name"
                                                value={moneyReceipt.branch_name || ''}
                                                readOnly 
                                            />
                                            </InputGroup>             
                                        </Row>
                                    }
                                    {moneyReceipt?.cheque_date &&
                                        <Row>
                                            <InputGroup>
                                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Cheque Date</InputGroup.Text>
                                            <Form.Control
                                                className='border-dark readableInputBgColor' 
                                                aria-label="First name"
                                                value={moneyReceipt.cheque_date ? format(parseISO(moneyReceipt.cheque_date), "dd-MM-yyyy") : ''}
                                                readOnly 
                                            />
                                            </InputGroup>             
                                        </Row>
                                    }
                                    {moneyReceipt?.remarks  && 
                                        <Row>
                                            <InputGroup>
                                            <InputGroup.Text className='border-end border-dark' style={{ minWidth: '150px', width: '150px' }}>Remarks</InputGroup.Text>
                                            <Form.Control
                                                className='border-dark readableInputBgColor' 
                                                aria-label="First name"
                                                value={moneyReceipt.remarks || ''}
                                                readOnly 
                                            />
                                            </InputGroup>             
                                        </Row>
                                    }
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

export default MoneyReceiptSingleTable;