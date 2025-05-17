import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-final-form";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AuthType } from "../../../types/User";
import { composeValidators, required, requiredSelect } from "../../../validations";
import { FormControl } from "../../../components/FormElements/FormControl";
import { useNavigate, useParams, } from "react-router-dom";
import logo from "../../../assets/images/attache-logo.svg";
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import greenIcon from "../../../assets/images/green-tick.svg";
import userIcon from "../../../assets/images/User-Fill.svg";
import crossIcon from "../../../assets/images/crossx.svg";
import dollarIcon from "../../../assets/images/dollar.svg";
import Table from 'react-bootstrap/Table';
import { addTransaction, impersonateUser, invoiceDetail, lockUnlockTransaction } from "../../../api/admin/lease";
import TransactionType from "../../../components/SearchSelect/TransactionType";
import TransactionCreditType from "../../../components/SearchSelect/TractionCreditType";
import { useCustomMutation } from "../../../hooks/useApi";
import { AxiosError } from "axios";
import { toast } from 'react-toastify';
import { format } from "path/posix";
import { formatDate } from "../../../utils/common";
import { Spinner } from "react-bootstrap";
import { INVOICE_TRANSACTION_STATUS } from "../../../constants";
import moment from "moment";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";

const INTIAL_OFFSET = 10;

const LeaseInvoiceDetail: React.FC = () => {
    const [leaseDetail, setLeaseDetail] = useState<any>({});
    const [initData, setInitData] = useState<any>({
        transactionId: null,
        transactionDate: null,
        transactionType: null,
        ccType: null,
        unitAmount: null,
        feeAmount: null,
        totalAmount: null,

    });

    const params = useParams();
    const [spinner, setSpiner] = useState<any>(false);
    const [loader, setLoader] = useState<any>(true);
    const [isLocked, setIsLocked] = useState(false);
    const navigate = useNavigate();

    const MyComponent = () => {
        const navigate = useNavigate();
    
        useEffect(() => {
            const handleBackButton = () => {
                // Perform any custom logic here
                navigate(-1); // Go back to the previous page
            };
    
            window.onpopstate = handleBackButton;
    
            return () => {
                window.onpopstate = null; // Cleanup to prevent memory leaks
            };
        }, [navigate]);
    
        return <div>My Component</div>;
    };

    useEffect(() => {
        detail();
    }, [])

    const detail = () => {
        invoiceDetail(params.id).then((res: any) => {
            setLeaseDetail(res.data);
            setIsLocked(res?.data?.locked);
            setLoader(false)
        })
    }

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


    const onSubmit = (values: any, form:any) => {
        const data: any = { ...values };
        data.invoiceId = params.id;
        data.transactionDate = data.transactionDate ? moment(data.transactionDate, 'YYYY-MM-DD hh:mm A').format('YYYY-MM-DD HH:mm:ss') : null;

        mutate(data, {
            onSuccess: () => {
                form.restart();
                setInitData({});
            },
        });
    };

    const { mutate } = useCustomMutation({
        mutationFn: (req: any) => {
            setSpiner(true);
            return addTransaction(req);
        },
        onSuccess: async () => {
            setSpiner(false);
            toast.success('Transaction created successfully')
            detail();
        },
        onError: (error: AxiosError<{ message: string; status: number, code: number }>) => {
            setSpiner(false);
        },
    });

    const lockUnlock = () => {
        let locked = !isLocked ? true : false;
        lockUnlockTransaction(params.id, locked).then((res: any) => {
            toast.success('Transaction updated successfully')
            setIsLocked(locked);
        })
    }

    const formatCurrency = (amount: any) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getInvoiceStatusLabel = (status: any) => {
        const statusObj = INVOICE_TRANSACTION_STATUS.find(item => item.value === status);
        return statusObj ? statusObj.label : 'Unknown Status';
    };

    const trimFirstPart = (uuid: any) => {
        return uuid.split("-")[0].trim(); // Extracts and trims only the first part

    };

    const impersonatePayment = (userId:any, invoiceId:any, paymentUser:any) => {
        impersonateUser(userId).then((res: any) => {
            localStorage.setItem("impersonateToken", res.data.impersonatedToken)
            localStorage.setItem("paymentUser", paymentUser);
            localStorage.setItem("isDashboard", '1')
            navigate(ROUTE_NAVIGATION_PATH.RENTAL_INVOICE_DETAIL + '/' + invoiceId);
        })

    }

    return (
        <>
            <div className="invoice-dailog-wrapper scrollbar">
                <div className="invoice-heading-top">
                    <div className="left-data">
                        {/* <img src={closeIcon} alt="close" />  */}
                        Invoice
                    </div>
                    <div className="action-right">
                        {
                            leaseDetail?.invoiceStatus !== 3 && (
                                <button className="btn-locklease" onClick={() => impersonatePayment(leaseDetail?.primaryGuest?.guestId, leaseDetail?._id, leaseDetail?.primaryGuest?.firstName)}>Impersonate And Pay</button>
                            )
                        }
                        <button className="btn-cancel" onClick={lockUnlock}>{!isLocked ? 'Unlock' : 'Lock'}</button>
                        <button className="btn-primary" onClick={handlePrint}>Download PDF</button>
                    </div>
                </div>
                
                {
                    !loader ?
                        <>
                            <div id="printable-content">
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
                                            <div className="invoice-sub">Invoice #{leaseDetail?.invoiceId ? trimFirstPart(leaseDetail?.invoiceId) : 'NA'}</div>
                                            <div className="due-info">
                                                <span>Due</span> {leaseDetail?.dueDate ? leaseDetail?.dueDate : 'NA'}
                                            </div>
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
                                                <div className="_to">To</div>
                                                <div className="user-info-invoice">
                                                    <div className="user">
                                                        <img src={userIcon} alt="" /> {leaseDetail?.lease?.name}
                                                    </div>
                                                    <p>Property: {leaseDetail?.propertyName}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="item-ammount-info">
                                    <div className="left-item">
                                        <div className="grey-bg-heading">
                                            Line Item
                                        </div>
                                        {
                                            leaseDetail?.payments && leaseDetail?.payments.length > 0 ?
                                                <>
                                                    {leaseDetail?.payments.map((data: any, key: any) => (
                                                        <div className="item-info" key={key}>
                                                            {data.message}
                                                        </div>
                                                    ))}
                                                </>

                                                :
                                                null
                                        }
                                    </div>
                                    <div className="_ammount">
                                        <div className="grey-bg-heading _invoice_last_child">
                                            Amount
                                        </div>
                                        {
                                            leaseDetail?.payments && leaseDetail?.payments.length > 0 ?
                                                <>
                                                    {leaseDetail?.payments.map((data: any, key: any) => (
                                                        <div className="item-info _invoice_last_child" key={key}>
                                                            {data.amount ? formatCurrency(data.amount) : '$0'}
                                                        </div>
                                                    ))}
                                                </>
                                                :
                                                null
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
                                <div className="invoice_detail_form common-right-panel-section">
                                    <h3>Payment Details:</h3>
                                    {
                                        leaseDetail?.invoiceTransactions && leaseDetail?.invoiceTransactions.length > 0 ?
                                            <div className="table-section-common">
                                                <Table responsive className="">
                                                    <thead>
                                                        <tr>
                                                            <th><div className="th-data">Payment Date</div></th>
                                                            <th><div className="th-data">Payment Type </div></th>
                                                            <th><div className="th-data">Unit Amount </div></th>
                                                            <th><div className="th-data">PayLease Fee Amount </div></th>
                                                            <th><div className="th-data">Total Amount Paid</div></th>
                                                            <th><div className="th-data">Status </div></th>
                                                            <th><div className="th-data">Transaction ID</div></th>
                                                            <th><div className="th-data">Origin </div></th>
                                                            <th><div className="th-data">Impersonation </div></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {leaseDetail.invoiceTransactions.map((data: any, key: any) => (
                                                            <tr>
                                                                <td>{data.transactionDate ? formatDate(data.transactionDate) : 'NA'} </td>
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
                                                                                    </div> */}
                                                                                    <div className="t-user-info">Success</div>
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
                                                                    <div className="t-user _action _not">
                                                                        <div className="t-user-icon">
                                                                            <img src={crossIcon} alt="icon" />
                                                                        </div>
                                                                        <div className="t-user-info">{data.impersonatedBy ? 'Yes' : 'No'}</div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}

                                                    </tbody>
                                                </Table>
                                            </div>
                                            :
                                            <p>No transactions recorded.</p>
                                    }
                                </div>
                            </div>
                            {
                                leaseDetail?.invoiceStatus != 3 && (
                                    <div className="invoice_detail_form common-right-panel-section">
                                        <div className="invoice_with_form">

                                            <div className="add_transaction_heading">
                                                Add Transaction
                                            </div>
                                            <div className="invoice_form ">
                                                <Form
                                                    initialValues={initData}
                                                    onSubmit={onSubmit}
                                                    render={({ handleSubmit, values, form }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="row">
                                                                <div className="col-12 col-md-6">
                                                                    <FormControl
                                                                        label="Transaction ID"
                                                                        name="transactionId"
                                                                        type="text"
                                                                        validate={composeValidators(required)}
                                                                        onChange={(e: any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                transactionId: e.target.value
                                                                            }));
                                                                        }}
                                                                    />

                                                                </div>
                                                                <div className="col-12 col-md-6 _datepickerform">
                                                                    <DatePickerControl
                                                                        label="Date"
                                                                        name="transactionDate"
                                                                        type={'dateTime'}
                                                                        placeholder="MM-DD-YY"
                                                                        validate={composeValidators(required)}
                                                                        onChange={(date: any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                transactionDate: date
                                                                            }));
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-12 col-md-6 custom-select-form">
                                                                    <div className="text-start form-field">
                                                                        <TransactionType
                                                                            label="Type"
                                                                            name="transactionType"
                                                                            isSearchable
                                                                            validate={composeValidators(requiredSelect)}
                                                                            onChange={(e: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    transactionType: e.value
                                                                                }));

                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-6 custom-select-form">
                                                                    <div className="text-start form-field">
                                                                        <TransactionCreditType
                                                                            label="Credit Card Type"
                                                                            name="ccType"
                                                                            isSearchable
                                                                            onChange={(e: any) => {
                                                                                setInitData((prevState: any) => ({
                                                                                    ...prevState,
                                                                                    ccType: e.value
                                                                                }));
                                                                            }}
                                                                        />

                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-6 _dollar">
                                                                    <FormControl
                                                                        label="Unit Amount"
                                                                        name="unitAmount"
                                                                        type="input-decimal"
                                                                        onChange={(e: any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                unitAmount: e.target.value,
                                                                                totalAmount: Number(e.target.value) + (initData.feeAmount ? Number(initData.feeAmount) : 0)
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <div className="dollarIcon">
                                                                        <img src={dollarIcon} alt="Dollar" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-6 _dollar">
                                                                    <FormControl
                                                                        label="Fee Amount"
                                                                        name="feeAmount"
                                                                        type="input-decimal"
                                                                        onChange={(e: any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                feeAmount: e.target.value,
                                                                                totalAmount: Number(e.target.value) + (initData.unitAmount? Number(initData.unitAmount) : 0)
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <div className="dollarIcon">
                                                                        <img src={dollarIcon} alt="Dollar" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-6 _dollar">
                                                                    <FormControl
                                                                        label="Total Paid"
                                                                        name="totalAmount"
                                                                        type="input-decimal"
                                                                        onChange={(e: any) => {
                                                                            setInitData((prevState: any) => ({
                                                                                ...prevState,
                                                                                totalAmount: e.target.value
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <div className="dollarIcon">
                                                                        <img src={dollarIcon} alt="Dollar" />
                                                                    </div>
                                                                </div>


                                                            </div>
                                                            <div className="invoice_submit_btn">
                                                                <button type="submit" className="btn primary"> Create New Transaction</button>
                                                            </div>
                                                        </form>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <>
                                            {spinner ? <div className="spinner-wrapper"><Spinner /></div> : null}
                                        </>

                                    </div>

                                )
                            }

                        </>
                        :
                        <div className="spinner-wrapper"><Spinner /></div>
                }
            </div>
        </>
    );
};

export default LeaseInvoiceDetail;
