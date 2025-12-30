import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { toast } from 'react-toastify';
import Select from "react-select";
import { DeleteConfirmation } from "../../common/utils/DeleteConfirmation";
const basURL = import.meta.env.VITE_API_BASE_URL;


const EditTestSelectFormTable = ({
    editFormData,
    setEditFormData,
    customStyles,
    showValidationError
}) => {
//   console.log("Test Com",editFormData)

    //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
    //*********Check Authentication End***********


  
    const [testInfo, setTestInfo] = useState([]); // TestInfo get all

    //Get all Test Info start
    useEffect(() => {
        fetch(`${basURL}/testinfo`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
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
        
            setEditFormData(prev => ({
            ...prev,

            test_id: selectedTestInfo.id,
            test_code: selectedTestInfo.test_code,
            test_name: selectedTestInfo.test_name,
            delivery_instruction: selectedTestInfo.delivery_instruction,
            room_no: selectedTestInfo.room_no,
            amount: selectedTestInfo.amount,
            }))
        }
    }
    //Quantity Change Handle
    // const handleQtyChange = (index, value) => {
    //     const quantity = Number(value) || 1;

    //     setEditFormData(prev => {
    //         const updateTestStor = [...prev.testList];
    //         updateTestStor[index].quantity = quantity;
    //         updateTestStor[index].amount = updateTestStor[index].baseAmount * quantity;

    //         return {...prev, testList:updateTestStor}
    //     })
    // }    

    const handleQtyChange = (index, value) => {

        // allow empty string so user can delete old qty
        if (value === "") {
            setEditFormData(prev => {
                const updateTestStor = [...prev.testList];
                updateTestStor[index].quantity = "";
                updateTestStor[index].amount = updateTestStor[index].base_amount ?? updateTestStor[index].amount;
                return { ...prev, testList: updateTestStor };
            });
            return;
        }

        // convert to number
        const quantity = Number(value);

        // if NaN → ignore
        if (isNaN(quantity)) return;

        setEditFormData(prev => {
            const updateTestStor = [...prev.testList];

            // First time base price save
            if (!updateTestStor[index].base_amount) {
                updateTestStor[index].base_amount = updateTestStor[index].amount;
            }

            updateTestStor[index].quantity = quantity;
            updateTestStor[index].amount = updateTestStor[index].base_amount * quantity;

            return { ...prev, testList: updateTestStor };
        });
    };


    //Add Test List Function
    const addHandleTest = (e) => {
        e.preventDefault();

        if (!editFormData.test_id) return;

        // Check if already exist
        const isAlreadyAdded = editFormData.testList.some(
            (test) => test.test_id === editFormData.test_id
        );

        if (isAlreadyAdded) {
            toast.error("This test is already added.", { autoClose: 1200 });
            return;
        }

        const newTest = {
        test_id: editFormData.test_id,
        test_code: editFormData.test_code,
        test_name: editFormData.test_name,
        delivery_instruction: editFormData.delivery_instruction,
        room_no: editFormData.room_no,
        baseAmount: editFormData.amount, // store base price
        quantity: 1, // default quantity = 1
        amount: editFormData.amount*1 // current amount
        }

        //add Test List
        setEditFormData(prev => ({
        ...prev,
        testList: [...prev.testList,  newTest],
        test_id: '',
        test_code: '',
        test_name: '',
        delivery_instruction: '',
        room_no: '',
        amount: ''
        }));
    }

   //Delete Sigle Test List
    const testListDeleteHandler = async (index) => {
        const existingItem = editFormData.testList[index]; //if index show that means this is DB item

        const isConfirmed = await DeleteConfirmation(); //for Delete confirmation 
        if (!isConfirmed) return;

        if(existingItem.id) {
            try{
                const response = await fetch(`${basURL}/invoice_details/destroy/${existingItem.id}`, {
                    method: 'GET',
                    headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();

                if (data.status === 'success') {
                toast.success("Test deleted successfully from DB");
                } else {
                    toast.error("Failed to delete test from DB");
                    return;
                }
            } catch(error) {
                toast.error("Error deleting test from DB");
                console.error(error);
                return;
            }
        }

        //Remove Only State for new add Test
        const newTestList = [...editFormData.testList]; //if Not index show that means State item
        newTestList.splice(index, 1)

        setEditFormData(prev => ({
            ...prev,
            testList: newTestList
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
                onChange={onChangeTestHandler}
                placeholder="Select Test Code + Name"
                isSearchable={true}
                isClearable={true}
                tabIndex={4}
                value={testInfoOptions.find(option => option.value === editFormData.test_id) || null}
                />
            </Form.Group>

            <Form.Group as={Col} md="2" controlId="validationCustom01">
                <Form.Label>Room No<span className='text-danger ms-1'>*</span></Form.Label>
                <Form.Control
                    required
                    type="text"
                    className='border-dark readableInputBgColor'
                    placeholder='Room No'
                    value={editFormData.room_no || ''}
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
                    value={editFormData.amount || ''}
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
                    {editFormData.testList.length > 0 ? (
                        <>
                        {editFormData.testList.map((item, index) => (
                            <tr key={item.id || index}>
                                <td style={{ padding: '5px 5px' }}>{item.test_code}</td>
                                <td style={{ padding: '5px 5px' }}>{item.test_name}</td>
                                <td style={{ padding: '5px 5px' }}>{item.delivery_instruction}</td>
                                <td style={{ padding: '5px 5px' }} className="text-center">{item.room_no}</td>
                                <td style={{ padding: '5px 5px' }}>
                                    <input 
                                        type="number" 
                                        min={1}
                                        value={item.quantity}
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
                        <tr>
                            <td colSpan="5" className="text-end fw-bold">
                            Total Amount
                            </td>
                            <td className="fw-bold text-end">{editFormData.totalAmount}</td>
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

export default EditTestSelectFormTable