import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import SingleTableFunction from "./MenuSingleTableFunction";
import MenuEditForm from "./MenuEditForm";
const baseURL = import.meta.env.VITE_API_BASE_URL;

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
        Header: (<div className="text-center">{"Menu Name"}</div>),
        accessor: "menuname",
    },
    {
        Header: (<div className="text-center">{"Module Name"}</div>),
        accessor: "modulename",
    },
    {
        Header: (<div className="text-center">{"Permission"}</div>),
        accessor: "permissionname",
    },
    {
        Header: (<div className="text-center">{"Status"}</div>),
        accessor: "status",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    {
        Header: (<div className="text-center">{"Actions"}</div>),
        accessor: "action",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
];



export const DATATABLE = (menuInfo, handlers) =>

    menuInfo.map((menu, id) => ({
        id: id + 1,
        menuname: menu.menu_name,
        modulename: menu.module?.module_name || 'Module Name',
        permissionname:  menu.permissions && menu.permissions.length > 0 ? menu.permissions.map(p => p.permission_name).join(', ') : '',
        status: menu.is_active == 1 ? "Active" : "Inactive",
        action: (
            <>
                <Link to={`${import.meta.env.BASE_URL}menu/singledata`} state={{singleData: menu}}><i className="bi bi-eye btn-sm bg-info"></i></Link>
                <span onClick={() => handlers.handleEditDataById(menu)} className="btn-sm bg-primary ms-1" style={{ cursor: "pointer" }}><i className="bi bi-pencil"></i></span>
                <span onClick={() => handlers.deletePermissionAlert(menu.id)} className="btn-sm bg-danger ms-1" style={{ cursor: "pointer" }}><i className="bi bi-trash"></i></span>

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


    const [showData, setShowData] = useState(false);
    const [menuInfo, setMenuInfo] = useState([]);
    const [showSingleData, setSingleData] = useState([]);
    const [passEditFormData, setPassingEditFormData] = useState(null);


    /** Delete Handler */
    const handleDeleteClick = async (contactId) => {
        try {
            const result = await fetch(`${baseURL}/menu/destroy/${contactId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const response = await result.json();
            if (response.status == 'success') {
                setMenuInfo(prevContact => prevContact.filter(c => c.id !== contactId));

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
                        'There was an issue deleting the item.',
                        'error'
                    );
                }

            }
        })

    }


    /** Edit Handler */
    const handleEditDataById = (menu) => {
        // const data = menuInfo.find((menu) => menu.id == contactId);
        setShowData(true);
        setSingleData(null)
        setPassingEditFormData(menu);

    }


    /** Show Component */
    let content;
    if (showSingleData) {
        content = (
            <SingleTableFunction setShowData={setShowData} singleContactsData={showSingleData} setSingleData={setSingleData} />
        )
    } else if (passEditFormData) {
        content = (
            <MenuEditForm setShowData={setShowData} setContactsData={setMenuInfo} passEditFormData={passEditFormData} setPassingEditFormData={setPassingEditFormData} />
        )
    }


    /** Data Fetch */

    useEffect(() => {
        fetch(`${baseURL}/menu`, {
            headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
        })
            .then((response) => response.json())
            .then((data) => {
                setMenuInfo(data.data || [])
            })
            .catch((error) => {
                console.log("Error Fetching the data: ", error)
            })
    }, [])

    const dataTable = useMemo(() => DATATABLE(menuInfo, {
        deletePermissionAlert,
        handleEditDataById

    }), [menuInfo]);



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
                                    <div className='card-title'>Menu List</div>
                                    <div className="prism-toggle">
                                        <Link to={`${import.meta.env.BASE_URL}menu/createform`} state={{ menuInfo }}><button
                                            type="button"
                                            className="btn btn-sm btn-primary"> New
                                        </button>
                                        </Link>
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
                                    <table {...getTableProps()} className="table table-sm table-primary table-striped table-hover mb-0 table-bordered">
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
                                        <span className="">
                                            Showing 1 to 10 of 57 entries{" "}

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


