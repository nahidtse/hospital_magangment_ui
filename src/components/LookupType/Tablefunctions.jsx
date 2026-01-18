import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import RoleEditForm from "./LookupTypeEditForm";
import SingleTableFunction from "./SingleTableFunction";
import LookupTypeEditForm from "./LookupTypeEditForm";
import { hasButtonPermission } from "../../common/utils/hasButtonPermission";
const basURL = import.meta.env.VITE_API_BASE_URL;



// ******************************************************
// ******************************************************
// ******************************************************


export const COLUMNS = [
    {
        Header: "#",
        accessor: "id",
    },
    {
        Header: "Lookup Type",
        accessor: "lookuptypename",
    },
    {
        Header: "Lookup Code",
        accessor: "lookupcodename",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Actions",
        accessor: "action",
    },
];

export const DATATABLE = (lookupTypes = [], handlers, permission) =>
    // console.log(lookupTypes)
    lookupTypes.length > 0 ? lookupTypes.map((contact, id) => ({
        id: id + 1,
        lookuptypename: contact.lookup_type || "Lookup Type Name",  
        lookupcodename: contact.lookup_code || "Lookup Code Name",
        status: contact.is_active == 1 ? "Active" : "Inactive",
        action: (
            <>
                { permission.canView && 
                    <OverlayTrigger placement="top" overlay={<Tooltip>View</Tooltip>}> 
                        <span onClick={() => handlers.handleShowDataById(contact)}  className="btn-sm bg-info" style={{ cursor: "pointer" }}>
                            <i className="bi bi-eye"></i>
                        </span>
                    </OverlayTrigger>
                }
                { permission.canEdit &&
                    <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}> 
                        <span onClick={() => handlers.handleEditDataById(contact)} className="btn-sm bg-primary ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-pencil"></i>
                        </span>
                    </OverlayTrigger> 
                }
                { permission.canDelete &&
                    <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}> 
                        <span onClick={() => handlers.deletePermissionAlert(contact.id)} className="btn-sm bg-danger ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-trash"></i>
                        </span>
                    </OverlayTrigger> 
                }
            </>
        )
    })) : [];

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
        hasButtonPermission('lookuptype', 'view').then(setCanView);
        hasButtonPermission('lookuptype', 'edit').then(setCanEdit);
        hasButtonPermission('lookuptype', 'delete').then(setCanDelete);
        hasButtonPermission('lookuptype', 'create').then(setCanCreate);
    }, []);
  //**********Permission Base Button Hide & Show End************/


    const [showData, setShowData] = useState(false);
    const [lookupTypes, setLookupTypes] = useState([]);
    const [showSingleData, setSingleData] = useState([]);
    const [passEditFormData, setPassingEditFormData] = useState(null);

    // console.log(lookupTypes)
    const handleShowDataById = (contact) => {
        setShowData(true);
        setSingleData(contact);

    }

    /** Delete Handler */
    const handleDeleteClick = async (lookupTypeId) => {

        try {
            const result = await fetch(`${basURL}/lookuptype/destroy/${lookupTypeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await result.json();

            if (response.status == 'success') {
                setLookupTypes(prevContact => prevContact.filter(c => c.id !== lookupTypeId));

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
            confirmButtonColor: '#5e76a6',
            cancelButtonColor: '#ef4444',
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
                        response.message || 'There was an issue deleting the item.',
                        'error'
                    );
                }

            }
        })

    }


    /** Edit Handler */
    const handleEditDataById = (contact) => {
        // const data = lookupTypes.find((contact) => contact.id == lookupTypeId);
        setShowData(true);
        setSingleData(null)
        setPassingEditFormData(contact);
    }


    /** Show Component */
    let content;
    if (showSingleData) {
        content = (
            <SingleTableFunction 
                setBusinessUnitList={setShowData} 
                singlelookupTypesData={showSingleData} 
                setSingleData={setSingleData} 
                />
        )
    } else if (passEditFormData) {
        content = (
            <LookupTypeEditForm 
                setBusinessUnitList={setShowData} 
                setLookupTypesData={setLookupTypes} 
                passEditFormData={passEditFormData} 
                setPassingEditFormData={setPassingEditFormData} 
                existingPermissionsData = {lookupTypes}
                />
        )
    }

    /** Data Fetch */
    useEffect(() => {
        fetch(`${basURL}/lookuptype`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data)
                setLookupTypes(data.data)
               
            })
            .catch((error) => {
                console.log("Error Fetching the data: ", error)
            })
    }, [])

    const dataTable = useMemo(() => DATATABLE(lookupTypes, 
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
    ), [lookupTypes, canView, canEdit, canDelete]);



    const tableInstance = useTable(
        {
            columns: COLUMNS,
            data: dataTable,
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
                                        {canCreate && (
                                            <Link to={`${import.meta.env.BASE_URL}lookuptype/createform`} state={{lookupTypes}}>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>Create</Tooltip>}> 
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary"> New
                                                    </button>
                                                </OverlayTrigger>
                                            </Link>
                                        )}
                                    </div>

                                </Card.Header>

                                <Card.Body>

                                    <div className="d-flex">
                                        <select
                                            className=" mb-4 selectpage border me-1"
                                            value={pageSize}
                                            onChange={(e) => setPageSize((e.target.value))}
                                        >
                                            {[10, 25, 50, 100].map((pageSize) => (
                                                <option key={pageSize} value={pageSize}>
                                                    Show {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                                    </div>
                                    <table {...getTableProps()} className="table table-hover mb-0 table-bordered">
                                        <thead>
                                            {headerGroups.map((headerGroup) => (
                                                <tr {...headerGroup.getHeaderGroupProps()} key={Math.random()}>
                                                    {headerGroup.headers.map((column) => (
                                                        <th
                                                            {...column.getHeaderProps(column.getSortByToggleProps())}
                                                            className={column.className} key={Math.random()}
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
                                            {Math.min((pageIndex + 1) * pageSize, lookupTypes.length)} of{" "}
                                            {lookupTypes.length} entries
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


