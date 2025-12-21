import { Fragment, useEffect, useRef, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const BankInfoEditForm = () => {

  const {id} = useParams()
  const navigate = useNavigate();

  const [editFormData, setEditFormData] = useState({
    bank_name: '',
    short_name: '',
    bu_id: '',     // Business Unit ID
    status: 1      // is_active

  })
  // console.log(editFormData)

  //Get Edit Data Use api & id
  useEffect(() => {
      if(!id) return;

      fetch(`${baseURL}/bank_info/single_data/${id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetched Data:", data);
            if(data.status === 'success') {
              setEditFormData({
                bank_name: data.data.bank_name || '',
                short_name: data.data.short_name || '',
                bu_id: data.data.bu_id || '',
                status: data.data.is_active || ''
              });
            }
          })
          .catch((error) => {
          console.log("Error Fetching the data: ", error);
          });

  }, [id])

  // console.log(editFormData)

  const [busibessUnit, setBusinessUnit] = useState([]);
  // console.log(busibessUnit)

  const [showValidationError, setValidationErrors] = useState({
    bank_name: '',
    bu_id: ''
  });


  const handleEditFormChange = (event) => {

    const fieldName = event.target.getAttribute("name");
    let fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

 
  /**  
    * Module
    * TODO:: Optimize
   */

  //----------React Select Business unit Start--------
  useEffect(() => {
    fetch(`${baseURL}/business_unit`)
      .then((response) => response.json())
      .then((data) => {
        setBusinessUnit(data.data);
      })
  }, [])

  const businessUnitOptions = busibessUnit.map(bu => ({
   value: bu.id,
   label: `${bu.business_unit}`
  }));

  // react-select  onChange handler
  const selectChange = (selectedOption) => {
    setEditFormData(prev => ({
      ...prev,
      bu_id: selectedOption? selectedOption.value : null
    }))
  };
//----------React Select Business unit End--------


  


  



  const handleEditFormSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    if (!editFormData.bank_name) {
      errors.bank_name = "Bank name is required.";
    }

    if (!editFormData.bu_id) {
      errors.bu_id = "Business Unit is required.";
    }


    // Check if any errors
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {

        const submitData = {
        bank_name: editFormData.bank_name,
        short_name: editFormData.short_name,
        bu_id: editFormData.bu_id,
        is_active: editFormData.status,
      }

      console.log(submitData)
      // return;

      const result = await fetch(`${baseURL}/bank_info/update/${id}`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(submitData)
      });


      const response = await result.json();
      // console.log(response);
      if (response.status == 'success') {
        toast.success(response.message)
        navigate('/bankinfo/dataTable')

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
      console.error(error);
    }

  }; 

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: '#000',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      // padding: '1px',
      minHeight: '40px',
      // '&:hover': {
      //   borderColor: '#000'
      // }
    }),
  };

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Bank Information Edit</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}bankinfo/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>

              </div>
            </Card.Header>

            <Card.Body>

              <Form noValidate onSubmit={handleEditFormSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Bank Name <span className='text-danger ms-1'>*</span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Bank name"
                      name='bank_name'
                      value={editFormData.bank_name}
                      isInvalid={!!showValidationError.bank_name}
                      onChange={handleEditFormChange}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.bank_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Short Name <span className='text-danger ms-1'></span></Form.Label>
                    <Form.Control
                      required
                      type="text"
                      className='border-dark'
                      placeholder="Enter Doctor name"
                      name='short_name'
                      value={editFormData.short_name}
                      isInvalid={!!showValidationError.short_name}
                      onChange={handleEditFormChange}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.short_name}</Form.Control.Feedback>
                  </Form.Group>              
                </Row>

                <Row>
                  <Form.Group as={Col} md="6" controlId="validationCustom02">
                    <Form.Label>Business Unit<span className='text-danger'> *</span> </Form.Label>

                    <Select
                      styles={customStyles}
                      className={"border-dark"}
                      classNamePrefix="react-select"
                      options={businessUnitOptions}
                      value={businessUnitOptions.find(option => option.value === editFormData.bu_id)}
                      onChange={selectChange}
                    />
                    <Form.Control.Feedback type='invalid'>{showValidationError.degree_id}</Form.Control.Feedback>
                  </Form.Group>  

                  <Form.Group as={Col} md="6" controlId="validationCustom01">
                    <Form.Label>Status<span className='text-danger ms-1'></span></Form.Label>
                    
                    <Form.Group controlId="tickCheckbox">
                        <Form.Check
                            type="checkbox"
                            label={editFormData.status ? 'active' : 'Deactive'}
                            name="status"
                            checked={editFormData.status === 1}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                status: e.target.checked ? 1 : 0,
                              })
                            } 
                        />
                    </Form.Group>
                    <Form.Control.Feedback type='invalid'>{showValidationError.status}</Form.Control.Feedback>
                  </Form.Group>
                </Row> 
                
                <div className='d-flex justify-content-end'>
                <Button type="submit">Update</Button>
                </div>
              </Form>

            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment >
  );
};

export default BankInfoEditForm;