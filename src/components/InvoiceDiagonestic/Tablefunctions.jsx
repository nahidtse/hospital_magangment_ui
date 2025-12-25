import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import RoleEditForm from "./InvoiceDiagonesticEditForm";
import SingleTableFunction from "./SingleTableFunction";
import InvoiceDiagonesticEditForm from "./InvoiceDiagonesticEditForm";
import { format, parseISO } from 'date-fns';
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
        Header: "Invoice Date",
        accessor: "invoiceDate",
    },
    {
        Header: "Time",
        accessor: "invoiceTime",
    },
    {
        Header: "Invoice No",
        accessor: "invoiceNo",
    },
    {
        Header: "Patient Name",
        accessor: "patientname",
    },
    {
        Header: "Mobile No",
        accessor: "mobile",
    },
    {
        Header: () => <div className="text-center">Age (Year)</div>,
        accessor: "age",
    },
    {
        Header: "Sex",
        accessor: "sex",
    },
    {
        Header: () => <div className="text-center">Invoice Amount</div>,
        accessor: "grossTotal",
    },
    {
        Header: "Actions",
        accessor: "action",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
];

export const DATATABLE = (invoiceMaster, handlers) =>
    invoiceMaster.map((invoice, id) => ({
        id: (<div className="text-center">{ id + 1 }</div>),
        patientname: invoice.patient_name || "Patient Name",
        mobile: (<div className="text-center">{ invoice.mobile_no || "Mobile No" }</div>),
        invoiceNo: (<div className="text-center">{ invoice.invoice_no || "Invoice No" }</div>),
        sex: (<div className="text-center">{ invoice.sex || "Sex" }</div>),
        age: (<div className="text-center">{ invoice.age_year || "" }</div>),
        invoiceDate: (<div className="text-center">{ invoice.invoice_date ? format(parseISO(invoice.invoice_date), 'dd-MM-yyyy') : '' || "Invoice Date" }</div>),
        invoiceTime: (<div className="text-center">{ invoice.invoice_date ? format(parseISO(invoice.invoice_date), 'hh:mm a') : '' || "Invoice Time" }</div>),
        grossTotal: (
            <div className="text-end">{Number(invoice.gross_total).toLocaleString('en-US') || ""}</div>
        ),
        action: (
            <>
                <span onClick={() => handlers.handleShowDataById(invoice)}  className="btn-sm bg-info" style={{ cursor: "pointer" }}>
                <i className="bi bi-eye"></i>
                </span>
                <span onClick={() => handlers.handleEditDataById(invoice)} className="btn-sm bg-primary ms-2" style={{ cursor: "pointer" }}>
                    <i className="bi bi-pencil"></i>
                </span>
                <span onClick={() => handlers.deletePermissionAlert(invoice.id)} className="btn-sm bg-danger ms-2" style={{ cursor: "pointer" }}>
                    <i className="bi bi-x-circle"></i>
                </span>
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


    const [showData, setShowData] = useState(false);
    const [invoiceMaster, setInvoiceMaster] = useState([]);
    const [showSingleData, setSingleData] = useState([]);
    const [passEditFormData, setPassingEditFormData] = useState(null);



    const fetchItems = () => {
        fetch(`${basURL}/invoice_master`)
            .then((response) => response.json())
            .then((data) => {
            setInvoiceMaster(data.data);
            })
            .catch((error) => {
             console.log("Error Fetching the data: ", error);
            });
        };

        useEffect(() => {
        fetchItems();
        }, []);

    // console.log("Invoice Data",invoiceMaster);

    const handleShowDataById = (invoice) => {
        setShowData(true);
        setSingleData(invoice);

    }

    /** Delete Handler */
    // const handleDeleteClick = async (appointmentId) => {
    //     try {
    //         const result = await fetch(`${basURL}/invoice/destroy/${appointmentId}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         const response = await result.json();

    //         if (response.status == 'success') {
    //             setInvoiceMaster(prevContact => prevContact.filter(c => c.id !== appointmentId));

    //         }
    //         return response;

    //     } catch (error) {
    //         console.log(error);
    //         return error;
    //     }

    // };


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
    const handleEditDataById = (invoice) => {
        // const data = invoiceMaster.find((invoice) => invoice.id == experienceId);

        setShowData(true);
        setSingleData(null)
        setPassingEditFormData(invoice);

    }


    /** Show Component */
    let content;
    if (showSingleData) {
        content = (
            <SingleTableFunction 
                setShowData={setShowData} 
                singleInvoice={showSingleData} 
                setSingleData={setSingleData} 
                />
        )
    } else if (passEditFormData) {
        content = (
            <InvoiceDiagonesticEditForm
                setShowData={setShowData} 
                setInvoiceMaster={setInvoiceMaster} 
                passEditFormData={passEditFormData} 
                setPassingEditFormData={setPassingEditFormData} 
                existingInvoice = {invoiceMaster} //for duplicate check
                fetchItems={fetchItems}
            />
        )
    }


    

    const dataTable = useMemo(() => DATATABLE(invoiceMaster, {
        handleShowDataById,
        deletePermissionAlert,
        handleEditDataById

    }), [invoiceMaster]);



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
                                <Card.Header className="justify-content-between">
                                    <div className='card-title'>Invoice (Diagonestic) List</div>
                                    <div className="prism-toggle">
                                        <Link to={`${import.meta.env.BASE_URL}invoicediagonestic/createform`} state={{invoiceMaster}}>
                                        <button
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
                                            {[100, 200, 300, 450].map((pageSize) => (
                                                <option key={pageSize} value={pageSize}>
                                                    Show {pageSize}
                                                </option>
                                            ))}
                                        </select>
                                        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                                    </div>
                                    <table {...getTableProps()} className="table table-sm table-primary table-striped table-hover mb-0 table-bordered">
                                        <thead className="bg-primary text-center">
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
                                            {Math.min((pageIndex + 1) * pageSize, invoiceMaster.length)} of{" "}
                                            {invoiceMaster.length} entries
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


