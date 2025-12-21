import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const MenuView = ({ setBusinessUnitList, singleContactsData, setSingleData }) => {

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

                            <div className='card-title'>View Menu Create</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}menuCreate`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToBusinessUnitList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Menu Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.menuname || "No Menu Name Assigned"}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Model Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.modelname || "No Model Name Assigned"}

                                        />

                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Parent Menu</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="email"
                                                className='readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.parentmenu || "No Parent Name Assigned"}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Permission</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="number"
                                                className='readableInputBgColor'
                                                minLength={11}
                                                maxLength={11}
                                                readOnly
                                                aria-describedby="inputGroupPrepend"
                                                value={singleContactsData.permission || 0}

                                            />

                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>Sort Order</Form.Label>
                                        <InputGroup hasValidation>
                                            <Form.Control
                                                type="email"
                                                className='readableInputBgColor'
                                                readOnly
                                                value={singleContactsData.sortorder || "No Sort Order Assigned"}
                                            />
                                        </InputGroup>
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

export default MenuView;





