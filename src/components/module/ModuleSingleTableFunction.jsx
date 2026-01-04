import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


const ModuleSingleTableFunction = () => {

    const location = useLocation();
    const singleModuleData = location.state?.singleData || '';

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View Module</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}module/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" >
                                        <Form.Label>Module Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor'
                                            readOnly
                                            value={singleModuleData.module_name || ''}

                                        />

                                    </Form.Group>

                                    <Form.Group as={Col} md="6" className='mt-4'>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexSwitchCheckChecked"
                                                checked={singleModuleData.is_active == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singleModuleData.is_active == 1 ? 'Active' : 'Inactive'}
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

export default ModuleSingleTableFunction;
