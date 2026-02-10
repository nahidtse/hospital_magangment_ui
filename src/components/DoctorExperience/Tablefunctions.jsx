import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import RoleEditForm from "./DoctorExperienceEditForm";
import SingleTableFunction from "./SingleTableFunction";
import DoctorExperienceEditForm from "./DoctorExperienceEditForm";
import { hasButtonPermission } from '../../common/utils/hasButtonPermission';
import { format, parseISO } from 'date-fns';
const basURL = import.meta.env.VITE_API_BASE_URL;


// ******************************************************
// ******************************************************
// ******************************************************


export const COLUMNS = [
    {
        Header: (<div className="text-center">{"#"}</div>),
        accessor: "id",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    {
        Header: (<div className="text-center">{"Doctor's Name"}</div>),
        accessor: "doctorename",
    },
    {
        Header: (<div className="text-center">{"BMDC No"}</div>),
        accessor: "bmdcno",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    {
        Header: (<div className="text-center">{"Institute"}</div>),
        accessor: "institute",
    },
    {
        Header: (<div className="text-center">{"Designation"}</div>),
        accessor: "desig",
    },
    {
        Header: (<div className="text-center">{"Department"}</div>),
        accessor: "dept",
    },
    {
        Header: (<div className="text-center">{"Form Date"}</div>),
        accessor: "fromdate",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    {
        Header: (<div className="text-center">{"Serial No"}</div>),
        accessor: "serial",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    // {
    //     Header: "Period",
    //     accessor: "period",
    // },
    {
        Header: (<div className="text-center">{"Actions"}</div>),
        accessor: "action",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
];

export const DATATABLE = (doctorExperience, handlers, permissions) =>
    doctorExperience.map((experience, id) => ({
        id: id + 1,
        doctorename: experience.doctor.doctor_name || "Doctor Name",
        bmdcno: experience.doctor.bmdc_no || "MBDC No",
        institute: experience.institute.lookup_value || "Institute",
        desig: experience.designation.lookup_value || "Designation",
        dept: experience.department.lookup_value || "Department",
        fromdate: experience.from_date ? format(experience.from_date, 'dd-MM-yyyy') : '' || "From Date",
        serial: experience.serial_no || "Serial No",
        status: experience.is_active == 1 ? "Active" : "Inactive",
        action: (
            <>
                {permissions.canView && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}> 
                        <span onClick={() => handlers.handleShowDataById(experience)}  className="btn-sm bg-info" style={{ cursor: "pointer" }}>
                            <i className="bi bi-eye"></i>
                        </span>
                    </OverlayTrigger> 
                )}
                {permissions.canEdit && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}> 
                        <span onClick={() => handlers.handleEditDataById(experience)} className="btn-sm bg-primary ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-pencil"></i>
                        </span>
                    </OverlayTrigger> 
                )}
                {permissions.canDelete && (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}> 
                        <span onClick={() => handlers.deletePermissionAlert(experience.id)} className="btn-sm bg-danger ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-trash"></i>
                        </span>
                    </OverlayTrigger> 
                )}
            </>
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
        hasButtonPermission('doctorexperience', 'view').then(setCanView);
        hasButtonPermission('doctorexperience', 'edit').then(setCanEdit);
        hasButtonPermission('doctorexperience', 'delete').then(setCanDelete);
        hasButtonPermission('doctorexperience', 'create').then(setCanCreate);
    }, []);
  //**********Permission Base Button Hide & Show End************/


    const [showData, setShowData] = useState(false);
    const [doctorExperience, setDoctorExperience] = useState([]);
    const [showSingleData, setSingleData] = useState([]);
    const [passEditFormData, setPassingEditFormData] = useState(null);



    const fetchItems = () => {
        fetch(`${basURL}/experience`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
            setDoctorExperience(data.data);
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });
        };

        useEffect(() => {
        fetchItems();
        }, []);

    // console.log(doctorExperience);

    const handleShowDataById = (experience) => {
        setShowData(true);
        setSingleData(experience);

    }

    /** Delete Handler */
    const handleDeleteClick = async (experienceId) => {
        try {
            const result = await fetch(`${basURL}/experience/destroy/${experienceId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await result.json();

            if (response.status == 'success') {
                setDoctorExperience(prevContact => prevContact.filter(c => c.id !== experienceId));

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
    const handleEditDataById = (experience) => {
        // const data = doctorExperience.find((experience) => experience.id == experienceId);

        setShowData(true);
        setSingleData(null)
        setPassingEditFormData(experience);

    }


    /** Show Component */
    let content;
    if (showSingleData) {
        content = (
            <SingleTableFunction 
                setShowData={setShowData} 
                singleExperienceData={showSingleData} 
                setSingleData={setSingleData} 
                />
        )
    } else if (passEditFormData) {
        content = (
            <DoctorExperienceEditForm
                setShowData={setShowData} 
                setDoctorExperience={setDoctorExperience} 
                passEditFormData={passEditFormData} 
                setPassingEditFormData={setPassingEditFormData} 
                existingDoctorExperience = {doctorExperience} //for duplicate check
                fetchItems={fetchItems}
            />
        )
    }


    

    const dataTable = useMemo(() => DATATABLE(doctorExperience, 
        {
            handleShowDataById,
            deletePermissionAlert,
            handleEditDataById
        },
        {
            canView,
            canEdit,
            canDelete
        }
    ), [doctorExperience, canView, canEdit, canDelete]);



    const tableInstance = useTable(
        {
            columns: COLUMNS,
            data: dataTable,
            initialState: { pageSize: 50 },
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
                                <Card.Header className="justify-content-between">
                                    <div className='card-title'>List</div>
                                    <div className="prism-toggle">
                                        {
                                            canCreate && (
                                                <Link to={`${import.meta.env.BASE_URL}doctorexperience/createform`} state={{doctorExperience}}>
                                                    <OverlayTrigger placement="top" overlay={<Tooltip>Create</Tooltip>}> 
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary"> New
                                                        </button>
                                                    </OverlayTrigger>
                                                </Link>
                                            )
                                        }
                                    </div>

                                </Card.Header>

                                <Card.Body>

                                    <div className="d-flex">
                                        <select
                                            className=" mb-4 selectpage border me-1"
                                            value={pageSize}
                                            onChange={(e) => setPageSize((e.target.value))}
                                        >
                                            {[50, 100, 150, 200].map((pageSize) => (
                                                <option key={pageSize} value={pageSize}>
                                                    Show {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                                    </div>
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
                                                                <td className="borderrigth" {...cell.getCellProps()} key={Math.random()}>
                                                                    {cell.render("Cell")}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="d-block d-sm-flex mt-4 ">
                                        <span>
                                            Showing {pageIndex * pageSize + 1} to{" "}
                                            {Math.min((pageIndex + 1) * pageSize, doctorExperience.length)} of{" "}
                                            {doctorExperience.length} entries
                                        </span>
                                        <span className="ms-sm-auto ">
                                            <Button
                                                variant=""
                                                className="btn-outline-light tablebutton me-2 d-sm-inline d-block my-1"
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
                                                className="btn-outline-light tablebutton me-2 d-sm-inline d-block my-1"
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
                        className=" table-bordered text-nowrap mb-0"
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


