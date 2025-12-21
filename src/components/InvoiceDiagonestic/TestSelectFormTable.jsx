import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import Select from "react-select";
const basURL = import.meta.env.VITE_API_BASE_URL;

const TestSelectFormTable = ({
    addFormData,
    setFormData,
    customStyles,
    showValidationError,
    totalAmount,
}) => {

    const [testInfo, setTestInfo] = useState([]); // TestInfo get all


    //Get all Test Info start
    useEffect(() => {
        fetch(`${basURL}/testinfo`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data)
            setTestInfo(data.data);
        })
    }, []);

    // Helper Function: doctorsInfo convert to react-select option
    const testInfoOptions = testInfo.map(test => ({
        value: test.id,
        label: `${test.test_code}  (${test.test_name})`,
        }));
    //Get all Test Info end

    //Test Change Handler
    const onChangeTestHandler = (selectedTest) => {
        if(!selectedTest) {
            return;
        }

        if(selectedTest) {
            const selectedTestInfo = testInfo.find(test => test.id === selectedTest.value);
        
            setFormData(prev => ({
            ...prev,

            testId: selectedTestInfo.id,
            testCode: selectedTestInfo.test_code,
            testName: selectedTestInfo.test_name,
            deliveryInstruction: selectedTestInfo.delivery_instruction,
            roomNo: selectedTestInfo.room_no,
            amount: selectedTestInfo.amount,
            }))
        }
    }

    //Quantity Change Handle
    const handleQtyChange = (index, value) => {
        const quantity = Number(value) || 1;

        setFormData(prev => {
            const updateTestStor = [...prev.testListStor];
            updateTestStor[index].quantity = quantity;
            updateTestStor[index].amount = updateTestStor[index].baseAmount * quantity;

            return {...prev, testListStor:updateTestStor}
        })
    }

    //Add Test List Function
    const addHandleTest = (e) => {
        e.preventDefault();

        if (!addFormData.testId) return;

        // Check if already exist
        const isAlreadyAdded = addFormData.testListStor.some(
        (test) => test.testId === addFormData.testId
        );

        if (isAlreadyAdded) {
        toast.error("This test is already added.", { autoClose: 1200 });
        return;
        }

        const newTest = {
        testId: addFormData.testId,
        testCode: addFormData.testCode,
        testName: addFormData.testName,
        deliveryInstruction: addFormData.deliveryInstruction,
        roomNo: addFormData.roomNo,
        baseAmount: addFormData.amount, // store base price
        quantity: 1, // default quantity = 1
        amount: addFormData.amount*1 // current amount
        }

        //add Test List
        setFormData(prev => ({
        ...prev,
        testListStor: [...prev.testListStor,  newTest],
        testId: '',
        testCode: '',
        testName: '',
        deliveryInstruction: '',
        roomNo: '',
        amount: ''
        }));
    }
    
    //Delete Sigle Test List
    const testListDeleteHandler = (index) => {
    const newTestList = [...addFormData.testListStor];

    newTestList.splice(index, 1)

    setFormData(prev => ({
        ...prev,
        testListStor: newTestList
    }));
    }



  return (
    <>
        <Row className='mt-4 border border-dark p-2 rounded'>
            <Form.Group as={Col} md="5" controlId="validationCustom02">
                <Form.Label>Test Code + Name<span className='text-danger ms-1'>*</span></Form.Label>
                <Select
                styles={customStyles} 
                name="testName"
                options={testInfoOptions}
                classNamePrefix="react-select"
                className={`react-select-container ${showValidationError.test_name ? 'is-invalid' : ''}`}
                onChange={onChangeTestHandler}
                placeholder="Select Test Code + Name"
                isSearchable={true}
                isClearable={true}
                tabIndex={4}
                value={testInfoOptions.find(option => option.value === addFormData.testId) || null}
                />

                {/* {showValidationError.doctor_name && (
                <Form.Control.Feedback type="invalid" className="d-block">
                    {showValidationError.doctor_name}
                </Form.Control.Feedback>
                )} */}
            </Form.Group>

            <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label>Room No<span className='text-danger ms-1'>*</span></Form.Label>
                <Form.Control
                    required
                    type="text"
                    className='border-dark readableInputBgColor'
                    placeholder='Room No'
                    value={addFormData.roomNo || ''}
                    readOnly
                    tabIndex={-1}
                />
                <Form.Control.Feedback type='invalid'>{showValidationError.patient_name}</Form.Control.Feedback>
            </Form.Group> 

            <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label>Amount<span className='text-danger ms-1'>*</span></Form.Label>
                <Form.Control
                    required
                    type="text"
                    className='border-dark readableInputBgColor'
                    placeholder='Amount'
                    value={addFormData.amount || ''}
                    readOnly
                    tabIndex={-1}
                />
                <Form.Control.Feedback type='invalid'>{showValidationError.patient_name}</Form.Control.Feedback>
            </Form.Group> 

            <Col md="2">
                <Button type="button" onClick={addHandleTest} className="w-100 mt-4" tabIndex={5}>Add</Button>
            </Col>
        </Row>

        <Row className='mt-3'>
            <Col md="12">
            <Table bordered hover responsive>
                <thead>
                <tr>
                    <th>Code</th>
                    <th>Test Name</th>
                    <th>Delivery Instraction</th>
                    <th className="text-center">Room No</th>
                    <th className="text-center" style={{ width: "70px"}}>Qty</th>
                    <th className="text-end">Amount</th>
                    <th style={{width: '100px'}}>Action</th>
                </tr>
                </thead>
                <tbody>
                {addFormData.testListStor.length > 0 ? (
                    <>
                    {addFormData.testListStor.map((item, index) => (
                        <tr key={item.id || index}>
                            <td style={{ padding: '5px 5px' }}>{item.testCode}</td>
                            <td style={{ padding: '5px 5px' }}>{item.testName}</td>
                            <td style={{ padding: '5px 5px' }}>{item.deliveryInstruction}</td>
                            <td style={{ padding: '5px 5px' }} className="text-center">{item.roomNo}</td>
                            <td style={{ padding: '5px 5px' }}>
                                <input 
                                    type="number" 
                                    min={1}
                                    value={item.quantity || 1}
                                    onChange={(e)=>handleQtyChange(index, e.target.value)} 
                                    style={{width: '100%'}}/>
                            </td>
                            <td style={{ padding: '5px 5px' }} className="text-end">{ item.amount }</td>
                            <td style={{ padding: '5px 5px' }}>
                                <i
                                className="bi bi-trash btn-sm bg-danger"
                                onClick={() => testListDeleteHandler(index)}
                                style={{ cursor: "pointer" }}
                                ></i>
                            </td>
                        </tr>
                    ))}

                    {/* Total Amount Row */}
                    <tr>
                        <td colSpan="5" className="text-end fw-bold">
                        Total Amount
                        </td>
                        <td className="fw-bold text-end">{totalAmount}</td>
                        <td></td>
                    </tr>
                    </>
                ):(<tr><td  colSpan="7" className="text-center">No Tests Added</td></tr>)}
                </tbody>
            </Table>
            </Col>
        </Row>
    </>
  )
}

export default TestSelectFormTable;