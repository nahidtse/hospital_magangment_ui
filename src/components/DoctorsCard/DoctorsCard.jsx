import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Col, Collapse, Dropdown, Modal, Nav, Row } from 'react-bootstrap';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import ALLImages from '../../common/Imagesdata';
const basURL = import.meta.env.VITE_API_BASE_URL;

 const DoctorsCard = () => {

    const [doctorData, setDoctorData] = useState('')
    // console.log(doctorData)

    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }

    useEffect(() => {
        fetch(`${basURL}/doctors`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setDoctorData(data.data)

            })
            .catch((error) => {
                console.log("Error Fetching the data: ", error)
            })
    }, [])


  return (
    <Fragment>
        <h6 className="mb-3">Doctors Cards:</h6>
            <Row className="row-sm">
                <Col xl={12}>
                    <Row className="row-cols-1 row-cols-md-4 g-4 align-items-stretch">
                        {
                            doctorData && doctorData.length > 0 ? (
                                doctorData.map((doctor, index)=>(
                                    <Col key={doctor.id || index} className="d-flex">
                                        <Card className="custom-card flex-fill">
                                            <img src={doctor.image ? doctor.image : ALLImages('media4')} className="card-img-top" alt="..." height={300}/>
                                            <Card.Body>
                                                <h5 className="card-title fw-semibold" style={{color: '#0C9D52'}}>{doctor.doctor_name}</h5>
                                                <p className="" style={{color: '#777E8B'}}> <strong>Degree: </strong>
                                                 { doctor.degrees && doctor.degrees.length > 0 ? doctor.degrees.map(d => d.lookup_value).join(", "): "No Degree"}
                                                 </p>
                                                <p className="" style={{color: '#777E8B'}}> <strong>Specility:</strong> {doctor.speciality.lookup_value}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>Data Loading...</p>
                            )
                        }
                    </Row>
                </Col>
            </Row>
            
    </Fragment>
  )
}

export default DoctorsCard;
