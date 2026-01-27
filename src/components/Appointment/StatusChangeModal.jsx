import { Modal,} from "react-bootstrap";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
const baseURL = import.meta.env.VITE_API_BASE_URL;


export function StatusChangeModal({ show, onHide, appointment, fetchItems }) {

  // console.log(appointment)
  if (!show) return null;


  //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check
    const user_id = localStorage.getItem('user_id')  //for created_by

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
  //*********Check Authentication End***********



  // Status Update Main Function
  const handleStatusUpdate = async (newStatus, statusName) => {

    const result = await Swal.fire({
        title: 'Are You Sure?',
        text: `Appointment Status Change To "${statusName}"`,
        icon: 'warning',
        showCancelButton: true,
        buttonsStyling: false,
        customClass: {
            confirmButton: 'btn border mx-2',
            cancelButton: 'btn btn-primary mx-2'
        },
        confirmButtonText: 'Yes, Change it!'
    })

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${baseURL}/appointment/status/${appointment.id}`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus, updated_by: user_id }),
      });

      const resData = await response.json();

      if (resData.status == 'success') {
        toast.success(resData.message);
        fetchItems(); // List Page Refresh
        onHide();     // Modal close
      } else {
        toast.error("Not Update");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Server Error");
    }
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
                Do You Want To ?
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
                <div className="d-flex justify-content-center">
                    {[1].includes(appointment.status )&& (
                      <>
                        <button onClick={() => handleStatusUpdate(2, 'Checked In')} className="btn btn-info me-2" tabIndex={-1}>Checked In</button>
                        <button onClick={() => handleStatusUpdate(5, 'Absent')} className="btn btn-warning me-2" tabIndex={-1}>Absent</button>
                        <button onClick={() => handleStatusUpdate(0, 'Cancel')} className="btn btn-danger me-2" tabIndex={-1}>Cancel</button>
                        <button onClick={() => handleStatusUpdate(6, 'Reschedule')} className="btn btn-dark me-2" tabIndex={-1}>Reschedule</button>
                      </>
                    )}
                    {[2].includes(appointment.status) && (
                      <>
                        <button onClick={() => handleStatusUpdate(3, 'In-Consultation')} className="btn btn-primary me-2" tabIndex={-1}>In consultation</button>
                        <button onClick={() => handleStatusUpdate(7, 'Checked In Cancel')} className="btn btn-secondary me-2" tabIndex={-1}>Checked In Cancel</button>
                        <button onClick={() => handleStatusUpdate(6, 'Reschedule')} className="btn btn-dark me-2" tabIndex={-1}>Reschedule</button>
                      </>
                    )}
                    {[3].includes(appointment.status) && (
                      <>
                        <button onClick={() => handleStatusUpdate(4, 'Completed')} className="btn btn-success me-2" tabIndex={-1}>Completed</button>
                      </>
                    )}
                </div>


                <div className='d-flex justify-content-end mt-3'>
                    <button onClick={onHide} className="btn btn-outline-info me-2" tabIndex={-1}>Close</button>
                    {/* <button onClick={resetHandling} type="reset" id="resetBtn" className="btn btn-outline-secondary me-2" tabIndex={-1}>Reset</button> */}
                    {/* <Button tabIndex={4} type="submit">Save</Button> */}
                </div>
        </Modal.Body>
        {/* <Modal.Footer>
            <Button onClick={onHide}>Close</Button>
        </Modal.Footer> */}
    </Modal>
  );
}