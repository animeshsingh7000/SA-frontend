import { NoData, SideBar } from "../../components";
import noDataImg from "../../assets/images/no-recourd-found.png";
import leaseActive from "../../assets/images/lease-active.svg";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { DEFAULT_OFFSET } from "../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import ReactPaginate from "react-paginate";
import Spinner from "../../components/Spinner";
import { formatCurrency, formatDate, textToNumber } from "../../utils/common";
import { getRentalLeaseDetail, getRentalLeases } from "../../api/rental/rentalInquiry";
import Table from 'react-bootstrap/Table';
import greenIcon from "../../assets/images/green-tick.svg";
import logo from "../../assets/images/attache-logo.svg";
import userIcon from "../../assets/images/User-Fill.svg";


export default function RentalLeaseDetail() {
    const [loader, setLoader] = useState(true);
    const [currentItems, setCurrentItems] = useState<any>({});
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchRentalLeases();
    }, []);

    const fetchRentalLeases = async () => {
        try {
            setLoader(true);
            const res = await getRentalLeaseDetail(params.id);
            setCurrentItems(res.data[0]);
        } catch (error) {
            setLoader(false);
            console.error("Error fetching rental leases:", error);
            // Show an error message to the user (e.g., toast or alert)
        } finally {
            setLoader(false);
        }
    };

    function navigateToDetail(id: any) {
        navigate(ROUTE_NAVIGATION_PATH.RENTAL_INVOICE_DETAIL + '/' + id);
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
                    loader ? (
                        <div className="spinner-wrapper"><Spinner /></div>
                    ) : (
                        <>
                        <div className="lease_invoice_step_1">
                            <div className="container container-fluid _mobgutterspace">
                                <div className="breadcrumb-links">
                                    <ul className="_invoice-ul">
                                        <li>
                                            <Link to={ROUTE_NAVIGATION_PATH.RENTAL_LEASE}>
                                                <span>Lease Invoices </span>
                                            </Link>
                                        </li>
                                        <li>
                                            {currentItems?.propertyDetails?.address ? currentItems?.propertyDetails?.address : 'NA'}
                                        </li>
                                    </ul>
                                </div>

                                <div className="lease-date-content">
                                    <div className="lease-title">
                                        {currentItems?.propertyDetails?.address ? currentItems?.propertyDetails?.address : 'NA'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lease-date-schedule">
                                <div className="container container-fluid">
                                    <div className="lease-col">
                                        <div className="lease-col-title">Lease start Date</div>
                                        <div className="lease-col-para text-capitalize">{currentItems?.leaseStartDate ? formatDate(currentItems.leaseStartDate) : 'NA'}</div>
                                    </div>
                                    <div className="lease-col">
                                        <div className="lease-col-title">Lease End Date</div>
                                        <div className="lease-col-para text-capitalize">{currentItems?.leaseEndDate ? formatDate(currentItems.leaseEndDate) : 'NA'}</div>
                                    </div>
                                    <div className="lease-col">
                                        <div className="lease-col-title">Extension Allowed</div>
                                        <div className="lease-col-para">{currentItems?.extensionAllowed ? 'Yes' : 'No'}</div>
                                    </div>
                                    <div className="lease-col">
                                        <div className="lease-col-title">Daily Rate</div>
                                        <div className="lease-col-para">{currentItems?.ratePerDay ? '$' + currentItems?.ratePerDay : 'NA'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="container container-fluid _mobgutterspace">
                                <div className="lease-payment-content">
                                    <div className="lease-title">Payment Schedule</div>
                                    <div className="lease-subtitle">
                                        Click view details to pay Invoice online
                                    </div>
                                </div>
                            </div>
                            <div className="lease-payment-schedule invoice-dailog-wrapper">
                                <div className="container container-fluid">
                                    <div className="table-section-common rental_table">
                                        {
                                            currentItems.invoices && currentItems.invoices.length > 0 ?
                                                <Table responsive className="">
                                                    <thead>
                                                        <tr>
                                                            <th><div className="th-data">Due Date</div></th>
                                                            <th><div className="th-data">Amount Due </div></th>
                                                            <th><div className="th-data">Status </div></th>
                                                            <th><div className="th-data">View Details And Pay </div></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentItems.invoices.map((data: any, key: any) => (
                                                            <tr>
                                                                <td>{data.dueDate ? formatDate(data.dueDate) : 'NA'}</td>
                                                                <td>{data.totalDue ? formatCurrency(data.totalDue) : '$0'} USD</td>
                                                                <td>
                                                                    {
                                                                        data?.invoiceStatus == 3 ?
                                                                            <>
                                                                                <div className="t-user-icon">
                                                                                    <img src={greenIcon} alt="icon" />
                                                                                </div>
                                                                                <div className="t-user-info">Paid</div>
                                                                            </>
                                                                            :
                                                                            <div>
                                                                                {data?.invoiceStatus == 1 ? 'Issued' : data?.invoiceStatus == 2 ? 'Sent' : data?.invoiceStatus == 4 ? 'Partially Paid' : 'Past Due'}
                                                                            </div>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <a href="" className="view_detail_btn" onClick={(e) => navigateToDetail(data._id)}>View Details</a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                :
                                                <p>No Payment Schedule Available</p>
                                        }
                                    </div>
                                </div>
                            </div>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
}