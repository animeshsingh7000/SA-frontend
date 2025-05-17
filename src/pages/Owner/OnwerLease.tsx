import { NoData } from "../../components";
import leaseActive from "../../assets/images/lease-active.svg";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_OFFSET } from "../../constants";
import { owner } from "../../api";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../utils/common";
import placeHolder from "../../assets/images/ph400x500.png";
import ReactPaginate from "react-paginate";

export default function OwnerLease() {
  const auth = useAuth();

  const { pathname } = useLocation();
  const [currentItems, setCurrentItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalLeases, setTotalLeases] = useState(1);
  const [sortField, setSortField] = useState("LeaseFromDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const data = {
      page: pageNo,
      count: DEFAULT_OFFSET,
      sortField: sortField,
      sortOrder: sortOrder
    };

    owner.getOwnerLeases(data).then((res: any) => {
      setTotalLeases(res.totalLeases);
      setCurrentItems(res.data);
      setLoader(false);
    });
  }, [pageNo, sortOrder]);

  const pageCount = Math.ceil(totalLeases / DEFAULT_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNo(event.selected + 1);
  };

  function routeToDetail(unitId: any, detail: any) {
    navigate(ROUTE_NAVIGATION_PATH.OWNER_LEASE_DETAIL+ '/' + detail?.unitId + '?leaseId=' + detail?._id + '&page=leased');
  }


  const sortingFields = (value:any) => {
    setPageNo(1);
    setSortField(value);
    setSortOrder(sortOrder === "desc" ? 'asc' : "desc");
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
                <h4>Leases</h4>
                <p className="ft-16">You can see all Leased property details here!</p>
              </div>
            </div>
          </div>
        </div>
        {loader ? (
          <Spinner />
        ) : (
          <>

            {!currentItems.length ? (
              <NoData />
            ) : (
              <div className="lease-page-container">
                <div className="lease-payment-schedule">
                  <div className="container container-fluid">
                    <div className="lease-payment-head">
                      <div className="lease-col">Property</div>
                      <div className="lease-col">
                        Start Date
                        <span
                          className="sorting-icon"
                          title="Start Date"
                          onClick={() => sortingFields("LeaseFromDate")}
                        ></span>
                      </div>
                      <div className="lease-col">
                        End Date
                        <span
                          className="sorting-icon"
                          title="End Date"
                          onClick={() => sortingFields("LeaseToDate")}
                        ></span>
                      </div>
                      <div className="lease-col">Total Expected Rent</div>
                      {/* <div className="lease-col">Action</div> */}
                    </div>
                    {currentItems &&
                        currentItems.map((data: any, key: any) => (
                        <div className="lease-payment-list" key ={key}>
                          <div className="lease-payment-items align-items-center">
                            <div data-title="Property" className="lease-col" style={{cursor: "pointer"}}onClick={() => routeToDetail(data?.UnitId, data)}>
                              <span
                                className="leaselist-link"
                                title={data?.propertyAddress}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="lease-img">
                                    <img src={data?.image ? data?.image : placeHolder} alt="stay banner" className="first-featurette-img" onError={(e:any) => { e.target.src = placeHolder; }} />
                                  </div>
                                  <div className="lease-property-text">
                                   {data?.propertyAddress}
                                  </div>
                                </div>
                              </span>
                            </div>
                            <div data-title="Start Date" className="lease-col">
                              {data?.leaseStartDate ? formatDate(data.leaseStartDate) : 'NA'}
                            </div>
                            <div data-title="End Date" className="lease-col">
                              {data?.leaseEndDate ? formatDate(data.leaseEndDate) : 'NA'}
                            </div>
                            <div data-title="Total Expected Rent" className="lease-col">
                              {data?.totalExpectedRent ? '$' + data?.totalExpectedRent.toFixed(2) : 0}
                            </div>
                            {/* <div
                              data-title="Status"
                              className="lease-col text-capitalize"
                            >
                              <span className="property-status in-progress">
                                Pending
                              </span>
                            </div>
                            <div data-title="Action" className="lease-col">
                              <a
                                className="delete-blobk leaselist-link"
                                href="/portal/owner/lease/25437/delete"
                                title="Delete Block Date"
                              >
                                <i className="icon-trash icon-white"></i> Delete
                              </a>
                            </div> */}
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
                {totalLeases > DEFAULT_OFFSET ? (
                  <div className="custom-pagination container container-fluid">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=""
                      activeClassName={"active"}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel=""
                      renderOnZeroPageCount={null}
                    />
                  </div>
                 ) : null}
              </div>
            )
            }
          </>
        )}
      </div>
    </>
  );
}