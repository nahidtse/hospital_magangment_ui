import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setShowData, singleBankAccount, setSingleData }) => {


    const goToBankAccountList = () => {
        setSingleData(null);
        setShowData(false);
    }
    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Bank Account</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}moneyreceipt/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToBankAccountList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={12}>
                                    <Form>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Account Name<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Account Name'
                                                    // value={addFormData.accountName}
                                                    readOnly
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Account Number<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Account Number'
                                                    // value={addFormData.accountNumber}
                                                    readOnly
                                                />
                                            </Form.Group> 

                                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                                <Form.Label>Bank Name<span className='text-danger ms-1'>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Branch name'
                                                    // value={addFormData.branchName}
                                                    readOnly
                                                />
                                            </Form.Group>              
                                        </Row>

                                        <Row className='mt-2'>
                                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                                            <Form.Label>Branch Name<span className='text-danger ms-1'></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                placeholder='Type Branch name'
                                                // value={addFormData.branchName}
                                                readOnly
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                            <Form.Label>Opening Date<span className='text-danger ms-1'></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                placeholder='Type Branch name'
                                                // value={addFormData.branchName}
                                                readOnly
                                            />
                                        </Form.Group> 

                                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                                            <Form.Label>Opening Balance<span className='text-danger ms-1'></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                placeholder='Type Opening Balance'
                                                // value={addFormData.openingBalance}
                                                readOnly
                                            />
                                        </Form.Group> 
                                        </Row>

                                        <Row className='mt-2'>
                                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                                <Form.Label>Business Unit<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Branch name'
                                                    // value={addFormData.branchName}
                                                    readOnly
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Route No<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Route No'
                                                    // value={addFormData.routeNo}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>
                                                
                                                <Form.Group controlId="tickCheckbox">
                                                    <Form.Check
                                                    type="checkbox"
                                                    // label={addFormData.status ? 'active' : 'Deactive'}
                                                    // checked={addFormData.status === 1}
                                                    />
                                                </Form.Group>
                                            </Form.Group>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    );

};

export default SingleTableFunction;