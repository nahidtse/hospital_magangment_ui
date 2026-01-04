import React, { useState } from "react";
import { Tab, Card, Row, Col, Table, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
// import {LightboxGallery} from '../../../commondata/gallerydata';
import Pageheader from "../../layouts/layoutcomponents/Pageheader";
import ALLImages from "../../common/Imagesdata";

//lightbox
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const Profile = () => {

  const full_name = localStorage.getItem('full_name')

  const [open, setOpen] = useState(false);
  const images = Array.from({ length: 8 }, (_, i) => `media${i + 1}`);
  

  return (
    <div>
      <Pageheader homepage='Profile' activepage='Pages' page='Profile' />

      <Row id="user-profile">
        <Col lg={12}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Card className="custom-card">
              <Card.Body>
                <div className="wideget-user">
                  <Row>
                    <Col lg={12} md={12} xl={6}>
                      <div className="wideget-user-desc d-sm-flex">
                        <div className="wideget-user-img">
                          <img className="" src={ALLImages('face8')} alt="img" />
                        </div>
                        <div className="user-wrap mt-auto">
                          <h4>{full_name}</h4>
                          <h6 className="text-muted mb-3">Member Since: November 2017</h6>
                          <Link to="#" className="btn btn-primary mt-1 mb-1 me-1"><i className="fa fa-rss"></i> Follow</Link>
                          <Link to={`${import.meta.env.BASE_URL}pages/mailcompose/`} className="btn btn-secondary mt-1 mb-1"><i className="fa fa-envelope"></i> E-mail</Link>
                        </div>
                      </div>
                    </Col>
                    <Col lg={12} md={12} xl={6}>
                      <div className="text-xl-right mt-4 mt-xl-0">
                        <Link to={`${import.meta.env.BASE_URL}pages/mailcompose/`} className="btn btn-outline-light  me-1">Message</Link>
                        <Link to={`${import.meta.env.BASE_URL}pages/editprofile/`} className="btn btn-primary">Edit Profile</Link>
                      </div>
                      <div className="mt-4">
                        <div className="main-profile-contact-list float-lg-end d-lg-flex">
                          <div className="me-5">
                            <div className="media">
                              <div className="media-icon bg-primary  me-3 mt-1">
                                <i className="fe fe-file-plus fs-20"></i>
                              </div>
                              <div className="media-body">
                                <span className="text-muted">Posts</span>
                                <div className="fw-semibold fs-25">
                                  328
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="me-5 mt-5 mt-md-0">
                            <div className="media">
                              <div className="media-icon bg-success me-3 mt-1">
                                <i className="fe fe-users  fs-20"></i>
                              </div>
                              <div className="media-body">
                                <span className="text-muted">Followers</span>
                                <div className="fw-semibold fs-25">
                                  937k
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="me-0 mt-5 mt-md-0">
                            <div className="media">
                              <div className="media-icon bg-orange me-3 mt-1">
                                <i className="fe fe-wifi fs-20"></i>
                              </div>
                              <div className="media-body">
                                <span className="text-muted">Following</span>
                                <div className="fw-semibold fs-25">
                                  2,876
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
              <div className="border-top">
                <div className="wideget-user-tab">
                  <div className="tab-menu-heading">
                    <div className="tabs-menu1">
                      <Nav as='ul' variant="pills" className="nav-style-3">
                        <Nav.Item as='li'><Nav.Link eventKey="first">Profile</Nav.Link></Nav.Item>
                        <Nav.Item as='li'><Nav.Link eventKey="second">Friends</Nav.Link></Nav.Item>
                        <Nav.Item as='li'><Nav.Link eventKey="third">Gallery</Nav.Link></Nav.Item>
                        <Nav.Item as='li'><Nav.Link eventKey="fourth">Followers</Nav.Link></Nav.Item>
                      </Nav>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Tab.Content>
              <Tab.Pane className="p-0 border-0" eventKey="first">
                <div id="profile-log-switch">
                  <Card className="custom-card">
                    <Card.Body>
                      <div className="media-heading">
                        <h5><strong>Personal Information</strong></h5>
                      </div>
                      <div className="table-responsive ">
                        <table className="table row table-borderless">
                          <tbody className="col-lg-12 col-xl-6 p-0">
                            <tr>
                              <td><strong>Full Name :</strong> {full_name}</td>
                            </tr>
                            <tr>
                              <td><strong>Location :</strong> USA</td>
                            </tr>
                            <tr>
                              <td><strong>Languages :</strong> English, German, Spanish.</td>
                            </tr>
                          </tbody>
                          <tbody className="col-lg-12 col-xl-6 p-0">
                            <tr>
                              <td><strong>Website :</strong> abcdz.com</td>
                            </tr>
                            <tr>
                              <td><strong>Email :</strong> georgemestayer@abcdz.com</td>
                            </tr>
                            <tr>
                              <td><strong>Phone :</strong> +125 254 3562 </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="row profie-img">
                        <div className="col-md-12">
                          <div className="media-heading">
                            <h5><strong>Biography</strong></h5>
                          </div>
                          <p>
                            Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus</p>
                          <p className="mb-0">because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter but because those who do not know how to pursue consequences that are extremely painful. Nor
                            again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great
                            pleasure.
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Tab.Pane>
              <Tab.Pane className="p-0 border-0" eventKey="second">
                <ul className="widget-users row p-0 border-0">
                  <li className="col-lg-4  col-md-6 col-sm-12 col-12">
                    <Card className="custom-card border p-0">
                      <Link to={`${import.meta.env.BASE_URL}pages/profile/`}>
                        <div className="card-body text-center">
                          <img className="avatar avatar-xxl rounded-circle cover-image" alt="img" src={ALLImages('face15')} />
                          <h4 className="fs-16 mb-0 mt-3 text-dark fw-semibold">James Thomas</h4>
                          <span className="text-muted">Web designer</span>
                        </div>
                      </Link>
                      <div className="card-footer text-center">
                        <div className="row user-social-detail">
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-google"></i>
                          </Link>
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-facebook"></i>
                          </Link>
                          <Link to="#" className="social-profile  rounded-circle text-center">
                            <i className="bi bi-twitter-x"></i>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </li>
                  <li className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <Card className="custom-card border p-0">
                      <Link to={`${import.meta.env.BASE_URL}pages/profile/`}>
                        <div className="card-body text-center">
                          <img className="avatar avatar-xxl rounded-circle cover-image" alt="img" src={ALLImages('face9')} />
                          <h4 className="fs-16 mb-0 mt-3 text-dark fw-semibold">George Clooney</h4>
                          <span className="text-muted">Web designer</span>
                        </div>
                      </Link>
                      <div className="card-footer text-center">
                        <div className="row user-social-detail">
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-google"></i>
                          </Link>
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-facebook"></i>
                          </Link>
                          <Link to="#" className="social-profile  rounded-circle text-center">
                            <i className="bi bi-twitter-x"></i>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </li>
                  <li className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <Card className="custom-card border p-0">
                      <Link to={`${import.meta.env.BASE_URL}pages/profile/`}>
                        <div className="card-body text-center">
                          <img className="avatar avatar-xxl rounded-circle cover-image" alt="img" src={ALLImages('face2')} />
                          <h4 className="fs-16 mb-0 mt-3 text-dark fw-semibold">Robert Downey Jr.</h4>
                          <span className="text-muted">Web designer</span>
                        </div>
                      </Link>
                      <div className="card-footer text-center">
                        <div className="row user-social-detail">
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-google"></i>
                          </Link>
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-facebook"></i>
                          </Link>
                          <Link to="#" className="social-profile  rounded-circle text-center">
                            <i className="bi bi-twitter-x"></i>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </li>
                  <li className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <Card className="custom-card border p-0 mb-lg-0">
                      <Link to={`${import.meta.env.BASE_URL}pages/profile/`}>
                        <div className="card-body text-center">
                          <img className="avatar avatar-xxl rounded-circle cover-image" alt="img" src={ALLImages('face12')} />
                          <h4 className="fs-16 mb-0 mt-3 text-dark fw-semibold">Emma Watson</h4>
                          <span className="text-muted">Web designer</span>
                        </div>
                      </Link>
                      <div className="card-footer text-center">
                        <div className="row user-social-detail">
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-google"></i>
                          </Link>
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-facebook"></i>
                          </Link>
                          <Link to="#" className="social-profile  rounded-circle text-center">
                            <i className="bi bi-twitter-x"></i>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </li>
                  <li className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <Card className="custom-card border p-0 mb-lg-0">
                      <Link to={`${import.meta.env.BASE_URL}pages/profile/`}>
                        <div className="card-body text-center">
                          <img className="avatar avatar-xxl rounded-circle cover-image" alt="img" src={ALLImages('face4')} />
                          <h4 className="fs-16 mb-0 mt-3 text-dark fw-semibold">Mila Kunis</h4>
                          <span className="text-muted">Web designer</span>
                        </div>
                      </Link>
                      <div className="card-footer text-center">
                        <div className="row user-social-detail">
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-google"></i>
                          </Link>
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-facebook"></i>
                          </Link>
                          <Link to="#" className="social-profile  rounded-circle text-center">
                            <i className="bi bi-twitter-x"></i>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </li>
                  <li className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <Card className="custom-card border p-0 mb-0">
                      <div className="card-body text-center">
                        <img className="avatar avatar-xxl rounded-circle cover-image" alt="img" src={ALLImages('face6')} />
                        <Link to={`${import.meta.env.BASE_URL}pages/profile/`}>
                          <h4 className="fs-16 mb-0 mt-3 text-dark fw-semibold">Ryan Gossling</h4>
                        </Link>
                        <span className="text-muted">Web designer</span>
                      </div>
                      <div className="card-footer text-center">
                        <div className="row user-social-detail">
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-google"></i>
                          </Link>
                          <Link to="#" className="social-profile me-4 rounded-circle text-center">
                            <i className="bi bi-facebook"></i>
                          </Link>
                          <Link to="#" className="social-profile  rounded-circle text-center">
                            <i className="bi bi-twitter-x"></i>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </li>
                </ul>
              </Tab.Pane>
              <Tab.Pane className="p-0 border-0" eventKey="third">
                <Row className="mb-4 img-gallery">
                  {images.map((img, index) => (
                    <Col key={index} lg={3} md={3} sm={6} className="col-12">
                      <Link to="#" onClick={() => setOpen(true)} className="glightbox card">
                        <img src={ALLImages(img)} alt={`image-${index + 1}`} />
                      </Link>
                    </Col>
                  ))}
                  {open && (
                    <Lightbox
                      open={open}
                      close={() => setOpen(false)}
                      plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]} zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
                      slides={images.map(imageName => ({ src: ALLImages(imageName) }))}
                    />
                  )}
                </Row>
              </Tab.Pane>
              <Tab.Pane className="p-0 border-0" eventKey="fourth">
                <Row>
                  <Col lg={6} md={12}>
                    <Card className="border p-0 over-flow-hidden">
                      <div className="media card-body media-xs overflow-visible ">
                        <img className="avatar rounded-circle avatar-md me-3" src={ALLImages('face8')} alt="avatar-img" />
                        <div className="media-body valign-middle">
                          <Link to="#" className=" fw-semibold text-dark">John Paige</Link>
                          <p className="text-muted mb-0">johan@gmail.com</p>
                        </div>
                        <div className="media-body valign-middle text-end overflow-visible mt-2 ms-auto">
                          <button className="btn btn-primary" type="button">Follow</button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={6} md={12}>
                    <Card className="border p-0 over-flow-hidden">
                      <div className="media card-body media-xs overflow-visible ">
                        <span className="avatar cover-image avatar-md rounded-circle bg-pink me-3">LQ</span>
                        <div className="media-body valign-middle mt-0">
                          <Link to="#" className="fw-semibold text-dark">Lillian Quinn</Link>
                          <p className="text-muted mb-0">lilliangore</p>
                        </div>
                        <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                          <button className="btn btn-primary" type="button">Follow</button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={6} md={12}>
                    <Card className="border p-0 over-flow-hidden">
                      <div className="media card-body media-xs overflow-visible ">
                        <span className="avatar cover-image avatar-md rounded-circle me-3 bg-primary flex-none">IH</span>
                        <div className="media-body valign-middle mt-0">
                          <Link to="#" className="fw-semibold text-dark">Irene Harris</Link>
                          <p className="text-muted mb-0">Irene@gmail.com</p>
                        </div>
                        <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                          <button className="btn btn-primary" type="button">Follow</button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={6} md={12}>
                    <Card className="border p-0 over-flow-hidden">
                      <div className="media card-body media-xs overflow-visible ">
                        <img className="avatar rounded-circle avatar-md me-3" src={ALLImages('face3')} alt="avatar-img" />
                        <div className="media-body valign-middle mt-0">
                          <Link to="#" className="text-dark fw-semibold">Saureen Bgist</Link>
                          <p className="text-muted mb-0">harryuqt</p>
                        </div>
                        <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                          <button className="btn btn-primary" type="button">Follow</button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={6} md={12}>
                    <Card className="border p-0 over-flow-hidden">
                      <div className="media card-body media-xs overflow-visible ">
                        <img className="avatar rounded-circle avatar-md me-3" src={ALLImages('face2')} alt="avatar-img" />
                        <div className="media-body valign-middle mt-0">
                          <Link to="#" className="text-dark fw-semibold">Maureen Biologist</Link>
                          <p className="text-muted mb-0">harryuqt</p>
                        </div>
                        <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                          <button className="btn btn-primary" type="button">Follow</button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                  <Col lg={6} md={12}>
                    <Card className="border p-0 over-flow-hidden">
                      <div className="media card-body media-xs overflow-visible ">
                        <span className="avatar cover-image avatar-md rounded-circle me-3 bg-info flex-none">PF</span>
                        <div className="media-body valign-middle mt-0">
                          <Link to="#" className="fw-semibold text-dark">Paddy O'Furniture.</Link>
                          <p className="text-muted mb-0">Paddy@gmail.com</p>
                        </div>
                        <div className="media-body valign-middle text-end overflow-visible mt-1 ms-auto">
                          <button className="btn btn-primary" type="button">Follow</button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </div>
  )
}

export default Profile;