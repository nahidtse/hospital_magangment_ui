import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setShowData, singleLeaveData, setSingleData }) => {

    // console.log(singleLeaveData)

    const goToLeaveList = () => {
        setSingleData(null);
        setShowData(false);
    }
    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Doctor's Experience</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}leaveinfo/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToLeaveList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={12}>
                                    <Form>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Doctor Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.doctor.doctor_name || ""}

                                                />

                                            </Form.Group>
                                            <Form.Group as={Col} md="2" >
                                                <Form.Label>Speciality</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.doctor.speciality.lookup_value || ""}

                                                />
                                            </Form.Group>
                                            
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>BMDC NO</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.doctor.bmdc_no || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>Total Days</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.total_days || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Leave From</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.formatted_leave_from || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Leave To</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.formatted_leave_to || ""}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Join Date</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.formatted_join_date || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="10">
                                                <Form.Label>Remarks</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    rows={4}
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleLeaveData.remarks || ""}
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

export default SingleTableFunction;