import React, { useEffect, useRef } from 'react'
import html2pdf from "html2pdf.js";
import style from "../../assets/css/myStyleCss/invoicePrint.module.css"
import paidSeal from "../../assets/images/InvoicePaidDues/Seal_paid_1.png"
import dueSeal from "../../assets/images/InvoicePaidDues/Seal_due.png"
import JsBarcode from 'jsbarcode';
import { format } from "date-fns";
import { ToWords } from "to-words"; //npm install to-words

function InvoicePrint({invoiceData, onDone, actionType}) {
    // console.log("PrintAllData", invoiceData)
    const pdfRef = useRef();
    const hasGeneratedRef = useRef(false); //for dublle click
    const preparedBy = localStorage.getItem('full_name') || 'N/A'; 

    if (!invoiceData) return null;

    //Invoice Date formet
    const originalDate = invoiceData.master.invoice_date;
    const formatedInvoiceDate = format(new Date(originalDate), "yyyy-MM-dd hh:mm a")

    //-----Gross Total inWord Start------
        const toWords = new ToWords({
            localeCode: 'en-BD', // Bangladesh
            converterOptions: {
                currency: true,
                ignoreDecimal: false,
                doNotAddOnly: false,
            },
        });
        
        const grossTotalWord = toWords.convert(
            Number(invoiceData.master.gross_total || 0)
        );
    //-------Gross Total inWord End--------

    //--------Adv & total Collection Amount Start -----------
    const totalDuesAmountCollection = invoiceData?.moneyReceipt?.reduce(
        (sum, item) => sum + Number(item?.mr_amount || 0),
        0
    ) || 0;

    const presentDuesAmount = invoiceData.master?.gross_total - totalDuesAmountCollection;
    //--------Adv & total Collection Amount End -----------


    //---------------Pdf Genarete Start------------
    const generatePdf  = async () => {
        const element = pdfRef.current; //this part for Pdf

        const pdfOptions = {
            margin: 0.4,
            filename: `Invoice_${invoiceData.master.invoice_no}.pdf`,
            image: {type: "jpeg", quantity: 1},
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        }

        if(actionType === "print") {
            const worker = html2pdf().set(pdfOptions).from(element);
            const pdfBlob = await worker.outputPdf("blob");
            const url = URL.createObjectURL(pdfBlob);
            
            const printWindow = window.open(url);
              printWindow.onload = () => {
              printWindow.print(); // Open Pdf Print Page
            };
        } else {
          //Pdf Download and New Tab Open
          const worker = html2pdf().set(pdfOptions).from(element)
          const pdfBlob = await worker.outputPdf("blob");  //Generate PDF Blob
  
          worker.save(); // Auto Download
          // console.log("Pdf Create Successfully");
  
          window.open(URL.createObjectURL(pdfBlob)); // Open in new tab
        }


        onDone?.();
    }
    //---------------Pdf Genarete End------------

    //---------Triger Pdf & Barcode Start-------------
      useEffect(()=> {

        if(!invoiceData || hasGeneratedRef.current) return;
        hasGeneratedRef.current = true; //for duble click

        // Ensure DOM loaded before generating barcode + pdf
        setTimeout(() => {
          const barcodeOptions = {
              format: "code128",
              width: 2,
              height: 60,
              displayValue: false
          }
          JsBarcode(".barcode-customer", `*${invoiceData.master.invoice_no}*`, barcodeOptions);
          JsBarcode(".barcode-ofice", `*${invoiceData.master.invoice_no}*`, barcodeOptions);

          generatePdf ();

        }, 300)

      }, [invoiceData]);
    //---------Triger Pdf & Barcode End-------------


    //------------Main Part For Render 2 Copy Start---------------
        const RenderInvoice = ({type, barcodeClass}) => (
            <div className={style.invoiceBox}>
                <div className={style.topHeading}>
                    <h3 className="mb-3">{type}</h3>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="left-part">
                            <p><strong>Invoice No: </strong>{invoiceData.master.invoice_no}</p>
                            <p><strong>Patient Name: </strong>{invoiceData.master.patient_name}</p>
                            <p><strong>Age: </strong>{invoiceData.master.age_year}Y {invoiceData.master.age_month}M {invoiceData.master.age_day}D</p>
                            <p><strong>Ref.By: </strong>
                                {invoiceData.doctorNameById ? `${invoiceData.doctorNameById.doctor_name} (BMDC NO: ${invoiceData.doctorNameById.bmdc_no})` : invoiceData.master.doctor_name}
                            </p>                          
                        </div>
                    </div>
                    <div className="col-6 text-end">
                    <div className="text-end mb-3">
                        {/* Dynamic Barcode */}
                        <svg className={`${style.barcode} ${barcodeClass}`} />
                    </div>
                    <p><strong>Date: </strong>{ formatedInvoiceDate}</p>
                    <p><strong>Contact No.:</strong>{invoiceData.master.mobile_no}</p>
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
                        {invoiceData.details.map((item, index) => (
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
                        <div className={style.paidBox}>{presentDuesAmount > 0 ? (
                            <img src={dueSeal} className={style.watermarkImage} alt="Due" />
                        ) : (
                            <img src={paidSeal} className={style.watermarkImage} alt="Full Paid" />
                        )}</div>
                        <p className="mt-3"><strong>In Word:</strong> {grossTotalWord}</p>
                        <table className={`${style.subTable} w-100`}>
                            <thead className='text-center'>
                                <tr>
                                    <th>Payment Type</th>
                                    <th>Collect By</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceData?.moneyReceipt.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td className='text-center'>{item?.activity_type?.lookup_value}</td>
                                        <td>{preparedBy}</td>
                                        <td className='text-end'>{item.mr_amount || "0.00"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="mt-3"><strong>Prepared By:</strong> {preparedBy}</p>
                    </div>
                    </div>
                    <div className="col-4">
                        <div className="sub-total-right">
                            <div className={style.summaryRow}>
                                <span>Item Total Tk.</span><span>{invoiceData.master.total_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(+) Vat Amt.</span><span>{invoiceData.master.vat_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(+) Service Charge.</span><span>{invoiceData.master.ser_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(+) Urgent.</span><span>{invoiceData.master.urgent_amount || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>(-) Discount Tk.</span><span>{invoiceData.master.dis_amount || "0.00"}</span>
                            </div>
                            <div className={style.payable}>
                                <span><strong>Gross Total.</strong></span><span><strong>{invoiceData.master.gross_total || "0.00"}</strong></span>
                            </div>
                            <div className={style.summaryRow}>
                                 <span>Advance Tk.</span><span>{totalDuesAmountCollection || "0.00"}</span>
                            </div>
                            <div className={style.summaryRow}>
                                <span>Due Tk.</span><span>{presentDuesAmount || "0.00"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    //------------Main Part For Render 2 Copy End-----------------


  return (
    <div style={{ display: 'none' }}>
      <div ref={pdfRef}>
        <div className={style.container}>
            
            <RenderInvoice type="Customer Copy" barcodeClass="barcode-customer"/>

            <div className={style.pageBreak}></div>  

            <RenderInvoice type="Office Copy" barcodeClass="barcode-ofice"/>

        </div>
      </div>
    </div>
  )
}

export default InvoicePrint;