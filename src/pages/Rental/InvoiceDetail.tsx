
import leaseActive from "../../assets/images/lease-active.svg";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { formatCurrency, formatDate } from "../../utils/common";
import { getItemizedInvoiceDetail, getRentalInvoiceDetail } from "../../api/rental/rentalInquiry";
import Table from 'react-bootstrap/Table';
import greenIcon from "../../assets/images/green-tick.svg";
import logo from "../../assets/images/attache-logo.svg";
import userIcon from "../../assets/images/User-Fill.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { INVOICE_TRANSACTION_STATUS } from "../../constants";
import { Field, Form } from "react-final-form";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../hooks/useAuth";
import SendEmailModel from "../../components/Modal/SendEmailModel";
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

// Fix "Cannot read properties of undefined (reading 'vfs')"
(pdfMake as any).vfs = pdfFonts.pdfMake?.vfs || pdfFonts?.vfs;


export default function InvoiceDetail() {
    const [loader, setLoader] = useState(true);
    const [leaseDetail, setLeaseDetail] = useState<any>({});
    const [itemizedDetail, setItemizedDetail] = useState<any>({});
    const [pdfData, setPdfData] = useState()
    const params = useParams();
    const [toggle, setToggle] = useState<any>(true);
    const auth = useAuth();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchRentalLeases();
        fetchItemizedInvoiceDetail();
    }, []);

    const fetchRentalLeases = async () => {
        try {
            setLoader(true);
            const res = await getRentalInvoiceDetail(params.id);
            setLeaseDetail(res.data);
        } catch (error) {
            setLoader(false);
            console.error("Error fetching rental leases:", error);
            // Show an error message to the user (e.g., toast or alert)
        } finally {
            setLoader(false);
        }
    };

    const fetchItemizedInvoiceDetail = async () => {
        try {
            const res = await getItemizedInvoiceDetail(params.id);
            setItemizedDetail(res.data);            
            
        } catch (error) {
            setLoader(false);
            console.error("Error fetching rental leases:", error);
            // Show an error message to the user (e.g., toast or alert)
        } finally {
            setLoader(false);
        }
    };

    const handlePrint = () => {
        const content = document.getElementById("printable-content");
        if (!content) return;

        // Create an iframe for printing
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;

        // Write content to iframe
        doc.open();
        doc.write(`
            <html>
            <head>
                <title>Print Invoice</title>
                <style>
                    @media print {
                        body { font-family: Arial, sans-serif; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .invoice-info-panel { margin-bottom: 20px; }
                        .invoice_top_header { display: flex; justify-content: space-between; align-items: center; }
                        .attache_logo img { width: 150px; }
                        .invoice-paid_info { text-align: right; }
                        .invoice-address-info { display: flex; justify-content: space-between; margin-top: 20px; }
                        .item-ammount-info, .item-ammount-total-info { display: flex; justify-content: space-between; margin-top: 20px; }
                        ._ammount { text-align: right; }
                        .table-section-common { margin-top: 20px; }
                        .t-user-icon img { width: 20px; }
                        .invoice_submit_btn { display: none;}
                    }
                </style>
            </head>
            <body>
                ${content.outerHTML}
                <script>
                    window.onload = () => {
                        window.print();
                        setTimeout(() => window.parent.document.body.removeChild(window.frameElement), 500);
                    };
                </script>
            </body>
            </html>
        `);
        doc.close();
    };


      
    const handleDownloadPDF = () => {
        const content = document.getElementById("printable-content");
        if (!content) return;
    
        html2canvas(content, {
            scale: 2,
            ignoreElements: (element) => element.classList.contains("invoice_submit_btn")
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
    
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
            // Convert to Blob and Open in New Tab
            const pdfBlob = pdf.output("blob");
            const blobUrl = URL.createObjectURL(pdfBlob);
    
            // Open the PDF in a new tab
            window.open(blobUrl, "_blank");
        });
    }; 

    const getInvoiceStatusLabel = (status: any) => {
        const statusObj = INVOICE_TRANSACTION_STATUS.find(item => item.value === status);
        return statusObj ? statusObj.label : 'Unknown Status';
    };

    function generateStyledPDF(data:any) {
        const docDefinition = {
            content: [
                {
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [{
                                text: 'Transaction Details',
                                bold: true,
                                fontSize: 12,
                                margin: [10, 10, 10, 10],
                                colSpan: 2,
                                border: [true, true, true, true]
                            }, {}],
    
                            [{ text: 'Transaction #', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: data.transactionId, fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Transaction Status', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: getInvoiceStatusLabel(String(data.status)), fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Resident Name', bold: false,fontSize: 10,  border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: leaseDetail?.lease?.name || 'N/A', fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Payment Made By', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: (leaseDetail?.paymentDoneBy?.firstName + ' ' + leaseDetail?.paymentDoneBy?.lastName) || 'N/A', fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Transaction Date', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: data.transactionDate ? formatDate(data.transactionDate) : 'N/A', fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
    
                            // Payment Amount with details stacked on the right
                            [
                                { text: 'Payment Amount', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] },
                                {
                                    stack: [
                                        { text: `Amount Owed:  ${data.unitAmount ? formatCurrency(data.unitAmount) : '$0.00'}`, fontSize: 10, alignment: 'right', bold: false, margin: [10, 5, 10, 5] },
                                        { text: `Processing Fee:  ${data.feeAmount ? formatCurrency(data.feeAmount) : '$0.00'}`, fontSize: 10, alignment: 'right', bold: false, margin: [10, 5, 10, 5] },
                                        { text: `Total:  ${data.totalAmount ? formatCurrency(data.totalAmount) : '$0.00'}`, fontSize: 10, alignment: 'right', bold: false, margin: [10, 5, 10, 5] }
                                    ],
                                    border: [false, true, true, true]
                                }
                            ],
    
                            [{ text: 'Payment Account', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: data.transactionType, fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Property', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: leaseDetail.propertyName || 'NA', fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Unit', bold: false, fontSize: 10, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: leaseDetail.unitNumber, alignment: 'right', fontSize: 10, border: [false, true, true, true], margin: [10, 10, 10, 10] }],
                            [{ text: 'Property Management Co', fontSize: 10, bold: false, border: [true, true, false, true], margin: [10, 10, 10, 10] }, { text: 'Attache Property Management, LLC', fontSize: 10, alignment: 'right', border: [false, true, true, true], margin: [10, 10, 10, 10] }]
                        ]
                    },
                    layout: {
                        defaultBorder: false,
                        hLineWidth: function (i:any, node:any) {
                            return 0.5;
                        },
                        vLineWidth: function (i:any, node:any) {
                            return 0.5;
                        },
                        hLineColor: function (i:any, node:any) {
                            return '#cccccc';
                        },
                        vLineColor: function (i:any, node:any) {
                            return '#cccccc';
                        }
                    }
                }
            ]
        };
        pdfMake.createPdf(docDefinition).open();
    }
    
    const handleGeneratePDF = (event: React.FormEvent, data: any) => {
        event.preventDefault(); // Stop form from refreshing the page
        generateStyledPDF(data); // Call your function
    };

    const trimFirstPart = (uuid: any) => {
        return uuid.split("-")[0].trim(); // Extracts and trims only the first part

    };

    const payInvoice = (url:any) => {
        let param = new URL(url).searchParams;
    
        localStorage.setItem("amount", param.get("amount") ? param.get("amount") : leaseDetail.totalDue);
        localStorage.setItem("propertyId", param.get("property_id") ? param.get("property_id") : leaseDetail.unitId);
        localStorage.setItem("resident_id", param.get("resident_id") ? param.get("resident_id") : leaseDetail.primaryGuest.guestId);
        localStorage.setItem("hmac", param.get("hmac") ? param.get("hmac") : leaseDetail.primaryGuest.guestId);
        localStorage.setItem("ipnCustom", param.get("ipnCustom") || '');
        localStorage.setItem("impersonatedBy", auth.user._id ? auth.user._id : '')
    
        window.open(url, '_blank');
    }



    return (
        <>
            <div className="right-container">
                <div className="breadcrumb-module breadcrumb-image-module lease-dashboard-breadcrumb-module">
                    <div className="container">
                        <div className="breadcrumb-row flex-row">
                            <div className="breadcrumb-icon mt-1">
                                <img src={leaseActive} alt="Lease Icon" />
                            </div>
                            <div className="breadcrumb-content">
                                <h4>Lease Invoices</h4>
                                <p className="ft-16">You can see all Leased Invoices here!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    loader ?
                        <div className="spinner-wrapper"><Spinner /></div>
                        :
                        <div className="lease_invoice_step_2 _rental_lease_invoice_step_2">
                            <div className="container container-fluid _mobgutterspace">
                                <div className="breadcrumb-links">
                                    <ul className="_invoice-ul">
                                        <li>
                                            <Link to={ROUTE_NAVIGATION_PATH.RENTAL_LEASE}>
                                                <span>Lease Invoices </span>
                                            </Link>
                                        </li>
                                        <li>
                                            {leaseDetail?.propertyName ? leaseDetail?.propertyName : 'NA'}
                                        </li>
                                    </ul>
                                    <Form
                                        onSubmit={(values) => console.log("")}
                                        render={({ handleSubmit }) => (
                                            <form onSubmit={handleSubmit}>
                                                <Field name="status" type="checkbox">
                                                    {({ input }) => (
                                                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>

                                                            {/* Custom Toggle Switch */}
                                                            <div className="toggle-container" style={{ position: 'relative' }}>
                                                                <input
                                                                    {...input}
                                                                    type="checkbox"
                                                                    id="toggleSwitch"
                                                                    style={{ display: "none" }} // Hide default checkbox
                                                                    checked={toggle} // Use 'checked' instead of 'value'
                                                                    onChange={(e) => {
                                                                        const checked = e.target.checked;
                                                                        setToggle(checked);
                                                                }}
                                                                // Hide default checkbox
                                                                />
                                                                {/* Label acting as the toggle switch */}
                                                                <label
                                                                    htmlFor="toggleSwitch"
                                                                    style={{
                                                                        display: 'inline-block',
                                                                        width: '50px',
                                                                        height: '24px',
                                                                        backgroundColor: toggle ? '#4CAF50' : '#ccc',
                                                                        borderRadius: '50px',
                                                                        position: 'relative',
                                                                        cursor: 'pointer',
                                                                        transition: 'background-color 0.3s',
                                                                    }}
                                                                >
                                                                    {/* Circle inside the toggle */}
                                                                    <span
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '2px',
                                                                            left: toggle ? '26px' : '2px',
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            backgroundColor: 'white',
                                                                            borderRadius: '50%',
                                                                            transition: 'left 0.3s',
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>

                                                            <label className="form-label" style={{ marginLeft: '10px', marginBottom: '4px' }}>{toggle == true ? ' Summary Invoice' : ' Itemized Invoice'}</label>

                                                        </div>
                                                    )}
                                                </Field>
                                            </form>
                                        )}
                                    />
                                </div>
                            </div>
                            <div id="printable-content">
                                <div className="lease-date-schedule">
                                    <div className="container container-fluid">
                                        <div className="invoice-dailog-wrapper">
                                            <div className="invoice-info-panel">
                                                <div className="invoice_top_header">
                                                    <div className="attache_logo">
                                                        <img src={logo} alt="Attached" />
                                                    </div>
                                                    <div className="invoice-paid_info">
                                                        {
                                                            leaseDetail?.invoiceStatus == 3 ?
                                                                <div className="invoice-heading">INVOICE PAID</div>

                                                                :
                                                                <div className="invoice-heading-unPaid">
                                                                    INVOICE {leaseDetail?.invoiceStatus == 1 ? 'ISSUED' : leaseDetail?.invoiceStatus == 2 ? 'SENT' : leaseDetail?.invoiceStatus == 4 ? 'PARTIALLY PAID' : 'PAST DUE'}
                                                                </div>

                                                        }
                                                        <div className="due-info">
                                                            <span>Due</span> {leaseDetail?.dueDate ? formatDate(leaseDetail?.dueDate) : 'NA'}
                                                        </div>
                                                        <div className="invoice-sub">Invoice #{leaseDetail?._id ? trimFirstPart(leaseDetail?.invoiceId) : 'NA'}</div>

                                                    </div>
                                                </div>
                                                <div className="invoice-address-info">
                                                    <div className="address">
                                                        <div className="hd-txt"> Attaché Corporate Housing, LLC</div>
                                                        <p>1800 R Street NW Suite C1</p>
                                                        <p>Washington, DC 20009</p>
                                                        <p>P: 800-916-4903</p>
                                                    </div>
                                                    <div className="to-pro">
                                                        <div className="">
                                                            
                                                            <div className="user-info-invoice">
                                                                <div className="_totxt">
                                                                <p className="_to">To:</p>
                                                                    {/* <img src={userIcon} alt="" />  */}
                                                                    {leaseDetail?.lease?.name ? leaseDetail?.lease?.name : 'NA'}
                                                                </div>
                                                                <p><span>Property:</span>  {leaseDetail?.propertyName ? leaseDetail?.propertyName : 'NA'}</p>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="lease-date-schedule">
                                    <div className="container container-fluid">
                                        <div className="invoice-dailog-wrapper">
                                            <div className="item-ammount-info">
                                                <div className="left-item">
                                                    <div className="grey-bg-heading">
                                                        Line Item
                                                    </div>
                                                    {
                                                        toggle ?

                                                        (leaseDetail?.payments && leaseDetail?.payments.length > 0 ?
                                                            <>
                                                                {leaseDetail?.payments.map((data: any, key: any) => (
                                                                    <div className="item-info" key={key}>
                                                                        {data.message}
                                                                    </div>
                                                                ))}
                                                            </>

                                                            :
                                                            null)
                                                        :
                                                        
                                                        (itemizedDetail?.payments && itemizedDetail?.payments.length > 0 ?
                                                            <>
                                                                {itemizedDetail?.payments.map((data: any, key: any) => (
                                                                    <div className="item-info" key={key}>
                                                                        {data.message}
                                                                    </div>
                                                                ))}
                                                            </>

                                                            :
                                                            null)
                                                        
                                                    }
                                                </div>
                                                <div className="_ammount">
                                                    <div className="grey-bg-heading _invoice_last_child">
                                                        Amount Due
                                                    </div>
                                                    {
                                                        toggle ?
                                                        (leaseDetail?.payments && leaseDetail?.payments.length > 0 ?
                                                            <>
                                                                {leaseDetail?.payments.map((data: any, key: any) => (
                                                                    <div className="item-info _invoice_last_child" key={key}>
                                                                        {data.amount ? formatCurrency(data.amount) : '$0'}
                                                                    </div>
                                                                ))}
                                                            </>
                                                            :
                                                            null)
                                                        :
                                                        (
                                                            itemizedDetail?.payments && itemizedDetail?.payments.length > 0 ?
                                                            <>
                                                                {itemizedDetail?.payments.map((data: any, key: any) => (
                                                                    <div className="item-info _invoice_last_child" key={key}>
                                                                        {data.amount ? formatCurrency(data.amount) : '$0'}
                                                                    </div>
                                                                ))}
                                                            </>
                                                            :
                                                            null
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className="item-ammount-total-info">
                                                <div className="left-item">
                                                    <div className="item-info">
                                                        Subtotal
                                                    </div>
                                                    <div className="item-info">
                                                        Total Due
                                                    </div>
                                                    <div className="item-info">
                                                        Amount Received
                                                    </div>
                                                    <div className="item-info">
                                                        Balance Due
                                                    </div>
                                                </div>
                                                <div className="_ammount">
                                                    <div className="item-info">
                                                        {leaseDetail?.totalDue || leaseDetail?.totalDue == 0 ? formatCurrency(leaseDetail?.totalDue) : '$0'}
                                                    </div>
                                                    <div className="item-info">
                                                        {leaseDetail?.totalDue || leaseDetail?.totalDue == 0 ? formatCurrency(leaseDetail?.totalDue) : '0'}
                                                    </div>
                                                    <div className="item-info">
                                                        {leaseDetail?.totalUnitAmount || leaseDetail?.totalUnitAmount == 0 ? formatCurrency(leaseDetail?.totalUnitAmount) : '$0'}
                                                    </div>
                                                    <div className="item-info">
                                                        {leaseDetail?.balanceDue || leaseDetail?.balanceDue == 0 ? formatCurrency(leaseDetail?.balanceDue) : '$0'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="lease-date-schedule">
                                    <div className="container container-fluid">
                                        <div className="invoice-dailog-wrapper">
                                            <div className="invoice_submit_btn">
                                                <button className="btn primary" onClick={(e:any) => setShowDialog(true)}>send email</button>
                                                <button className="btn primary" onClick={handleDownloadPDF}>download invoice</button>
                                                <button className="btn primary" onClick={handlePrint}>print invoice</button>

                                                {leaseDetail?.invoiceStatus != 3 && (
                                                    
                                                        localStorage.getItem("impersonateToken") ?
                                                            <button className="btn primary" onClick={() => payInvoice(leaseDetail?.payInvoiceUrl)}>pay invoice</button>
                                                        :
                                                        leaseDetail?.guestDetails?.payInvoice ?
                                                            <button className="btn primary" onClick={() => payInvoice(leaseDetail?.payInvoiceUrl)}>pay invoice</button>
                                                        :
                                                        null
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container container-fluid _mobgutterspace">
                                    <div className="lease-payment-content">
                                        <div className="lease-title">Payment Details:</div>
                                    </div>
                                </div>
                                <div className="lease-payment-schedule invoice-dailog-wrapper">
                                    <div className="container container-fluid">
                                        <div className="table-section-common rental_table">
                                            {

                                                leaseDetail?.invoiceTransactions && leaseDetail?.invoiceTransactions.length > 0 ?

                                                    <Table responsive className="">
                                                        <thead>
                                                            <tr>
                                                                <th><div className="th-data">Payment Date</div></th>
                                                                <th><div className="th-data">Payment Type</div></th>
                                                                <th><div className="th-data">Unit Amount </div></th>
                                                                <th><div className="th-data">Payment Fee Amount</div></th>
                                                                <th><div className="th-data">Total Amount paid</div></th>
                                                                <th><div className="th-data">Status</div></th>

                                                                <th><div className="th-data">Transation Id</div></th>
                                                                <th><div className="th-data">Origin</div></th>
                                                                <th><div className="th-data">payment receipt</div></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {leaseDetail.invoiceTransactions.map((data: any, key: any) => (
                                                                <tr>
                                                                    <td>{data.transactionDate ? formatDate(data.transactionDate) : 'NA'}</td>
                                                                    <td>{data.transactionType}</td>
                                                                    <td>{data.unitAmount ? formatCurrency(data.unitAmount) : 0} </td>
                                                                    <td>{data.feeAmount ? formatCurrency(data.feeAmount) : 0} </td>
                                                                    <td>{data.totalAmount ? formatCurrency(data.totalAmount) : 0} </td>
                                                                    <td>
                                                                        <div className="t-user _action">
                                                                            {
                                                                                data.status == '1' ?
                                                                                    <>
                                                                                        {/* <div className="t-user-icon">
                                                                                            <img src={greenIcon} alt="icon" />
                                                                                        </div>
                                                                                        <div className="t-user-info">Success</div> */}
                                                                                        Success
                                                                                    </>
                                                                                    :
                                                                                    (
                                                                                        <div className="">{getInvoiceStatusLabel(data.status)}</div>
                                                                                    )
                                                                            }

                                                                        </div>
                                                                    </td>
                                                                    <td>{data.transactionId} </td>
                                                                    <td>
                                                                        {data.origination == '2' ? 'Manual' : 'Paylease'}
                                                                    </td>


                                                                    <td>
                                                                        <a href="" className="view_detail_btn" onClick={(e: any) => handleGeneratePDF(e, data)}>Download</a>
                                                                    </td>




                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </Table>

                                                    :
                                                    <div>No transactions recorded.</div>

                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                }
            </div>
            {showDialog ? (
                <SendEmailModel
                    show={showDialog}
                    invoiceId={params.id || ''}
                    handleClose={() => setShowDialog(false)}
                />
            ) : null}
        </>
    );
}
