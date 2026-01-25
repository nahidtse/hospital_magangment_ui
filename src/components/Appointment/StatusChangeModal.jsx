import { useEffect, useRef, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { format } from "date-fns";
const baseURL = import.meta.env.VITE_API_BASE_URL;


export function StatusChangeModal({ show, onHide, due, fetchItems }) {

  // console.log(due)
  if (!show) return null;



   const handleSubmit = (e) => {
        e.preventDefault();
        onHide();
    };

   

    
     return (
        <Modal
            show={show} onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title as="h6" className="modal-title" id="contained-modal-title-vcenter">
                    Change Appointment Status
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                  onSubmit={handleSubmit} 
                  noValidate
                  onKeyDown={(e) => {
                    const activeEl = document.activeElement; // active element define
                    if (e.key === "Enter" && e.target.tagName !== 'TEXTAREA') {
                      if (activeEl && activeEl.type === "submit") {
                        return; 
                      } else {
                        e.preventDefault();
                      }
                    }
                  }}
                >

                    <div>
                        <button onClick={onHide} className="btn btn-info me-2" tabIndex={-1}>Checked In</button>
                        <button onClick={onHide} className="btn btn-primary me-2" tabIndex={-1}>Inconsultation</button>
                        <button onClick={onHide} className="btn btn-success me-2" tabIndex={-1}>Absent</button>
                        <button onClick={onHide} className="btn btn-danger me-2" tabIndex={-1}>Absent</button>
                        <button onClick={onHide} className="btn btn-warning me-2" tabIndex={-1}>Reschedule</button>
                        <button onClick={onHide} className="btn btn-secondary me-2" tabIndex={-1}>Checked In Cancel</button>
                    </div>


                    <div className='d-flex justify-content-end mt-3'>
                        <button onClick={onHide} className="btn btn-outline-info me-2" tabIndex={-1}>Close</button>
                        {/* <button onClick={resetHandling} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" tabIndex={-1}>Reset</button> */}
                        <Button tabIndex={4} type="submit">Save</Button>
                    </div>
                </Form>
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer> */}
        </Modal>
    );
}