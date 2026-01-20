import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';


const UserSingleTableFunction = () => {
    const location = useLocation();
    const singleUser = location.state?.singleData || ''
    // console.log(singleUser)

    const userTypeId = Number(singleUser?.user_type_id);

    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>View User</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}user/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-2">
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>User Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser.user_name || ''}
                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser.full_name || ''}

                                        />

                                    </Form.Group>

                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser.email || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>Mobile No</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser.mobile_no || ''}

                                        />

                                    </Form.Group>
                                </Row>

                                <Row className="mb-2">
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>From Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser.from_date ? format(parseISO(singleUser.from_date), "dd-MM-yyyy") : ""}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>To Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser.to_date ? format(parseISO(singleUser.to_date), "dd-MM-yyyy") : ""}

                                        />

                                    </Form.Group>

                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>Role</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser?.role?.role_name || ''}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>Create By</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser?.created_by?.user_name || ''}

                                        />

                                    </Form.Group>
                                </Row>
                                <Row className="mb-2">
                                    <Form.Group as={Col} md="3" >
                                        <Form.Label>User Type</Form.Label>
                                        <Form.Control
                                            type="text"
                                            maxLength={20}
                                            className='readableInputBgColor border-dark'
                                            readOnly
                                            value={singleUser?.user_type?.user_type || ''}
                                        />

                                    </Form.Group>

                                    {(singleUser.user_type_id == 4 || singleUser.user_type_id == 5) && (
                                        <Form.Group as={Col} md="3" >
                                            <Form.Label>Doctor's Name</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                row={4}
                                                className='readableInputBgColor border-dark'
                                                readOnly
                                                value={singleUser.doctors_info?.map((doctor => doctor.doctor_name)).join(', ') || ''}

                                            />

                                        </Form.Group>
                                    )}

                                    {[2, 3, 5].includes(userTypeId) && (
                                        <Form.Group as={Col} md="3">
                                            <Form.Label>Business Unit</Form.Label>
                                            <Form.Control
                                            as="textarea"
                                            rows={3}
                                            className="readableInputBgColor border-dark"
                                            readOnly
                                            value={
                                                singleUser?.businessUnit
                                                ?.map(bu => bu.business_unit)
                                                .join(', ') || ''
                                            }
                                            />
                                        </Form.Group>
                                        )}

                                    <Form.Group as={Col} md="3" className='mt-4'>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexSwitchCheckChecked"
                                                checked={singleUser.is_active == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singleUser.is_active == 1 ? 'Active' : 'Inactive'}
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

export default UserSingleTableFunction;