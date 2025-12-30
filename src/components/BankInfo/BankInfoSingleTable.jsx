import { Fragment, useEffect, useState } from 'react';

import { Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const BankInfoSingleTable = () => {
    const  {id} = useParams();

    //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
    //*********Check Authentication End***********


    const [bankInfo, setBankInfo] = useState({});
    // console.log(bankInfo)

    useEffect(() => {
        if(!id) return;

        fetch(`${baseURL}/bank_info/single_data/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
            setBankInfo(data.data);
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

                            <div className='card-title'>Bank Info</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}bankinfo/dataTable`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>
                            </div>

                        </Card.Header>

                        <Card.Body className=''>

                            <Row>
                                <Col md={12}>
                                    <Form>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="6" >
                                                <Form.Label>Bank Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={bankInfo?.bank_name || ""}

                                                />

                                            </Form.Group>
                                            <Form.Group as={Col} md="6" >
                                                <Form.Label>Short Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={bankInfo?.short_name || ""}

                                                />
                                            </Form.Group>
                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="6" >
                                                <Form.Label>Business Unit</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='readableInputBgColor border-dark'
                                                    readOnly
                                                    value={bankInfo?.business_unit?.business_unit || ""}

                                                />

                                            </Form.Group>

                                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                            <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>      
                                            <Form.Group controlId="tickCheckbox">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={bankInfo?.is_active ? 'Active': 'Deactive' || ''}
                                                    checked={bankInfo?.is_active === 1 || ''}
                                                    readOnly
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

export default BankInfoSingleTable;