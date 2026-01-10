import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


const RoleSingleTableFunction = () => {

    const location = useLocation();
    const singleRoleData = location.state?.singleData || '';
    // console.log(singleRoleData)

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View Role</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}role/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Role Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleRoleData?.role_name || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Create By</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleRoleData?.created_by?.full_name || ''}

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
                                                checked={singleRoleData.is_active == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singleRoleData.is_active == 1 ? 'Active' : 'Inactive'}
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

export default RoleSingleTableFunction;