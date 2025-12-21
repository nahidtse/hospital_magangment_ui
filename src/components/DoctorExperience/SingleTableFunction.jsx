import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setShowData, singleExperienceData, setSingleData }) => {

    // console.log(singleExperienceData)

    const goToDoctorExperienceList = () => {
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
                                <Link to={`${import.meta.env.BASE_URL}doctorexperience/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToDoctorExperienceList}>List</button>
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
                                                    value={singleExperienceData.doctor.doctor_name || ""}

                                                />

                                            </Form.Group>
                                            <Form.Group as={Col} md="2" >
                                                <Form.Label>Speciality</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.doctor.speciality.lookup_value || ""}

                                                />
                                            </Form.Group>
                                            
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>BMDC NO</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.doctor.bmdc_no || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="3">
                                                <Form.Label>Institute</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.institute.lookup_value || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Designation</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.designation.lookup_value || ""}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} md="2">
                                                <Form.Label>Department</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.department.lookup_value || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>From Date</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.from_date || ""}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>To Date</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.to_date || "Current"}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="2" className='mt-4'>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexSwitchCheckChecked"
                                                        checked={singleExperienceData.is_current == 1}
                                                        readOnly
                                                    />
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                        {singleExperienceData.is_current == 1 ? 'Current' : 'Not Current'}
                                                    </label>
                                                </div>
                                            </Form.Group>

                                            <Form.Group as={Col} md="1">
                                                <Form.Label>Period (Year)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={singleExperienceData.period || "Current"}
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