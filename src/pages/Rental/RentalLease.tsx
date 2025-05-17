import { NoData } from "../../components";
import leaseActive from "../../assets/images/lease-active.svg";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_OFFSET } from "../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import ReactPaginate from "react-paginate";
import Spinner from "../../components/Spinner";
import { formatDate, isArrayHas, textToNumber } from "../../utils/common";
import { getRentalLeases } from "../../api/rental/rentalInquiry";
import placeHolder from "../../assets/images/ph400x500.png";
import moment from "moment";


export default function RentalLease() {
    const auth = useAuth();

    const { pathname } = useLocation();
    const [currentItems, setCurrentItems] = useState([]);
    const [loader, setLoader] = useState(true);
    const [pageNo, setPageNo] = useState(1);
    const [totalLeases, setTotalLeases] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const data = {
            page: pageNo,
            count: DEFAULT_OFFSET
        };

        fetchRentalLeases(data);
    }, [pageNo]);

    const fetchRentalLeases = async (data: any) => {
        try {
            setLoader(true);
            const res = await getRentalLeases(data);
            setTotalLeases(res.totalLeases);
            setCurrentItems(res.data);
        } catch (error) {
            setLoader(false);
            console.error("Error fetching rental leases:", error);
            // Show an error message to the user (e.g., toast or alert)
        } finally {
            setLoader(false);
        }
    };

    const pageCount = Math.ceil(totalLeases / DEFAULT_OFFSET);

    const handlePageClick = (event: any) => {

        setPageNo(event.selected + 1);
    };

    function routeToDetail(unitId: any, detail: any) {
        // localStorage.setItem("leaseDetail", JSON.stringify({
        //   address: detail?.CurrentTenants[0]?.Address?.AddressLine1 + " " +( detail?.CurrentTenants[0]?.Address?.AddressLine2 ? detail?.CurrentTenants[0]?.Address?.AddressLine2 +" " : "")+
        //             (detail?.CurrentTenants[0]?.Address?.AddressLine3 ? detail?.CurrentTenants[0]?.Address?.AddressLine3+" ": "") +
        //             detail?.UnitNumber + " " + detail?.CurrentTenants[0]?.Address?.City + " " +  detail?.CurrentTenants[0]?.Address?.State + " " + detail?.CurrentTenants[0]?.Address?.PostalCode,
        //   leaseFromDate: formatDate(detail.LeaseFromDate),
        //   leaseToDate: formatDate(detail.LeaseToDate),
        //   extensionAllowed : "No",
        //   totalExpectedRent: detail?.totalExpectedRent ? (detail?.totalExpectedRent) : 0
        // }));
        navigate(ROUTE_NAVIGATION_PATH.RENTAL_LEASE_DETAIL + '/' + detail._id);
    }

    const leaseStatus = (lease: any) => {
        const today = moment().format("YYYY-MM-DD");
        const leaseStart = moment.utc(lease.leaseStartDate).format("YYYY-MM-DD");
        const leaseEnd = moment.utc(lease.leaseEndDate).format("YYYY-MM-DD");
      
        if (today < leaseStart) {
          return "Future Lease";
        } else if (today >= leaseStart && today <= leaseEnd) {
          return "Current Lease";
        } else {
          return "Past Lease";
        }
    };
      
      


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
                                <h4>Leases</h4>
                                <p className="ft-16">You can see all Leased property details here!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container portal_leaseproperty">
                    <div className="rental-card-content">
                        {loader ? (
                            <Spinner />
                        ) : (
                            <>

                                {!currentItems.length ? (
                                    <NoData />
                                ) : (
                                    <>
                                        <div className="row">
                                            {currentItems &&
                                                currentItems.map((data: any, key: any) => (
                                                    <div className="col-12 col-md-6 col-lg-4" key ={key} onClick={() => routeToDetail(data?.UnitId, data)}>
                                                        <span
                                                            className="cards"
                                                            title={data?.address}
                                                            >
                                                            <div className="card-image">
                                                                <img src={data?.image ? data?.image : placeHolder} alt="stay banner" className="first-featurette-img" onError={(e:any) => { e.target.src = placeHolder; }} />
                                                            </div>
                                                            <div className="card-price">
                                                                <div className="card-price-from">Starting from</div>
                                                                <div className="d-flex align-items-end">
                                                                    <div className="card-price-sign">${data?.dailyRate ? data?.dailyRate : 0}/</div>
                                                                    <div className="card-price-day">Night</div>
                                                                </div>
                                                            </div>
                                                            <div className="card-content  mapcard-content-home ">
                                                                <div className="card-subtitle">
                                                                    {data?.leaseStartDate ? formatDate(data.leaseStartDate) + '-' + (data?.leaseEndDate ? formatDate(data.leaseEndDate) : '') : ''}
                                                                </div>
                                                                <div className="card-title card-neighbourhood">
                                                                    {data?.neighborhood}
                                                                </div>
                                                                <div className="card-title">
                                                                    { data?.address}
                                                                </div>

                                                                <div className="card-footer">
                                                                    <div className="card-footer-item col-12 justify-content-between">
                                                                        <div className="d-flex">
                                                                            <span className="d-flex align-items-center">
                                                                                <em className="icon-bed"></em>
                                                                                {data?.bedrooms? data?.bedrooms : 0}
                                                                            </span>
                                                                        </div>
                                                                        <div className="d-flex">
                                                                            <span className="d-flex align-items-center ml-2">
                                                                                <em className="icon-bath"></em>
                                                                                {data?.bathrooms ? data?.bathrooms : 0}
                                                                            </span>
                                                                        </div>

                                                                        <div className="d-flex">
                                                                            <span className="d-flex align-items-center ml-2">
                                                                               
                                                                                    {data.parkingAvailable
                                                                                        ? 
                                                                                        <em className="icon-parking"></em>
                                                                                         : 
                                                                                        <em className="icon-not-parking"></em>
                                                                                    }
                                                                                
                                                                            </span>
                                                                        </div>

                                                                        <div className="d-flex">
                                                                            <span className="d-flex align-items-center ml-2">
                                                                                    {
                                                                                        data?.petsAllowed
                                                                                        ?

                                                                                        <em className="icon-pet-care"></em>
                                                                                        :
                                                                                        <em className="icon-not-pet-care"></em>
                                                                                    }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {data.leaseStartDate && data.leaseEndDate ?
                                                                <div className="card-status leased">{leaseStatus(data)}</div>

                                                                :
                                                                null
                                                                }
                                                        </span>
                                                    </div>
                                            ))}
                                        </div>
                                        {totalLeases > DEFAULT_OFFSET ? (
                                            <div className="custom-pagination">
                                                <ReactPaginate
                                                    breakLabel="..."
                                                    nextLabel=""
                                                    activeClassName={"active"}
                                                    onPageChange={handlePageClick}
                                                    pageRangeDisplayed={5}
                                                    pageCount={pageCount}
                                                    previousLabel=""
                                                    renderOnZeroPageCount={null}
                                                    forcePage={pageNo - 1} // ReactPaginate is zero-based, so subtract 1
                                                />
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </>
                        )}

                    </div>

                </div>
            </div>
        </>
    );
}