import { Fragment } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Pageheader from '../../layouts/layoutcomponents/Pageheader';
import { BasicTable } from './TableFunctions';
import { Link } from 'react-router-dom';
// import { BasicTable, ResponsiveDataTable, Savetable } from '../../common/LeaveInfoListTable';

const BusinessUnitTables = () => {

   

    return (
        <Fragment>
            {/* <Pageheader homepage='Business Unit List' activepage='' page='' /> */}

                    <div className="table-responsive">
                                <BasicTable />
                    </div>
                    
        </Fragment>
    );
};

export default BusinessUnitTables;




     