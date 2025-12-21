import { Fragment, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Dropdown, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DefaultData } from '../../common/Commomarreydata';

const MenuForm = () => {

    const [showValidationError, setValidationErrors] = useState({
        module_name: '',

    });

    const [addFormData, setFormData] = useState({
        modulename1: '',
        menuType: '',
        isParent: false,
        topMenu: false,
    });


    const onChangeHandler = (event) => {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;

        setFormData(newFormData);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        const errors = {};

        if (!addFormData.modulename.trim()) {
            errors.module_name = "Module Name is required.";
        }

        // Check if any errors
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }



        try {

            const submitData = {
                module_name: addFormData.modulename,
                is_active: addFormData.isActive ? 1 : 0,
                create_by: 7,
                updated_by: 7
            }

            const result = await fetch('https://cserp.store/api/module/create', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(submitData)
            });

            const response = await result.json();


            if (response.status == 'success') {
                toast.success(response.message);

                // Clear form
                setFormData({
                    modulename: '',
                    isActive: 1

                });
                setValidationErrors({})

            } else {
                if (typeof response.message === 'object') {
                    setValidationErrors(response.message);
                } else {
                    toast.error("Internal Error! Try again later.");
                    console.error(response.message);
                }

            }


        } catch (error) {
            toast.error('Internal Error!! Try again after 5 min.')
            console.log(error);

        }


    }

    const resetHandling = () => {
        setFormData({
            modulename: '',
            isActive: 1

        })
    }



    return (
        <Fragment>
            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className='card-title'>Create Menu</div>
                            <div className="prism-toggle">
                                <Link to={`${import.meta.env.BASE_URL}menuCreate`}>
                                    <button className="btn btn-sm btn-primary">List</button>
                                </Link>

                            </div>
                        </Card.Header>

                        <Card.Body>

                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group controlId="validationCustom01">
                                            <Form.Label>Menu Name <span className='text-danger ms-1'>*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                className='border-dark'
                                                placeholder="Enter module name"
                                                name='modulename1'
                                                value={addFormData.modulename1}
                                                isInvalid={!!showValidationError.module_name1}
                                                onChange={onChangeHandler}
                                            />
                                            <Form.Control.Feedback type='invalid'>{showValidationError.module_name1}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group controlId="validationCustom03">
                                            <Form.Label>
                                                Module Name <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                className="border-dark py-2"
                                                required
                                                name="menuType"
                                                value={addFormData.menuType}
                                                isInvalid={!!showValidationError.menuType}
                                                onChange={onChangeHandler}
                                            >
                                                <option value=""> Select </option>
                                                <option value="dashboard">Dashboard</option>
                                                <option value="reports">Reports</option>
                                                <option value="settings">Settings</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {showValidationError.menuType}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    {/* Tick Mark / Checkbox */}
                                    <Col md={2} className="d-flex align-items-end">
                                        <Form.Group controlId="tickCheckbox">
                                            <Form.Check
                                                type="checkbox"
                                                label="Is Parent?"
                                                name="tickOption"
                                                checked={addFormData.tickOption}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...addFormData,
                                                        tickOption: e.target.checked,
                                                    })
                                                }
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">

                                    <Col md={4}>
                                        <Form.Group controlId="validationCustom03">
                                            <Form.Label>
                                                Parent Menu <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                className="border-dark py-2"
                                                required
                                                name="menuType"
                                                value={addFormData.menuType}
                                                isInvalid={!!showValidationError.menuType}
                                                onChange={onChangeHandler}
                                            >
                                                <option value=""> Select Parent</option>
                                                <option value="dashboard">Dashboard</option>
                                                <option value="reports">Reports</option>
                                                <option value="settings">Settings</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {showValidationError.menuType}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={7}>
                                        <Form.Group controlId="validationCustom01">
                                            <Form.Label>Permission <span className='text-danger ms-1'>*</span></Form.Label>
                                            <Dropdown options={DefaultData} values={[]} placeholder="Choice 1" keepSelectedInList={false} searchable={false} dropdownHandle={false} multi={true} onChange={(values) => { console.log('Selected values:', values); }} />
                                            <Form.Control.Feedback type='invalid'>{showValidationError.module_name1}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group controlId="validationCustom01">
                                            <Form.Label>Sort Order <span className='text-danger ms-1'>*</span></Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                className='border-dark'
                                                placeholder="Enter Order"
                                                name='modulename1'
                                                value={addFormData.modulename1}
                                                isInvalid={!!showValidationError.module_name1}
                                                onChange={onChangeHandler}
                                            />
                                            <Form.Control.Feedback type='invalid'>{showValidationError.module_name1}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group controlId="validationCustom03">
                                            <Form.Label>
                                                Status  <span className="text-danger ms-1">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                className="border-dark py-2"
                                                required
                                                name="menuType"
                                                value={addFormData.menuType}
                                                isInvalid={!!showValidationError.menuType}
                                                onChange={onChangeHandler}
                                            >
                                                <option value="dashboard">Active</option>
                                                <option value="reports">Inactive</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {showValidationError.menuType}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    {/* Tick Mark / Checkbox */}
                                    <Col md={3} className="d-flex align-items-end">
                                        <Form.Group controlId="tickCheckbox2">
                                            <Form.Check
                                                type="checkbox"
                                                label="Top Menu?"
                                                name="topMenu"
                                                checked={addFormData.topMenu}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...addFormData,
                                                        topMenu: e.target.checked,
                                                    })
                                                }
                                            />
                                        </Form.Group>

                                    </Col>
                                </Row>

                                <div className='d-flex justify-content-end pt-2'>
                                    <Button type="submit">Save</Button>
                                </div>
                            </Form>

                        </Card.Body>

                    </Card>
                </Col>
            </Row>
        </Fragment >
    );
};

export default MenuForm;
