import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { Fragment, useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import RoleEditForm from "./AppointmentEditForm";
import SingleTableFunction from "./SingleTableFunction";
import AppointmentEditForm from "./AppointmentEditForm";
import { hasButtonPermission } from "../../common/utils/hasButtonPermission";
import { format, parseISO } from 'date-fns';
import DatePicker from "react-datepicker";
import { StatusChangeModal } from "./StatusChangeModal";
import { PatientInfoModal } from "../InvoiceDiagonestic/PatientInfoModal";
import { PatientLinkModal } from "./PatientLinkModal";
import Select from "react-select";
const baseURL = import.meta.env.VITE_API_BASE_URL;


// ******************************************************
// ******************************************************

const STATUS_MAP = {
  0: 'Cancel',
  1: 'Booked',
  2: 'Checked In',
  3: 'In Consultation',
  4: 'Completed',
  5: 'Absent',
  6: 'Reschedule',
  7: 'Checked In Cancel',
};
// ******************************************************


export const COLUMNS = [
    {
        Header: (<div className="text-center">{"#"}</div>),
        accessor: "id",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    // {
    //     Header: (<div className="text-center ">{"Doctor's Name"}</div>),
    //     accessor: "doctorename",
    // },
    // {
    //     Header: (<div className="text-center">{"Speciality"}</div>),
    //     accessor: "speciality",
    //     className: "d-none d-md-table-cell"
    // },
    {
        Header: (<div className="text-center">{"Appointment Date"}</div>),
        accessor: "appointment_date",
        Cell: ({ value }) => <div className="text-center">{value}</div>,
    },
    {
        Header: (<div className="text-center">{"Days"}</div>),
        accessor: "daytime",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    // {
    //     Header: (<div className="text-center">{"Patient Name"}</div>),
    //     accessor: "patient_name",
    // },
    // {
    //     Header: (<div className="text-center">{"Mobile No"}</div>),
    //     accessor: "mobile",
    //     Cell: ({ value }) => <div className="text-center">{value}</div>
    // },
    {
        Header: (<div className="text-center">Patient Info</div>),
        accessor: row =>
            `${row.patient_name ?? ""} ${row.mobile ?? ""}`,
        id: "patient_info",
        Cell: ({ row }) => (
            <div className="">
                <strong>
                    {row.original.patient_name}
                </strong>{" "}
                <span className="">
                    ({row.original.mobile})
                </span>
            </div>
        ),
    },
    {
        Header: (<div className="text-center">{"Status"}</div>),
        accessor: "status",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    // {
    //     Header: (<div className="text-center">{"Payment Status"}</div>),
    //     accessor: "payment_status",
    //     Cell: ({ value }) => <div className="text-center">{value}</div>
    // },
    {
        Header: (<div className="text-center">{"Actions"}</div>),
        accessor: "action",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
];

export const DATATABLE = (doctorAppointment, handlers, permission) =>
    doctorAppointment.map((appointment, id) => ({
        id: id + 1,
        // doctorename: appointment.doctor.doctor_name || "Doctor Name",
        // speciality: appointment.doctor.speciality.lookup_value || "Speciality",
        appointment_date: appointment.appointment_date ? format(parseISO(appointment.appointment_date), 'dd-MM-yyyy') : '' || "Appointment Date",
        daytime: appointment.days || "Days & Schedule Time",
        patient_name: appointment.patient_name || "Patient Name",
        mobile: appointment.mobile_no || "Mobile No",
        // payment_status: (appointment.mobile_no) || "Mobile No",
        status: (
            <span
                className={`badge ${
                  appointment.status === 1 ? 'bg-primary'
                : appointment.status === 2 ? 'bg-warning text-dark'
                : appointment.status === 3 ? 'bg-info'
                : appointment.status === 4 ? 'bg-success'
                : appointment.status === 5 ? 'bg-warning'
                : appointment.status === 6 ? 'bg-dark'
                : appointment.status === 7 ? 'bg-secondary'
                : appointment.status === 0 ? 'bg-danger'
                : 'bg-secondary'
                }`}
            >
                {STATUS_MAP[appointment.status] || ''}
            </span>
        ),
        action: (
            <div className="d-flex justify-content-center">
                {permission.canView && 
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}> 
                        <span onClick={() => handlers.handleShowDataById(appointment)}  className="btn-sm bg-info" style={{ cursor: "pointer" }}>
                            <i className="bi bi-eye"></i>
                        </span>
                    </OverlayTrigger> 
                }
                {permission.canEdit && 
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}> 
                        <span onClick={() => handlers.handleEditDataById(appointment)} className="btn-sm bg-primary ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-pencil"></i>
                        </span>
                    </OverlayTrigger> 
                }
                { permission.canDelete && 
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}> 
                        <span onClick={() => handlers.deletePermissionAlert(appointment.id)} className="btn-sm bg-danger ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-trash"></i>
                        </span>
                    </OverlayTrigger> 
                }
                {appointment.status !== 4 && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Quick Change</Tooltip>}> 
                        <span onClick={() => handlers.handleShowModalById(appointment)} className="btn-sm bg-success ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-play-circle"></i>
                        </span>
                    </OverlayTrigger> 
                )}

                <OverlayTrigger placement="top" overlay={<Tooltip>Patient Link</Tooltip>}> 
                        <span onClick={() => handlers.handlePatientLinkModal(appointment)} className="btn-sm bg-secondary ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-link"></i>
                        </span>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>Payment Option</Tooltip>}> 
                        <span onClick={() => handlers.handlePatientPaymentModal(appointment)} className="btn-sm bg-warning ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-bank"></i>
                        </span>
                </OverlayTrigger>
            </div>
        )
    }));

export const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <span className="d-flex ms-auto">
            <input
                value={filter || ""}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control mb-4"
                placeholder="Search..."
            />
        </span>
    );
};

export const BasicTable = () => {

    //*********Check Authentication Start***********
    const token = localStorage.getItem('auth_token'); //Check Authentication
    const expiry = localStorage.getItem('auth_token_expiry');  // token expire check

    if (!token || (expiry && Date.now() > Number(expiry))) {
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
    //*********Check Authentication End***********

    //**********Permission Base Button Hide & Show Start************/
        const [canCreate, setCanCreate] = useState(false);
        const [canView, setCanView] = useState(false);
        const [canEdit, setCanEdit] = useState(false);
        const [canDelete, setCanDelete] = useState(false);

        useEffect(() => {
            hasButtonPermission('appointment', 'view').then(setCanView);
            hasButtonPermission('appointment', 'edit').then(setCanEdit);
            hasButtonPermission('appointment', 'delete').then(setCanDelete);
            hasButtonPermission('appointment', 'create').then(setCanCreate);
        }, []);
    //**********Permission Base Button Hide & Show End************/


    const [showData, setShowData] = useState(false);
    const [doctorAppointment, setDoctorAppointment] = useState([]);
    const [showSingleData, setSingleData] = useState([]);
    const [passEditFormData, setPassingEditFormData] = useState(null);
    

    // console.log(doctorAppointment)
    
    //*********Date & Doctors Wise Filter (From date - To date) Start**********/
        const [fromDate, setFromDate] = useState(new Date());
        const [toDate, setToDate] = useState(new Date());
        const [selectedDoctor, setSelectedDoctor] = useState(null);


        const doctorOptions = useMemo(() => {
            const uniqueDoctor = {}

            doctorAppointment.forEach((item) => {
                if(item.doctor) {
                    uniqueDoctor[item.doctor.id] = {
                        value: item.doctor.id,
                        label: item.doctor.doctor_name
                    }
                }
            })

            return Object.values(uniqueDoctor)
        }, [doctorAppointment])


        const filteredAppointments = useMemo(() => {
            if (!fromDate || !toDate) return doctorAppointment;

            let filtered = [...doctorAppointment];

            //Date wise Filter
            if (fromDate && toDate) {
                const from = format(fromDate, "yyyy-MM-dd");
                const to = format(toDate, "yyyy-MM-dd");

                filtered = filtered.filter(item => {
                    if (!item.appointment_date) return false;

                    const appointmentDate = format(
                        parseISO(item.appointment_date),
                        "yyyy-MM-dd"
                    );

                    return appointmentDate >= from && appointmentDate <= to;
                });
            }

            //Doctor Wise Filter
            if (selectedDoctor) {
                filtered = filtered.filter(
                    item => item.doctor?.id === selectedDoctor.value
                );
            }

            return filtered;
        }, [doctorAppointment, fromDate, toDate, selectedDoctor]);
    //*********Date & Doctors Filter (From date - To date) End**********/

    
    //--------Modal Handler Patient Status Start-----------
    const [showStatusModal, setShowStatusModal] = useState(false);  //Modal Open Close
    const [selectedPatient, setSelectedPatient] = useState(null);  //Selected Id for modal

        const openStatusModal = (appointment) => {
            setSelectedPatient(appointment); // full appointment object
            setShowStatusModal(true);        // modal open
        };

        const closeStatusModal = () => {
            setShowStatusModal(false);
            setSelectedPatient(null);
        };

        const handleShowModalById = (appointment) => {
            openStatusModal(appointment);
        };
    //--------Modal Handler Patient Status  End-----------


    //------Modal Patient Register Modal Start-------
        const [modalPatientShow, setModalPatientShow] = useState(false);  //Patient's Info Modal
    //------Modal Patient Register Modal End---------

    //------Modal Patient Register Start-------
        const [modalPatientLinkShow, setModalPatientLinkShow] = useState(false);  //Patient's Info Modal
        const [selectedLinkPatient, setSelectedLinkPatient] = useState(false);  //Patient's Info Modal

        const handlePatientLinkModal = (appointment) => {
            setSelectedLinkPatient(appointment)
            setModalPatientLinkShow(true)
        }
    //------Modal Patient Register End---------

    //------Modal Patient Register Start-------
        const [modalPatientPaymentShow, setModalPatientPaymentShow] = useState(false);  //Patient's Info Modal
        const [selectedPaymentPatient, setSelectedPaymentPatient] = useState(false);  //Patient's Info Modal

        const handlePatientPaymentModal = (appointment) => {
            setSelectedPaymentPatient(appointment)
            setModalPatientPaymentShow(true)
        }
    //------Modal Patient Register End---------







    const fetchItems = () => {
        fetch(`${baseURL}/appointment`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
            setDoctorAppointment(data.data);
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });
        };

        useEffect(() => {
        fetchItems();
        }, []);

    // console.log(doctorAppointment);

    const handleShowDataById = (appointment) => {
        setShowData(true);
        setSingleData(appointment);

    }

    /** Delete Handler */
    const handleDeleteClick = async (appointmentId) => {
        try {
            const result = await fetch(`${baseURL}/appointment/destroy/${appointmentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await result.json();

            if (response.status == 'success') {
                setDoctorAppointment(prevContact => prevContact.filter(c => c.id !== appointmentId));

            }
            return response;

        } catch (error) {
            console.log(error);
            return error;
        }
    };


    /*** Delete Permission Alert  */
    const deletePermissionAlert = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            buttonsStyling: false, 
            customClass: {
                confirmButton: 'btn border mx-2',
                cancelButton: 'btn btn-primary mx-2'
            },
            confirmButtonText: 'Yes, delete it!'

        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await handleDeleteClick(id);
                if (response.status == 'success') {
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                } else {
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting the item.',
                        'error'
                    );
                }

            }
        })

    }


    /** Edit Handler */
    const handleEditDataById = (appointment) => {
        // const data = doctorAppointment.find((appointment) => appointment.id == experienceId);

        setShowData(true);
        setSingleData(null)
        setPassingEditFormData(appointment);

    }


    /** Show Component */
    let content;
    if (showSingleData) {
        content = (
            <SingleTableFunction 
                setShowData={setShowData} 
                singleAppointment={showSingleData} 
                setSingleData={setSingleData} 
                />
        )
    } else if (passEditFormData) {
        content = (
            <AppointmentEditForm
                setShowData={setShowData} 
                setDoctorAppointment={setDoctorAppointment} 
                passEditFormData={passEditFormData} 
                setPassingEditFormData={setPassingEditFormData} 
                existingAppointment = {doctorAppointment} //for duplicate check
                fetchItems={fetchItems}
            />
        )
    }


    

    const dataTable = useMemo(() => DATATABLE(filteredAppointments, 
        {
            handleShowDataById,
            deletePermissionAlert,
            handleEditDataById,
            handleShowModalById,
            handlePatientLinkModal,
            handlePatientPaymentModal
        },
        {
            canView,
            canEdit,
            canDelete
        }
    ), [filteredAppointments, canView, canEdit, canDelete]);



    const tableInstance = useTable(
        {
            columns: COLUMNS,
            data: dataTable,
            initialState: { pageSize: 100 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps, // table props from react-table
        headerGroups, // headerGroups, if your table has groupings
        getTableBodyProps, // table body props from react-table
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter,
        page, // use, page or rows
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
    } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            {!showData ? (
                <>
                    <Row className="row-sm">
                        <Col xl={12}>
                            <Card className="custom-card">
                                <Card.Header className="justify-content-between p-2">
                                    <div className='card-title'>Appointment List</div>
                                    <div className="prism-toggle">
                                        <Fragment>    
                                            <Button className="btn btn-sm btn-info me-2" onClick={() => setModalPatientShow(true)}>
                                                Registetion
                                            </Button>
                                            <PatientInfoModal show={modalPatientShow} onHide={() => setModalPatientShow(false)} />               
                                        </Fragment>
                                        {canCreate && (
                                            <Link to={`${import.meta.env.BASE_URL}appointment/createform`} state={{doctorAppointment}}>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Create</Tooltip>}> 
                                                    <button
                                                        type="button" 
                                                        className="btn btn-sm btn-primary">New Appointment
                                                    </button>
                                                </OverlayTrigger>
                                            </Link>
                                        )}
                                    </div>

                                    <StatusChangeModal
                                        show={showStatusModal}
                                        onHide={closeStatusModal}
                                        appointment={selectedPatient}
                                        fetchItems={fetchItems}
                                    />
                                    
                                    <PatientLinkModal 
                                        show={modalPatientLinkShow} 
                                        onHide={() => setModalPatientLinkShow(false)}
                                        appointment={selectedLinkPatient}
                                        fetchItems={fetchItems}
                                    />

                                    <PatientLinkModal 
                                        show={modalPatientPaymentShow} 
                                        onHide={() => setModalPatientPaymentShow(false)}
                                        appointment={selectedPaymentPatient}
                                        fetchItems={fetchItems}
                                    />

                                </Card.Header>

                                <Card.Body className="p-2">

                                    <Row className="d-flex flex-column flex-sm-column flex-md-row justify-content-center gap-md-2 border-bottom pb-2">
                                        <Col xs={12} sm={6} md={6} lg={3}>
                                            <label><strong>Search Docotor</strong></label>
                                            <Select
                                                options={doctorOptions}
                                                classNamePrefix= "react-select"
                                                onChange={setSelectedDoctor}
                                                value={selectedDoctor}
                                                placeholder="Search and Select Doctor"
                                                isSearchable={true}
                                                isClearable={true}
                                            />
                                        </Col>
                                        <Col xs={12} sm={6} md={6} lg={3}>
                                            <label><strong>From Date</strong></label>
                                            <DatePicker
                                                selected={fromDate}
                                                onChange={(date) => setFromDate(date)}
                                                selectsStart
                                                startDate={fromDate}
                                                endDate={toDate}
                                                dateFormat="dd-MM-yyyy"
                                                placeholderText="From date"
                                                className="form-control"
                                            />
                                        </Col>

                                        <Col xs={12} sm={6} md={6} lg={3}>
                                            <label><strong>To Date</strong></label>
                                            <DatePicker
                                                selected={toDate}
                                                onChange={(date) => setToDate(date)}
                                                selectsEnd
                                                startDate={fromDate}
                                                endDate={toDate}
                                                minDate={fromDate}
                                                dateFormat="dd-MM-yyyy"
                                                placeholderText="To date"
                                                className="form-control"
                                            />
                                        </Col>
                                    </Row>
                                    <div className="d-flex mt-1">
                                        <select
                                            className=" mb-4 selectpage border me-1"
                                            value={pageSize}
                                            onChange={(e) => setPageSize((e.target.value))}
                                        >
                                            {[100, 150, 200, 300].map((pageSize) => (
                                                <option key={pageSize} value={pageSize}>
                                                    Show {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                                    </div>
                                    <div className="table-responsive">
                                        <table {...getTableProps()} className="table table-sm table-primary table-responsive table-striped table-hover mb-0 table-bordered">
                                            <thead className="bg-primary">
                                                {headerGroups.map((headerGroup) => (
                                                    <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
                                                        {headerGroup.headers.map((column) => (
                                                            <th
                                                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                                                className={column.className} key={Math.random()}
                                                            >
                                                                <span className="tabletitle text-white">{column.render("Header")}</span>
                                                                <span className="float-end">
                                                                    {column.isSorted ? (
                                                                        column.isSortedDesc ? (
                                                                            <i className="fa fa-angle-down"></i>
                                                                        ) : (
                                                                            <i className="fa fa-angle-up"></i>
                                                                        )
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </span>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </thead>
                                            <tbody {...getTableBodyProps()}>
                                                {page.map((row) => {
                                                    prepareRow(row);
                                                    return (
                                                        <tr {...row.getRowProps()} key={Math.random()}>
                                                            {row.cells.map((cell) => {
                                                                return (
                                                                    <td className="borderrigth text-nowrap" {...cell.getCellProps()} key={Math.random()}>
                                                                        {cell.render("Cell")}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-column flex-md-row d-block d-sm-flex mt-4 ">
                                        <span>
                                            Showing {pageIndex * pageSize + 1} to{" "}
                                            {Math.min((pageIndex + 1) * pageSize, filteredAppointments.length)} of{" "}
                                            {filteredAppointments.length} entries
                                        </span>
                                        <span className="ms-sm-auto ">
                                            <Button
                                                variant=""
                                                className="d-none d-md-inline btn-outline-light tablebutton me-2 d-sm-inline d-block my-1"
                                                onClick={() => gotoPage(0)}
                                                disabled={!canPreviousPage}
                                            >
                                                {" Previous "}
                                            </Button>
                                            <Button
                                                variant=""
                                                className="btn-outline-light tablebutton me-2 my-1"
                                                onClick={() => {
                                                    previousPage();
                                                }}
                                                disabled={!canPreviousPage}
                                            >
                                                {" << "}
                                            </Button>
                                            <Button
                                                variant=""
                                                className="btn-outline-light tablebutton me-2 my-1"
                                                onClick={() => {
                                                    previousPage();
                                                }}
                                                disabled={!canPreviousPage}
                                            >
                                                {" < "}
                                            </Button>
                                            <Button
                                                variant=""
                                                className="btn-outline-light tablebutton me-2 my-1"
                                                onClick={() => {
                                                    nextPage();
                                                }}
                                                disabled={!canNextPage}
                                            >
                                                {" > "}
                                            </Button>
                                            <Button
                                                variant=""
                                                className="btn-outline-light tablebutton me-2 my-1"
                                                onClick={() => {
                                                    nextPage();
                                                }}
                                                disabled={!canNextPage}
                                            >
                                                {" >> "}
                                            </Button>
                                            <Button
                                                variant=""
                                                className="d-none d-md-inline btn-outline-light tablebutton me-2 d-sm-inline d-block my-1"
                                                onClick={() => gotoPage(pageCount - 1)}
                                                disabled={!canNextPage}
                                            >
                                                {" Next "}
                                            </Button>
                                        </span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>


                </>
            ) : (
                <div>
                    {content}
                </div>

            )}

        </>
    )

};

// ******************************************************

// ******************************************************


export const ResponsiveDataTable = () => {

    const tableInstance = useTable(
        {
            columns: COLUMNS,
            data: DATATABLE,
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps, // table props from react-table
        headerGroups, // headerGroups, if your table has groupings
        getTableBodyProps, // table body props from react-table
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        state,
        setGlobalFilter,
        page, // use, page or rows
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        // _pageOptions,
        gotoPage,
        pageCount,
        // setPageSize,
    } = tableInstance;

    const { globalFilter, } = state;

    return (
        <>
            <div className="e-table">
                <div className="d-flex">
                    <GlobalResFilter filter={globalFilter} setFilter={setGlobalFilter} />
                </div>
                <div className='table-responsive '>
                    <Table
                        {...getTableProps()}
                        className=" table table-sm table-bordered text-nowrap mb-0"
                    >
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
                                    {headerGroup.headers.map(column => (
                                        <th
                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                            key={Math.random()}
                                            className={column.className}
                                        >
                                            <span className="tabletitle">{column.render("Header")}</span>
                                            <span className="float-end">
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <i className="fa fa-angle-down"></i>
                                                    ) : (
                                                        <i className="fa fa-angle-up"></i>
                                                    )
                                                ) : (
                                                    ""
                                                )}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row) => {
                                prepareRow(row);
                                return (
                                    <tr className="" {...row.getRowProps()} key={Math.random()}>
                                        {row.cells.map((cell) => {
                                            return (
                                                <td {...cell.getCellProps()} key={Math.random()}>{cell.render("Cell")}</td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
                <div className="d-block d-sm-flex mt-4 ">
                    {/* <span className="">
                        Showing 41 to 50 of 50 entries{" "}
                    </span> */}
                    <span className="ms-sm-auto ">
                        <Button
                            variant=""
                            className="btn-outline-light tablebutton me-2 my-2 d-sm-inline d-block"
                            onClick={() => gotoPage(0)}
                            disabled={!canNextPage}
                        >
                            {" Previous "}
                        </Button>
                        <Button
                            variant="primary"
                            className="tablebutton me-2 my-2"
                            onClick={() => {
                                previousPage();
                            }}
                            disabled={!canPreviousPage}
                        >
                            {" 1 "}
                        </Button>
                        <Button
                            variant=""
                            className="btn-outline-light tablebutton me-2 my-2"
                            onClick={() => {
                                nextPage();
                            }}
                            disabled={!canNextPage}
                        >
                            {" 2 "}
                        </Button>
                        <Button
                            variant=""
                            className="btn-outline-light tablebutton me-2 my-2"
                            onClick={() => {
                                nextPage();
                            }}
                            disabled={!canNextPage}
                        >
                            {" 3 "}
                        </Button>
                        <Button
                            variant=""
                            className="btn-outline-light tablebutton me-2 my-2"
                            onClick={() => {
                                nextPage();
                            }}
                            disabled={!canNextPage}
                        >
                            {" 4"}
                        </Button>
                        <Button
                            variant=""
                            className="btn-outline-light tablebutton me-2 my-2"
                            onClick={() => {
                                nextPage();
                            }}
                            disabled={!canNextPage}
                        >
                            {" 5 "}
                        </Button>
                        <Button
                            variant=""
                            className="btn-outline-light tablebutton me-2 my-2"
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                        >
                            {" Next "}
                        </Button>
                    </span>
                </div>
            </div>

        </>
    );
};

const GlobalResFilter = ({ filter, setFilter }) => {
    return (
        <span className="d-flex ms-auto">
            <input
                value={filter || ""}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control mb-4"
                placeholder="Search..."
            />
        </span>
    );
};


