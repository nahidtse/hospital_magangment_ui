import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setBusinessUnitList, singleContactsData, setSingleData }) => {

    const goToBusinessUnitList = () => {
        setSingleData(null)
        setBusinessUnitList(false);
    }

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View Business Unit</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}businessunit/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToBusinessUnitList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Business Unit</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.business_unit}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Short Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.short_name}

                                        />

                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Email Address</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="email"
                                                className='readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.email_address}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Mobile Number</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="number"
                                                className='readableInputBgColor'
                                                minLength={11}
                                                maxLength={11}
                                                readOnly
                                                aria-describedby="inputGroupPrepend"
                                                value={singleContactsData.mobile_no}

                                            />

                                        </InputGroup>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Address</Form.Label>
                                        <div className="mb-3">
                                            <Form.Control
                                                readOnly
                                                as='textarea'
                                                rows={5}
                                                className='readableInputBgColor'
                                                name='address'
                                                value={singleContactsData.address}


                                            ></Form.Control>
                                        </div>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Logo (Image Upload)</Form.Label>
                                        <div
                                            id="logoDrop"
                                            className="p-3 d-flex align-items-start gap-3"
                                            style={{ minHeight: '100px' }}
                                        >

                                            <img
                                                src={`https://cserp.store/storage/logos/${singleContactsData.logo}`}
                                                alt="No image"
                                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                                            />

                                        </div>

                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexSwitchCheckChecked"
                                                checked={singleContactsData.is_active == 1}
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singleContactsData.is_active == 1 ? 'Active' : 'Inactive'}
                                            </label>
                                        </div>
                                    </Form.Group>
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




