import { Fragment, useEffect, useState } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';


const TestInfoSingleTable = () => {
   const location = useLocation();
   const singleTestInfo = location.state?.test

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Test Info</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}testinfo/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={12}>
                                    <Form>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Test Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleTestInfo?.test_code || ""}

                                                />

                                            </Form.Group>
                                            
                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Short Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleTestInfo?.test_name || ""}

                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Delivery Instruction</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleTestInfo?.delivery_instruction || ""}

                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Room No</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleTestInfo?.room_no || ""}

                                                />

                                            </Form.Group>
                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleTestInfo?.amount || ""}

                                                />

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

export default TestInfoSingleTable;