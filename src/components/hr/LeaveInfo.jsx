import { Fragment, useState } from 'react';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { Card, Col, Form, Row } from 'react-bootstrap';

const LeaveInfo = () => {

  const [isHidden, setIsHidden] = useState([false]);
  const toggleHidden = (index) => {
    const updatedHidden = [...isHidden];
    updatedHidden[index] = !updatedHidden[index];
    setIsHidden(updatedHidden);
  };


  return (
    <Fragment>
      <Pageheader homepage='Leave Information' activepage='HR' page='Leave Information' />

      <Row className="row-sm">
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <div className='card-title'> Leave Information Form</div>
              <div className="prism-toggle">
                <button className="btn btn-sm btn-success-light">Leave Information List</button>
              </div>
            </Card.Header>
            <Card.Body className={`${isHidden[0] ? 'd-none' : ''}`}>

              <Row className="gy-4">
                <Col xl={4}>
                  <label htmlFor="employeeName" className='mb-2'>Employee Name</label>
                  <div className="mb-3">
                    <input type="text" className="form-control border-dark mb-3" id="employeeName" />
                  </div>

                </Col>
                <Col xl={4}>
                  <label htmlFor="designation" className='mb-2'>Designation</label>
                  <input type="text" className="form-control border-dark mb-3" id="designation" placeholder="" />

                </Col>
                <Col xl={4}>
                  <label htmlFor="department" className='mb-2'>Department</label>
                  <input type="text" className="form-control border-dark mb-3" id="department" placeholder="" />

                </Col>

              </Row>

              <Row className="gy-4">
                <Col xl={4}>
                  <label htmlFor="leaveType" className='mb-2'>Leave Type</label>
                  <Form.Select className="form-control border-dark" >
                    <option value="">-- Select Type --</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Without Pay">Without Pay</option>
                  </Form.Select>
                </Col>

                <Col xl={4}>
                  <label htmlFor="fromDate" className='mb-2'>From Date</label>

                  <input type="date" className="form-control border-dark mb-3" id="fromDate" />

                </Col>
                <Col xl={4}>
                  <label htmlFor="toDate" className='mb-2'>To Date</label>

                  <input type="date" className="form-control border-dark mb-3" id="toDate" />

                </Col>


              </Row>
              <Row className="gy-4">

                <Col xl={4}>
                  <label htmlFor="totalLeaveDays" className='mb-2'>Total Leave Days</label>
                  <input type="text" className="form-control border-dark mb-3" id="totalLeaveDays" placeholder="" />
                </Col>
                <Col xl={4}>
                  <label htmlFor="remainingLeave" className='mb-2'>Remaining Leave</label>
                  <input type="text" className="form-control border-dark mb-3" id="remainingLeave" placeholder="" />
                </Col>
                <Col xl={4}>
                  <label htmlFor="businessUnit" className='mb-2'>Business Unit</label>
                  <input type="email" className="form-control border-dark mb-3" id="businessUnit" placeholder="" />
                </Col>

              </Row>


              <Col xl={4}>
                <label htmlFor="attachment" className='mb-2'>Attachment</label>
                <input type="file" className="form-control border-dark mb-3" id="attachment" placeholder="" />

              </Col>

              <Col xl={4}>
                <label htmlFor="remarks" className='mb-2'>Remarks</label>
                <textarea id="remarks" rows={4} className="form-control border-dark mb-3" ></textarea>
              </Col>
              <button type="button" className="btn btn-success btn-wave py-2 px-5">SAVE</button>
            </Card.Body>
            <div className={`${isHidden[0] ? '' : 'd-none'} card-footer border-top-0`}>
              {/* <!-- Prism Code --> */}

              <pre><code className='language-javascript'>
                {`
                  <Card.Body>
                  <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3" >
                    <Form.Control type="email" placeholder="" />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control type="password" placeholder="" />
                  </FloatingLabel>
                  </Card.Body>
                `}
              </code></pre>

              {/* <!-- Prism Code --> */}
            </div>
          </Card>
        </Col>


      </Row>
    </Fragment>
  );
};

export default LeaveInfo;