import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setShowData, singleScheduleData, setSingleData }) => {

    // console.log(singleScheduleData)

    const goToChamberScheduleList = () => {
        setSingleData(null);
        setShowData(false);
    }
    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Chamber Schedule</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}chamberschedule/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToChamberScheduleList}>List</button>
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
                                                    value={singleScheduleData.doctor.doctor_name || ""}

                                                />

                                            </Form.Group>
                                            <Form.Group as={Col} md="2" >
                                                <Form.Label>Speciality</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleScheduleData.doctor.speciality.lookup_value || ""}

                                                />
                                            </Form.Group>
                                            
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>BMDC NO</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleScheduleData.doctor.bmdc_no || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>Days</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleScheduleData.days || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Shift</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleScheduleData.shift_name || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>Time (From)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleScheduleData.time_from || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>Time (To)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleScheduleData.time_to || ""}
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