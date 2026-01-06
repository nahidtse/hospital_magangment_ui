import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';


const MenuSingleTableFunction = () => {

    const location = useLocation();
    const singleMenuData = location.state?.singleData || '';

    console.log(singleMenuData)
    
    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View Menu</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}menu/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Menu Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleMenuData.menu_name || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Module Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleMenuData.module?.module_name || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label></Form.Label>
                                        <div className="form-check form-switch mt-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={singleMenuData.is_parent == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                            Is Parent?
                                            </label>
                                        </div>
                                    </Form.Group>


                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Permission</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={
                                                singleMenuData.permissions && singleMenuData.permissions.length > 0
                                                    ? singleMenuData.permissions.map(p => p.permission_name).join(', ')
                                                    : ''
                                            }

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Sort Order</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleMenuData.sort_order || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="4">
                                        <Form.Label></Form.Label>
                                        <div className="form-check form-switch mt-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={singleMenuData.is_active == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singleMenuData.is_active == 1 ? 'Active' : 'Inactive'}
                                            </label>
                                        </div>
                                    </Form.Group>

                                </Row>

                                <Row className="mb-3">

                                </Row>
                            </Form>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    );



};

export default MenuSingleTableFunction;
