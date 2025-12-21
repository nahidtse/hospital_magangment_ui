import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { BasicTable, ResponsiveDataTable, Savetable } from '../../common/LeaveInfoListTable';

const LeaveInfoTables = () => {
    return (
        <Fragment>
            <Pageheader homepage='Leave Information List' activepage='HR' page='Data Tables' />

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        {/* <Card.Header>
                            <div className="card-title">Delete Row Datatable</div>
                        </Card.Header> */}
                        <Card.Body>
                            <div className="table-responsive">
                                <Savetable />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default LeaveInfoTables;
