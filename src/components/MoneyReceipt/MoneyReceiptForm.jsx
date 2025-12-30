import { isAction } from '@reduxjs/toolkit';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import MoneyReceiptFormFunction from './MoneyReceiptFormFunction';
import { MoneyReceiptFormTable } from './MoneyReceiptFormTable';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const MoneyReceiptForm = () => {

  //*********Check Authentication Start***********
  const token = localStorage.getItem('auth_token'); //Check Authentication
  const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

  if (!token || (expiry && Date.now() > Number(expiry))) {
      localStorage.clear();
      window.location.href = "/login";
      return;
  }
  //*********Check Authentication End***********


  const [moneyReceiptList, setMoneyReceiptList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(moneyReceiptList)


  //Get Money Receipt List
  const fetchMoneyReceiptList = () => {
    fetch(`${baseURL}/money_receipt`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // <-- must send token
      }
    })
        .then((response) => response.json())
        .then((data) => {
        setMoneyReceiptList(data.data);
        })
        .catch((error) => {
        console.log("Error Fetching the data: ", error);
        });
    };

    useEffect(() => {
    fetchMoneyReceiptList();
    }, []);




  const handleSubmitReceipt = async (submitData) => {
      setIsLoading(true)
    try {

      console.log('Form submitted:', submitData);
      // return;

      const result = await fetch(`${baseURL}/money_receipt/create`, {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const response = await result.json();

      if (response.status == 'success') {
        toast.success(response.message);

        fetchMoneyReceiptList();
        return true;

      } else {
        toast.error("Failed to save");
        return false;
      }

    } catch (error) {
      toast.error('Internal Error!! Try again after 5 min.');
      console.log(error);
      return false;

    } finally {
      setIsLoading(false);
    }


  }

  return (
    <Fragment>
      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'>Create Money Receipt</div>
              <div className="prism-toggle">
                <Link to={`${import.meta.env.BASE_URL}moneyreceipt/dataTable`}>
                  <button className="btn btn-sm btn-primary">List</button>
                </Link>
              </div>
            </Card.Header>

            <Card.Body>
              <Row>
                <Col md={4}>
                  <MoneyReceiptFormFunction
                    onSubmit={handleSubmitReceipt} // Parent function pass
                  />
                </Col>
                <Col md={8}>
                   <MoneyReceiptFormTable 
                      moneyReceiptList = {moneyReceiptList}
                   />
                </Col>
              </Row>
            </Card.Body>

          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default MoneyReceiptForm;
