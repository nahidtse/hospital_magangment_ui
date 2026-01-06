import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// const API_BASE_URL = 'http://localhost:8000';

const DoctorsProfile = ({ setBusinessUnitList, singleContactsData, setSingleData }) => {

    const degreeNames = singleContactsData.degrees && singleContactsData.degrees.length > 0 ? singleContactsData.degrees.map(d => d.lookup_value).join(", ") : "";
    // console.log(degreeNames)
    // console.log(singleContactsData)

    const goToRoleList = () => {
        setSingleData(null)
        setBusinessUnitList(false);
    }
    
    // const getImageUrl = (imagePath) => {
    //     if (imagePath) {
    //         return `${API_BASE_URL}/storage/${imagePath}`;
    //     }
    //     return '/path/to/default/image.png'; 
    // };

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Doctor's Profile</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}doctorsinfo/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToRoleList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={8}>
                                    <Form>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="6" >
                                                <Form.Label>Doctor Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    readOnly
                                                    value={singleContactsData.doctor_name || ""}

                                                />

                                            </Form.Group>
                                            <Form.Group as={Col} md="6" >
                                                <Form.Label>Specialty</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    readOnly
                                                    value={singleContactsData.speciality.lookup_value || ""}

                                                />

                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} md="6" className='mt-2'>
                                                <Form.Label>Degree</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    readOnly
                                                    value={degreeNames || ""}

                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} md="6">
                                                <Row>
                                                    <Form.Group as={Col} md="6" className='mt-2'>
                                                        <Form.Label>BMDC NO</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className='border-dark readableInputBgColor'
                                                            readOnly
                                                            value={singleContactsData.bmdc_no || ""}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} md="6" className='mt-2'>
                                                        <Form.Label>Doctor ID</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            className='border-dark readableInputBgColor'
                                                            readOnly
                                                            value={singleContactsData.doctor_id || ""}
                                                        />
                                                    </Form.Group>
                                                </Row>
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group as={Col} md="6" className='mt-4'>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="flexSwitchCheckChecked"
                                                        checked={singleContactsData.is_active == 1}
                                                        readOnly
                                                    />
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                        {singleContactsData.is_active == 1 ? 'Active' : 'Inactive'}
                                                    </label>
                                                </div>
                                            </Form.Group>
                                        </Row>
                                    </Form>
                                </Col>
                                {/* Right Side: Doctor Image */}
                                <Col md={4} className="text-center">
                                    
                                    <div className="mt-3">
                                        <img src={singleContactsData.image || ""} alt={singleContactsData.doctor_name || "Doctor Image"} style={{border: "1px solid #d3d3d3", borderRadius: "6px",}} height={200}/>
                                    </div>
                                </Col>
                                <Col md={12}>

                                    <Row>
                                        <div className='mt-4'><h6>Consultation Fee</h6></div>
                                        <div style={{borderBottom: "1px solid #ccc"}}></div>
                                    </Row>

                                    <Row>
                                        <Form.Group as={Col} md="2" className='mt-2'>
                                            <Form.Label>Consultation Fee</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.consultation_fee || ""}

                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" className='mt-2'>
                                            <Form.Label>Vat ( % )</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.vat || ""}

                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" controlId="validationCustom01" className='mt-2'>
                                        <Form.Label>Vat Included <span className='text-danger ms-1'></span></Form.Label>
                                        
                                        <Form.Group controlId="tickCheckbox">
                                            <Form.Check
                                                type="checkbox"
                                                label={singleContactsData.vat_included ? 'Yes' : 'No'}
                                                name="tickOption"
                                                checked={singleContactsData.vat_included === 1}
                                                readOnly
                                            />
                                        </Form.Group>
                                        {/* <Form.Control.Feedback type='invalid'>{showValidationError.doctor_name}</Form.Control.Feedback> */}
                                    </Form.Group>
                                        <Form.Group as={Col} md="2" className='mt-2'>
                                            <Form.Label>Followup_fee</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.followup_fee || ""}

                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" className='mt-2'>
                                            <Form.Label>Within ( day )</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.within_day || ""}

                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} md="2" className='mt-2'>
                                            <Form.Label>Consultation Time ( Min )</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.consultation_time || ""}

                                            />
                                        </Form.Group>
                                    </Row>

                                    <Row>
                                        <div className='mt-5'><h6>About Doctor</h6></div>
                                        <div style={{borderBottom: "1px solid #ccc"}}></div>
                                    </Row>
                                    <Row className="mb-3 mt-3">
                                        <Form.Group as={Col} md="12" controlId="validationCustomUsername">
                                            <div className="mb-3">
                                                <Form.Control
                                                as='textarea'
                                                rows={5}
                                                className='border-dark readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.about_doctor || ""}
                                                >
                                                </Form.Control>
                                            </div>
                                        </Form.Group>
                                    </Row>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    );

};

export default DoctorsProfile;