import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { owner, property } from "../../api";
import { NoData } from "../../components";
import Spinner from "../../components/Spinner";
import { DEFAULT_OFFSET } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { formatDate, isArrayHas, textToNumber } from "../../utils/common";
import placeHolder from "../../assets/images/ph400x500.png";

export default function OwnerProperty() {
  const toProperty = new URLSearchParams(document.location.search).get('toProperty');
  const [currentItems, setCurrentItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [filterType, setFilterType] = useState(toProperty === '1' ? 1 : 0);
  const [totalProperties, setTotalProperties] = useState(0);
  const auth = useAuth();

  useEffect(() => {
    setLoader(true);
    window.scrollTo(0, 0);
    const data:any = {
      page: pageNo,
      count: DEFAULT_OFFSET,
      filterType: filterType
    };
    if(filterType !== 1) 
    {
      property.getOwnerProperties(data).then((res: any) => {
        setTotalProperties(res.totalProperties);
        setCurrentItems(res.data);
        setLoader(false);
      });

    } else {
      setCurrentItems([]);
      delete data.filterType;
      owner.getOwnerLeases(data).then((res: any) => {
        setTotalProperties(res.totalLeases);
        setCurrentItems(res.data);
        setLoader(false);
      });
    }
    
  }, [pageNo, filterType]);

  const pageCount = Math.ceil(totalProperties / DEFAULT_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNo(event.selected + 1);
  };

  const changeProperty = (event: any, filterValue: any, tab:any='all') => {
    setFilterType(filterValue);
    setPageNo(1);
    
    // getProperties();
  };

  const leaseStatus = (lease:any) => {
    const currentDate = new Date();
    const leaseStartDate = new Date(lease.leaseStartDate);
    const leaseEndDate = new Date(lease.leaseEndDate);
  
    let status = "Past Lease";

    if (currentDate >= leaseStartDate && currentDate <= leaseEndDate) {
      status = "Current Lease";
    }

    if (currentDate <= leaseStartDate) {
        status = "Furure Lease";
    }
  
    return status;
  };

  
  

  return (
    <>
      <div className="right-container">

        <div className="breadcrumb-module breadcrumb-image-module">
          <div className="container">
            <div className="breadcrumb-row add-property-btn-breadcrumb">
              <div className="breadcrumb-content">
                <h4>Welcome {auth?.user.firstName}!</h4>
                <p>Manage your properties and services.</p>
              </div>
              <Link to={ROUTE_NAVIGATION_PATH.ADD_PROPERTY}>
                <button className="btn primary plus-on-btn">
                  <span className="plus-text">+</span>
                  <span className="add-property">Add property</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="container">
          <ul className="rental-portal-tabs">
            <li className="rental-portal-li">
              <a className={`${filterType === 0 ? "active" : ""}`} onClick={(e: any) => changeProperty(e, 0, 'all')}>
                All Properties
              </a>
            </li>
            <li className="rental-portal-li">
              <a className={`${filterType === 1 ? "active" : ""}`} onClick={(e: any) => changeProperty(e, 1, 'leased')}>Leases</a>
            </li>
            <li className="rental-portal-li">
              <a className={`${filterType === 2 ? "active" : ""}`} onClick={(e: any) => changeProperty(e, 2, 'pending')}>
                Pending Properties
              </a>
            </li>
          </ul>
          <div className="rental-card-content">

            <div className="rental-card-result mt-4 mb-2">
              Results Found ({totalProperties})
            </div>
            {
              filterType === 0 || filterType === 2 ?
                <p>
                  After a property is updated from “Pending” to “Active”, if you
                  would like to change the availability dates or rental rates,
                  please submit those via email to{" "}
                  <a href="mailto:owners@stayattache.com">
                    owners@stayattache.com
                  </a>
                </p>
                :
                null
            }
            {
              filterType === 0 ?
                <p className="suggestion-txt">
                  Please note - the page views are a rolling total of the past
                  30-days.
                </p>
                :
                null
            }
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
                          <div className="col-12 col-md-6 col-lg-4">
                            {
                              filterType !== 1 ?
                              <Link
                                to={data?.attacheRentalProperty?.propertyDetailInfo.managedStatus == 1 ?  '' : ROUTE_NAVIGATION_PATH.EDIT_PROPERTY + '/' + data?._id}
                                className="cards"
                                title={data?.attacheRentalProperty?.propertyDetails?.streetAddress + ' ' + data?.attacheRentalProperty?.propertyDetails?.city + ' ' + data?.attacheRentalProperty?.propertyDetails?.state +
                                  ' ' + data?.attacheRentalProperty?.propertyDetails?.postalCode + ' ' + data?.attacheRentalProperty?.propertyDetails?.unitNumber}
                              >
                                <div className="card-image">
                                  <img src={data?.buildiumRentalProperty?.Files[0]?.Url ? data?.buildiumRentalProperty?.Files[0]?.Url : placeHolder} alt="stay banner" className="first-featurette-img" />

                                </div>
                                <div className="card-price">
                                  <div className="card-price-from">Starting from</div>
                                  <div className="d-flex align-items-end">
                                    <div className="card-price-sign">${data?.attacheRentalProperty?.propertyDetailInfo?.dailyRate ? data?.attacheRentalProperty?.propertyDetailInfo?.dailyRate : 0}/</div>
                                    <div className="card-price-day">Night</div>
                                  </div>
                                </div>
                                <div className="card-content  mapcard-content-home ">
                                  <div className="card-subtitle">
                                    Available from {data?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom ? formatDate(data?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom) : 'NA'}
                                  </div>
                                  <div className="card-title card-neighbourhood">
                                    {data?.attacheRentalProperty?.propertyDetails?.neighborhoodName}
                                  </div>
                                  <div className="card-title">
                                    {data?.attacheRentalProperty?.propertyDetails?.streetAddress + ' ' + data?.attacheRentalProperty?.propertyDetails?.city + ' ' + data?.attacheRentalProperty?.propertyDetails?.state +
                                      ' ' + data?.attacheRentalProperty?.propertyDetails?.postalCode + ' ' + data?.attacheRentalProperty?.propertyDetails?.unitNumber}
                                  </div>

                                  <div className="card-footer">
                                    <div className="card-footer-item col-12 justify-content-between">
                                      <div className="d-flex">
                                        <span className="d-flex align-items-center">
                                          <em className="icon-bed"></em>
                                          {data?.attacheRentalProperty?.beds?.bedroomCount ? textToNumber(data?.attacheRentalProperty?.beds?.bedroomCount) : 0}
                                        </span>
                                      </div>
                                      <div className="d-flex">
                                        <span className="d-flex align-items-center ml-2">
                                          <em className="icon-bath"></em>
                                          {data?.attacheRentalProperty?.propertyDetailInfo?.fullBathroomCount ? textToNumber(data?.attacheRentalProperty?.propertyDetailInfo?.fullBathroomCount) : 0}
                                        </span>
                                      </div>

                                      <div className="d-flex">
                                        <span className="d-flex align-items-center ml-2">
                                          {
                                            data?.isParking ?
                                            <em className="icon-parking"></em>
                                            :
                                            <em className="icon-not-parking"></em>
                                          }
                                        </span>
                                      </div>

                                      <div className="d-flex">
                                        <span className="d-flex align-items-center ml-2">
                                        {
                                            data?.isPetsAllowed ?
                                            <em className="icon-pet-care"></em>
                                            :
                                            <em className="icon-not-pet-care"></em>
                                          }
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {
                                  filterType === 0 && !data?.isActive ?
                                    <div className="card-status pending">Pending</div>
                                    :
                                    null
                                }
                              </Link>
                            :
                              <Link
                                to={ROUTE_NAVIGATION_PATH.OWNER_LEASE_DETAIL+ '/' + data?.unitId + '?leaseId=' + data?._id + '&page=leased'}
                                className="cards"
                                title={data?.propertyAddress}
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
                                    Lease starts from  {data?.leaseStartDate ? formatDate(data.leaseStartDate) : 'NA'}
                                  </div>
                                  <div className="card-title card-neighbourhood">
                                    {data?.neighborhood}
                                  </div>
                                  <div className="card-title">
                                    {data?.propertyAddress}
                                  </div>

                                  <div className="card-footer">
                                    <div className="card-footer-item col-12 justify-content-between">
                                      <div className="d-flex">
                                        <span className="d-flex align-items-center">
                                          <em className="icon-bed"></em>
                                          {data?.bedrooms ? (data?.bedrooms) : 0}
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
                                          {data.parkingAvailable ? 
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
                                
                                    
                                  
                              </Link>
                            }
                            
                          </div>
                        ))}
                    </div>
                    {currentItems.length > DEFAULT_OFFSET ? (
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
