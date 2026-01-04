import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


const PermissionSingleTableFunction = () => {

    const location = useLocation();
    const singlePermissionData = location.state?.singleData

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View Permission</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}permission/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Permission Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singlePermissionData.permission_name || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Module Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singlePermissionData.module.module_name || ''}

                                        />

                                    </Form.Group>

                                    <Form.Group as={Col} md="4">
                                         <Form.Label> </Form.Label>
                                        <div className="form-check form-switch mt-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexSwitchCheckChecked"
                                                checked={singlePermissionData.is_active == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singlePermissionData.is_active == 1 ? 'Active' : 'Inactive'}
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

export default PermissionSingleTableFunction;