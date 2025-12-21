import React, { useEffect, useRef } from 'react'
import html2pdf from "html2pdf.js";
import style from "../../assets/css/myStyleCss/invoicePrint.module.css"
import JsBarcode from 'jsbarcode';
import { format } from "date-fns";

function InvoicePrint({resInvoiceData, onDone}) {
    console.log(resInvoiceData)

    const pdfRef = useRef();
    //Invoice Date formet
    const originalDate = resInvoiceData.master.invoice_date
    const formatedInvoiceDate = format(new Date(originalDate), "yyyy-MM-dd hh:mm a")

    useEffect(()=> {

        if(!resInvoiceData) return;

        // Ensure DOM loaded before generating barcode + pdf
        setTimeout(() => {

            JsBarcode("#barcode", `*${resInvoiceData.master.invoice_no}*`, {
                format: "code128",
                width: 2,
                height: 60,
                displayValue: false
            });

            generatePdf ();

        }, 300)

    }, [resInvoiceData]);

    //
    const generatePdf  = async () => {
        const element = pdfRef.current; //this part for Pdf

        const pdfOptions = {
            margin: 0.4,
            filename: `Invoice_${resInvoiceData.master.invoice_no}.pdf`,
            image: {type: "jpeg", quantity: 1},
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        }

        // Download + Open PDF both
        // const pdfBlob = await html2pdf().set(pdfOptions).from(element).outputPdf("blob");

        const worker = html2pdf().set(pdfOptions).from(element)

        //Generate PDF Blob
        const pdfBlob = await worker.outputPdf("blob");

        // Auto Download
        worker.save();

        console.log("Pdf Create Successfully");

        // Open in new tab
        window.open(URL.createObjectURL(pdfBlob));

        onDone?.();
    }


  return (
    <div ref={pdfRef}>
        <div className={style.container}>
            <div className={style.invoiceBox}>
                <div className={style.topHeading}>
                    <h3 className="mb-3">Customer Copy</h3>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="left-part">
                            <p><strong>Invoice No: </strong>{resInvoiceData.master.invoice_no}</p>
                            <p><strong>Patient Name: </strong>{resInvoiceData.master.patient_name}</p>
                            <p><strong>Age: </strong>{resInvoiceData.master.age_year}Y {resInvoiceData.master.age_month}M {resInvoiceData.master.age_day}D</p>
                            <p><strong>Ref.By: </strong>
                                {resInvoiceData.doctorNameById ? `${resInvoiceData.doctorNameById.doctor_name} (BMDC NO: ${resInvoiceData.doctorNameById.bmdc_no})` : resInvoiceData.master.doctor_name}
                            </p>                          
                        </div>
                    </div>
                    <div className="col-6 text-end">
                    <div className="text-end mb-3">
                        {/* Dynamic Barcode */}
                        <svg id="barcode" className={style.barcode} />
                    </div>
                    <p><strong>Date: </strong>{ formatedInvoiceDate}</p>
                    <p><strong>Contact No.:</strong>{resInvoiceData.master.mobile_no}</p>
                    </div>
                </div>
                <table className={`${style.invoiceTable} w-100`}>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Test Name</th>
                            {/* <th>Delivery Instraction</th> */}
                            <th className="text-center">Room No</th>
                            <th className="text-center">Quantity</th>
                            <th className="text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resInvoiceData.details.map((item, index) => (
                        <tr key={item.id || index}>
                            <td>{item.test_info?.test_code || 'N/A'}</td>
                            <td>{item.test_info?.test_name || 'N/A'}</td>
                            {/* <td>9 hours after sample given</td> */}
                            <td className="text-center">{item.test_info?.room_no || ''}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">{item.test_info?.amount * item.quantity || 'N/A'}</td>
                        </tr>                            
                        ))}
                    </tbody>
                </table>
                <div className="row">
                    <div className="col-8">
                    <div className="sub-total-left">
                        <p><strong>Remarks:</strong></p>
                        <p>Delivery Time:<br />All reports will be delivered after 07:00 PM.<br />Sample after 03:00 PM next day.</p>
                        <div className={style.paidBox}><span>Paid</span></div>
                        <p className="mt-3"><strong>In Word:</strong> One thousand eight hundred twenty Taka only.</p>
                        <table className={`${style.subTable} w-100`}>
                            <thead>
                                <tr>
                                    <th>Payment Type</th>
                                    <th>Collect By</th>
                                    <th>Mode</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Initial Collection</td>
                                    <td>Farhad</td>
                                    <td>Card</td>
                                    <td>{resInvoiceData.master.adv_amount || "0.00"}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mt-3"><strong>Prepared By:</strong> MD. FARHAD HOSSEN</p>
                    </div>
                    </div>
                    <div className="col-4">
                        <div className="sub-total-right">
                            <div className={style.summaryRow}>
                                <span>Item Total Tk.</span><span>{resInvoiceData.master.total_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(+) Vat Amt.</span><span>{resInvoiceData.master.vat_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(+) Service Charge.</span><span>{resInvoiceData.master.ser_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(+) Urgent.</span><span>{resInvoiceData.master.urgent_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(-) Discount Tk.</span><span>{resInvoiceData.master.dis_amount || "0.00"}</span>
                            </div>
                            <div className={style.payable}>
                                <span><strong>Gross Total.</strong></span><span><strong>{resInvoiceData.master.gross_total || "0.00"}</strong></span>
                            </div>
                            <div className={style.summaryRow}>
                                 <span>Advance Tk.</span><span>{resInvoiceData.master.adv_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>Due Tk.</span><span>{resInvoiceData.master.due_amount || "0.00"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InvoicePrint