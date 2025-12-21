import { Fragment } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const SingleTableFunction = ({ setBusinessUnitList, singlelookupTypesData, setSingleData }) => {

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

                            <div className='card-title'>View Lookup Type</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}lookuptype/dataTable`}>
                                    <button className="btn btn-sm btn-primary" onClick={goToRoleList}>List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Form>
                                <Row className="mb-3">
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Lookup Type Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='border-dark readableInputBgColor'
                                            readOnly
                                            value={singlelookupTypesData.lookup_type}

                                        />

                                    </Form.Group>
                                    <Form.Group as={Col} md="4" >
                                        <Form.Label>Lookup Code Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            className='border-dark readableInputBgColor'
                                            readOnly
                                            value={singlelookupTypesData.lookup_code}

                                        />

                                    </Form.Group>

                                    <Form.Group as={Col} md="4" className='mt-4'>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="flexSwitchCheckChecked"
                                                checked={singlelookupTypesData.is_active == 1}
                                                readOnly
                                            />
                                            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                                {singlelookupTypesData.is_active == 1 ? 'Active' : 'Inactive'}
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