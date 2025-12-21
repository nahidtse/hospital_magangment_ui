import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setBusinessUnitList, singleContactsData, setSingleData }) => {

    const goToRoleList = () => {
        setSingleData(null)
        setBusinessUnitList(false);
    }

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View Permission</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}permission/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToRoleList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Permission Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.permission_name}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Module Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.module.module_name}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Create By</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleContactsData.create_by}

                                        />

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