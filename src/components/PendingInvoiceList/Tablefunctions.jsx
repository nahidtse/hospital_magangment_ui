import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { useTable, useSortBy, useGlobalFilter, usePagination, } from "react-table";
import { useEffect, useMemo, useRef, useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format, parseISO } from 'date-fns';
import { DuesCollectionModal } from "./DuesCollectionModal";
import InvoicePrint from "../../common/utils/InvoicePrint";
const baseURL = import.meta.env.VITE_API_BASE_URL;


// ******************************************************
// ******************************************************
// ******************************************************


export const COLUMNS = [
    {
        Header: (<div className="text-center">{"#"}</div>),
        accessor: "id",
    },
    {
        Header: (<div className="text-center">{"Invoice Date"}</div>),
        accessor: "invoiceDate",
    },
    {
        Header: (<div className="text-center">{"Invoice Time"}</div>),
        accessor: "invoiceTime",
    },
    {
        Header: (<div className="text-center">{"Invoice No"}</div>),
        accessor: "invoiceNo",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    {
        Header: (<div className="text-center">{"Pateint Name"}</div>),
        accessor: "patientName",
    },
    {
        Header: (<div className="text-center">{"Mobile No"}</div>),
        accessor: "mobileNo",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
    {
        Header: (<div className="text-center">{"Gross Total"}</div>),
        accessor: "grossTotal",
    },
    {
        Header: (<div className="text-center">{"Advance Amount"}</div>),
        accessor: "advAmount",
    },
    {
        Header: (<div className="text-center">{"Dues Amount"}</div>),
        accessor: "duesAmount",
    },
    {
        Header: (<div className="text-center">{"Actions"}</div>),
        accessor: "action",
        Cell: ({ value }) => <div className="text-center">{value}</div>
    },
];

export const DATATABLE = (dueAmount, handlers, isGeneratingPdf) =>
    dueAmount
            .filter(due => handlers.totalDuesAmountCollection(due) > 0)
            .map((due, id) => ({
                id: (<div className="text-center">{id + 1}</div>),
                invoiceNo: due.invoice_no || "", 
                invoiceDate: (<div className="text-center">{due.invoice_date ? format(parseISO(due.invoice_date), 'dd-MM-yyyy') : '' || ""}</div>), 
                invoiceTime: (<div className="text-center">{due.invoice_date ? format(parseISO(due.invoice_date), 'hh:mm a') : '' || ""}</div>), 
                patientName: due.patient_name || "",
                mobileNo: due.mobile_no || "",
                grossTotal: (<div className="text-end">{due.gross_total || ""}</div>),
                advAmount: (<div className="text-end">{handlers.totalDuesAddAdvAmount(due)}</div>),
                // duesAmount: (<div className="text-end">{due.due_amount || ""}</div>),
                duesAmount: (<div className="text-end">{handlers.totalDuesAmountCollection(due)}</div>),
                action: (
                    <>
                        <Link to={`${import.meta.env.BASE_URL}pendinginvoice/singledata`} state={{ singleData: due }}>
                            <i className="bi bi-eye btn-sm bg-info"></i> 
                        </Link>

                        <span onClick={()=> handlers.openDuesModal(due)} className="btn-sm bg-primary ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-bank"></i>
                        </span>

                        <span 
                            onClick={() => !isGeneratingPdf && handlers.handleInvoiceAction(due, "download")} 
                            className={`btn-sm ms-2 ${isGeneratingPdf ? "bg-secondary" : "bg-success"}`} 
                            style={{ cursor: isGeneratingPdf ? "not-allowed" : "pointer" }}
                        >
                            <i className="bi bi-file-pdf"></i>
                        </span>
                        {/* <span onClick={() => handlers.handleInvoiceAction(due, "print")} className="btn-sm bg-success ms-2" style={{ cursor: "pointer" }}>
                            <i className="bi bi-file-pdf"></i>
                        </span> */}
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


    const [dueAmount, setDueAmount] = useState([]);   //React Select for Dues Amount Collection
    const [showDuesModal, setShowDuesModal] = useState(false);  //Modal Open Close
    const [selectedDue, setSelectedDue] = useState(null);  //Selected Id for modal
    const [invoiceData, setInvoiceData] = useState(null);  //For Invoice
    const [actionType, setActionType] = useState("download");  //For Invoice ActionType "Print"/"Download"
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);  // For Duble Click problem
   

    //For Invoice Pdf
    const handleInvoiceAction = (due, type) => {
        if (isGeneratingPdf) return; // block double click
        setIsGeneratingPdf(true);
        setActionType(type) //set action type

        const formatedData = {
            master : {...due},
            details: due.invoice_details || [],
            moneyReceipt: due.money_receipt || [],
            doctorNameById: due.doctor_info || null
        }
        setInvoiceData(formatedData); // triggers useEffect
    };
 

    const fetchItems = () => {
        fetch(`${baseURL}/invoice_master/deu_amount`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // <-- must send token
            }
        })
            .then((response) => response.json())
            .then((data) => {
            setDueAmount(data.data);
            })
            .catch((error) => {
            console.log("Error Fetching the data: ", error);
            });
        };

        useEffect(() => {
         fetchItems();
        }, []);

        //-----Advance & all collection Calculate Start-------------
        const totalDuesAmountCollection = (allCollection) => {
            const collectedAmount = allCollection?.money_receipt?.reduce(
                (sum, item) => sum + Number(item?.mr_amount || 0),
                0
            ) || 0;

            return Number(allCollection?.gross_total || 0) - collectedAmount;
        };

        const totalDuesAddAdvAmount = (allCollection) => {
            const collectedAmount = allCollection?.money_receipt?.reduce(
                (sum, item) => sum + Number(item?.mr_amount || 0),
                0
            ) || 0;

            return collectedAmount;
        };
        //-----Advance & all collection Calculate End-------------


    //--------Modal Handler Start-----------
        const openDuesModal = (due) => {
            setSelectedDue(due) //Clicked Due data set
            setShowDuesModal(true)
        }
        
        const closeDuesModal = () => {
            setSelectedDue(null);
            setShowDuesModal(false);
        };
    //--------Modal Handler End-----------    



    const dataTable = useMemo(() => DATATABLE(dueAmount, {
        openDuesModal: openDuesModal,
        totalDuesAmountCollection: totalDuesAmountCollection,
        totalDuesAddAdvAmount: totalDuesAddAdvAmount,
        handleInvoiceAction: handleInvoiceAction
    }, isGeneratingPdf), [dueAmount, isGeneratingPdf]);



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
            <Row className="row-sm">
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header className="justify-content-between">
                            <div className='card-title'>Pending Invoice List</div>
                            <div className="prism-toggle">
                                {/* <Link to={`${import.meta.env.BASE_URL}bankinfo/createform`} state={{dueAmount}}><button
                                    type="button"
                                    className="btn btn-sm btn-primary"> New
                                </button>
                                </Link> */}
                                <DuesCollectionModal
                                    show={showDuesModal}
                                    onHide={closeDuesModal}
                                    due={selectedDue}
                                    fetchItems={fetchItems} //for List Render
                                />

                                {/* Hidden invoice render */}
                                {invoiceData && (
                                <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                                    <InvoicePrint 
                                        invoiceData={invoiceData} 
                                        actionType={actionType} 
                                        onDone={() => {
                                            setInvoiceData(null);
                                            setIsGeneratingPdf(false); // unlock
                                        }}
                                    />
                                </div>
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
                                    {[50, 100, 200, 300].map((pageSize) => (
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
                                    {dataTable.length > 0 ? (
                                        <>
                                        Showing {pageIndex * pageSize + 1} to{" "}
                                        {Math.min((pageIndex + 1) * pageSize, dataTable.length)} of{" "}
                                        {dataTable.length} entries
                                        </>
                                    ) : (
                                        "Showing 0 entries"
                                    )}
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


