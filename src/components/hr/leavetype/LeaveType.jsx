import { Fragment, useState } from 'react';
import Pageheader from '../../../layouts/layoutcomponents/Pageheader';
import { Card, Col, FloatingLabel, Form, Row } from 'react-bootstrap';

const LeaveType = () => {

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };


  return (
    <Fragment>
      <Pageheader homepage='Leave Types' activepage='HR' page='Leave Types' />

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Leave Type Form</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-success-light">Leave List</button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>
              <Row className="gy-4">
                <Col xl={4}>
                  <label htmlFor="leaveType" className='mb-2'>Leave Type</label>
                  <input type="text" className="form-control border-dark mb-3" id="leaveType" placeholder="e.g. Casual Leave" />
                </Col>
                <Col xl={4}>
                  <label htmlFor="totalLeave" className='mb-2'>Total Leave (days)</label>
                  <input type="number" className="form-control border-dark mb-3" id="totalLeave" placeholder="" />
                </Col>
                <Col xl={4}>
                  <label htmlFor="businessUnit" className='mb-2'>Business Unit</label>
                  <input type="email" className="form-control border-dark mb-3" id="businessUnit" placeholder="" />
                </Col>
              </Row>
              <button type="button" className="btn btn-success btn-wave py-2 px-5">SAVE</button>
            </Card.Body>
          </Card>
        </Col>


      </Row>
    </Fragment>
  );
};

export default LeaveType;