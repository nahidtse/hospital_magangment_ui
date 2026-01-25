import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setShowData, singleAppointment, setSingleData }) => {


    //Status
    const statusMap = {
        0: 'Cancel',
        1: 'Booked',
        2: 'Checked In',
        3: 'In Consultation',
        4: 'Completed',
        5: 'Absent',
        6: 'Reschedule',
        7: 'Checked In Cancel'
    };

    const goToAppointmentList = () => {
        setSingleData(null);
        setShowData(false);
    }

    // console.log(singleAppointment)
    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Doctor's Appointment</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}appointment/dataTable`}>
                                    <button className="btn btn-primary" onClick={goToAppointmentList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={12}>
                                    <Form>
                                        <Row className="mb-2">
                                            <Form.Group as={Col} md="" >
                                                <Form.Label>Doctor Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.business_unit?.business_unit || ""}
                                                />

                                            </Form.Group>

                                            <Form.Group as={Col} md="3" >
                                                <Form.Label>Doctor Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.doctor.doctor_name || ""}

                                                />

                                            </Form.Group>
                                            <Form.Group as={Col} md="2" >
                                                <Form.Label>Speciality</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.doctor.speciality.lookup_value || ""}

                                                />
                                            </Form.Group>
                                            
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>BMDC NO</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.doctor.bmdc_no || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>Appointment Date</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.appointment_date || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Patient Id</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.patient_id || ""}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Patient Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.patient_name || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Mobile Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.mobile_no || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.email_no || ""}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Consultation Fee</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.consultation_fee || ""}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={statusMap[singleAppointment.status] || ''}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Created By</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.created_by?.full_name || ""}
                                                />
                                            </Form.Group>
                                        </Row>

                                        <Row className='mt-2'>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Remarks</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    rows={2}
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleAppointment.remarks || ""}
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