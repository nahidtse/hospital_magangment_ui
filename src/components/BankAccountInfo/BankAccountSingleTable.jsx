import { Fragment, useEffect, useState } from 'react';

import { Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const BankAccountSingleTable = () => {

    const {id} = useParams();
    console.log(id)


    const [bankAccount, setBankAccount] = useState({});
    console.log(bankAccount)

    useEffect(() => {
        if(!id) return;

        fetch(`${baseURL}/bank_account/single_data/${id}`)
            .then((response) => response.json())
            .then((data) => {
            setBankAccount(data.data);
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });

    }, [id])


    return (
        <Fragment>

            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">

                            <div className='card-title'>Bank Account</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}bankaccount/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={12}>
                                    <Form>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Account Name<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Account Name'
                                                    value={bankAccount.ac_name || ''}
                                                    readOnly
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Account Number<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Account Number'
                                                    value={bankAccount.ac_number || ''}
                                                    readOnly
                                                />
                                            </Form.Group> 

                                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                                <Form.Label>Bank Name<span className='text-danger ms-1'>*</span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Branch name'
                                                    value={bankAccount?.afm_bank?.bank_name || ''}
                                                    readOnly
                                                />
                                            </Form.Group>              
                                        </Row>

                                        <Row className='mt-2'>
                                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                                            <Form.Label>Branch Name<span className='text-danger ms-1'></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                placeholder='Type Branch name'
                                                value={bankAccount.branch_name}
                                                readOnly
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationCustom02">
                                            <Form.Label>Opening Date<span className='text-danger ms-1'></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                placeholder='Type Branch name'
                                                value={bankAccount.opening_date ? format(parseISO(bankAccount.opening_date), 'dd-MM-yyyy') : ''
                                                }
                                                readOnly
                                            />
                                        </Form.Group> 

                                        <Form.Group as={Col} md="4" controlId="validationCustom01">
                                            <Form.Label>Opening Balance<span className='text-danger ms-1'></span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='border-dark readableInputBgColor'
                                                placeholder='Type Opening Balance'
                                                value={bankAccount.opening_balance}
                                                readOnly
                                            />
                                        </Form.Group> 
                                        </Row>

                                        <Row className='mt-2'>
                                            <Form.Group as={Col} md="4" controlId="validationCustom02">
                                                <Form.Label>Business Unit<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Branch name'
                                                    value={bankAccount?.business_unit?.business_unit || ''}
                                                    readOnly
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Route No<span className='text-danger ms-1'></span></Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='border-dark readableInputBgColor'
                                                    placeholder='Type Route No'
                                                    value={bankAccount.route_no}
                                                />
                                            </Form.Group>

                                            <Form.Group as={Col} md="4" controlId="validationCustom01">
                                                <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>
                                                
                                                <Form.Group controlId="tickCheckbox">
                                                    <Form.Check
                                                    type="checkbox"
                                                    label={bankAccount?.is_active ? 'active' : 'Deactive'}
                                                    checked={bankAccount?.is_active === 1}
                                                    />
                                                </Form.Group>
                                            </Form.Group>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    );

};

export default BankAccountSingleTable;