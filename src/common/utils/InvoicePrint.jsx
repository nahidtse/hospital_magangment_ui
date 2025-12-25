// ==================== InvoicePrint.jsx ====================
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import html2pdf from "html2pdf.js";
import style from "../../assets/css/myStyleCss/invoicePrint.module.css";
import paidSeal from "../../assets/images/InvoicePaidDues/Seal_paid_1.png";
import dueSeal from "../../assets/images/InvoicePaidDues/Seal_due.png";
import JsBarcode from "jsbarcode";
import { format, parseISO } from "date-fns";
import { ToWords } from "to-words";

const InvoicePrint = forwardRef(({ resInvoiceData }, ref) => {
  const pdfRef = useRef();

  console.log(resInvoiceData)

  if (!resInvoiceData) return null; // safeguard

  const master = resInvoiceData; // direct use due object
  const originalDate = master.invoice_date;
  const formatedInvoiceDate = originalDate
    ? format(parseISO(originalDate), "yyyy-MM-dd hh:mm a")
    : "";

  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: { currency: true, ignoreDecimal: false, doNotAddOnly: false },
  });

  const grossTotalWord = toWords.convert(Number(master.gross_total || 0));

  const totalDuesAmountCollection =
    master?.money_receipt?.reduce((sum, item) => sum + Number(item?.mr_amount || 0), 0) || 0;

  const presentDuesAmount = Number(master.gross_total || 0) - totalDuesAmountCollection;

  // Generate barcode safely
  useEffect(() => {
    if (!master.invoice_no) return;
    const options = { format: "code128", width: 2, height: 60, displayValue: false };
    JsBarcode(".barcode-customer", master.invoice_no, options);
    JsBarcode(".barcode-ofice", master.invoice_no, options);
  }, [master]);

  // PDF actions
  const getOptions = () => ({
    margin: 0.4,
    filename: `Invoice_${master.invoice_no}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  });

  const downloadPdf = async () => {
    if (!pdfRef.current) return;
    await html2pdf().set(getOptions()).from(pdfRef.current).save();
  };

  const printPdf = async () => {
    if (!pdfRef.current) return;
    const worker = html2pdf().set(getOptions()).from(pdfRef.current);
    const blob = await worker.outputPdf("blob");
    const url = URL.createObjectURL(blob);
    const win = window.open(url);
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  useImperativeHandle(ref, () => ({ downloadPdf, printPdf }));

  // Invoice render
  const RenderInvoice = ({ type, barcodeClass }) => (
    <div className={style.invoiceBox}>
      <div className={style.topHeading}><h3 className="mb-3">{type}</h3></div>

      <div className="row">
        <div className="col-6">
          <div className="left-part">
            <p><strong>Invoice No:</strong> {master.invoice_no}</p>
            <p><strong>Patient Name:</strong> {master.patient_name}</p>
            <p><strong>Age:</strong> {master.age_year}Y {master.age_month}M {master.age_day}D</p>
            <p><strong>Ref.By:</strong> {master.doctor_name || "N/A"}</p>
          </div>
        </div>
        <div className="col-6 text-end">
          <div className="text-end mb-3">
            <svg className={`${style.barcode} ${barcodeClass}`} />
          </div>
          <p><strong>Date:</strong> {formatedInvoiceDate}</p>
          <p><strong>Contact No:</strong> {master.mobile_no}</p>
        </div>
      </div>

      <table className={`${style.invoiceTable} w-100`}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Test Name</th>
            <th className="text-center">Room No</th>
            <th className="text-center">Quantity</th>
            <th className="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          {master.invoice_details?.map((item, idx) => (
            <tr key={item.id || idx}>
              <td>{item.test_info?.test_code || "N/A"}</td>
              <td>{item.test_info?.test_name || "N/A"}</td>
              <td className="text-center">{item.test_info?.room_no || ""}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-end">{(item.test_info?.amount || 0) * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment & Summary */}
      <div className="row">
        <div className="col-8">
          <div className={style.subTotalLeft}>
            <p><strong>Remarks:</strong></p>
            <p>Delivery Time: Reports after 07:00 PM. Sample after 03:00 PM next day.</p>
            <div className={style.paidBox}>
              <img src={presentDuesAmount > 0 ? dueSeal : paidSeal} className={style.watermarkImage} alt="Status" />
            </div>
            <p className="mt-3"><strong>In Words:</strong> {grossTotalWord}</p>
            <table className={`${style.subTable} w-100`}>
              <thead>
                <tr>
                  <th>Payment Type</th>
                  <th>Collect By</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {master.money_receipt?.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{item.activity_type?.lookup_value || "N/A"}</td>
                    <td>Farhad</td>
                    <td>{item.mr_amount || "0.00"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3"><strong>Prepared By:</strong> MD. FARHAD HOSSEN</p>
          </div>
        </div>
        <div className="col-4">
          <div className={style.subTotalRight}>
            <div className={style.summaryRow}><span>Item Total Tk.</span><span>{master.total_amount || "0.00"}</span></div>
            <div className={style.summaryRow}><span>(+) Vat Amt.</span><span>{master.vat_amount || "0.00"}</span></div>
            <div className={style.summaryRow}><span>(+) Service Charge.</span><span>{master.ser_amount || "0.00"}</span></div>
            <div className={style.summaryRow}><span>(+) Urgent.</span><span>{master.urgent_amount || "0.00"}</span></div>
            <div className={style.summaryRow}><span>(-) Discount Tk.</span><span>{master.dis_amount || "0.00"}</span></div>
            <div className={style.payable}><span><strong>Gross Total.</strong></span><span><strong>{master.gross_total || "0.00"}</strong></span></div>
            <div className={style.summaryRow}><span>Advance Tk.</span><span>{totalDuesAmountCollection}</span></div>
            <div className={style.summaryRow}><span>Due Tk.</span><span>{presentDuesAmount}</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={pdfRef}>
      <RenderInvoice type="Customer Copy" barcodeClass="barcode-customer" />
      <div className={style.pageBreak}></div>
      <RenderInvoice type="Office Copy" barcodeClass="barcode-ofice" />
    </div>
  );
});

export default InvoicePrint;
