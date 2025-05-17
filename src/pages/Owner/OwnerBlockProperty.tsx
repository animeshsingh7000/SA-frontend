import { NoData, SideBar } from "../../components";
import noDataImg from "../../assets/images/no-recourd-found.png";
import { useEffect, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOwnerBlockDates } from "../../api/owner";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";
import ReactPaginate from "react-paginate";
import AddBlockDateModel from "../../components/Modal/AddBlockDateModel";
import { formatDate } from "../../utils/common";
import placeHolder from "../../assets/images/ph400x500.png";


const INTIAL_OFFSET = 20;
type SortType = Record<string, 1 | -1>;

export default function OwnerBlockProperty() {
  const [currentItems, setCurrentItems] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [paginationPageSize, setPaginationPageSize] = useState<number>(INTIAL_OFFSET);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [loader, setLoader] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortType>();
  const auth = useAuth();
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("query") !== searchQuery) {
      setPageNumber(1);
      setSearchQuery(searchParams.get("query"));
    }
  }, [searchParams]);

  const clearParams = () => {
    // Navigate to the current pathname without parameters
    navigate(window.location.pathname, { replace: true });
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber, searchQuery, sortBy]);

  const pageCount = Math.ceil(totalCount / INTIAL_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNumber(event.selected + 1);
  };

  const doSort = (keyName: any) => {
    if (sortBy?.[keyName]) {
      setSortBy({ [keyName]: sortBy?.[keyName] * -1 } as SortType);
    } else {
      setSortBy({ [keyName]: -1 });
    }
  };

  const fetchData = async (page: number) => {
    setLoader(true);
    try {
      getOwnerBlockDates({
        count: paginationPageSize,
        page,
        // search: searchQuery,
        sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
      }).then((res: any) => {
        setLoader(false);
        setCurrentItems(res.data);
        setTotalCount(res.count);
      });
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Perform any side effects like re-fetching data with the new page number if necessary
  }, [pageNumber]);

  const updateListItem = () => {
    
    setSearchQuery("");
  }


  return (
    <>
      <div className="right-container">
        <div className="breadcrumb-module breadcrumb-image-module lease-dashboard-breadcrumb-module">
          <div className="container">
            <div className="breadcrumb-row flex-row1 add-property-btn-breadcrumb">
              <div className="breadcrumb-content">
                <div className="breadcrumb-content-flex">
                  <div className="breadcrumb-icon mt-1">
                    <em className="arrival-icon icon-calender"></em>
                  </div>
                  <div>
                    <h4>Block Dates</h4>
                    <p className="ft-16">
                      You can block dates for properties here!
                    </p>
                    <p className="have-questions">
                      For any changes to approved owner blocks, please email <a href="mailto:owners@stayattache.com">
                        {auth?.user?.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="btn primary"
                onClick={()=>setAddModal(true)}
              >
                <span className="add-property">Block Dates</span>
              </button>
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
                    <strong className="listing-title">
                      Block Dates Properties
                    </strong>
                    <div className="lease-payment-head">
                      <div className="lease-col">Property</div>
                      <div className="lease-col">
                        Start Date
                        <a
                          className="sorting-icon"
                          title="Start Date"
                          onClick={() => doSort("startDate")}
                        ></a>
                      </div>
                      <div className="lease-col">
                        End Date
                        <a
                          className="sorting-icon"
                          title="End Date"
                          onClick={() => doSort("endDate")}
                        ></a>
                      </div>
                      <div className="lease-col">Status</div>
                      {/* <div className="lease-col">Action</div> */}
                    </div>
                    {currentItems &&
                      currentItems.map((data: any, key: any) => (
                        <div className="lease-payment-list">
                          <div className="lease-payment-items align-items-center">
                            <div data-title="Property" className="lease-col">
                              <a
                                className="leaselist-link"
                                href={'/' + (data.address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') +'/' + data?.listingId}
                                title={data.propertyName}
                              >
                                <div className="d-flex align-items-center">
                                  <div className="lease-img">
                                    <img src={data?.image?.Files[0]?.Url ? data?.image?.Files[0]?.Url : placeHolder} alt="stay banner" className="first-featurette-img" />
                                  </div>
                                  <div className="lease-property-text">
                                    {data.propertyName}
                                  </div>
                                </div>
                              </a>
                            </div>
                            <div data-title="Start Date" className="lease-col">
                              {data.startDate ? formatDate(data.startDate) : 'NA'}
                            </div>
                            <div data-title="End Date" className="lease-col">
                              {data.endDate ? formatDate(data.endDate) : 'NA'}
                            </div>
                            <div
                              data-title="Status"
                              className="lease-col text-capitalize"
                            >
                              <span className={`property-status ${data.blockDateStatus === 'Pending' ? 'in-progress' : 'completed'}`}>
                                {data.blockDateStatus}
                              </span>
                            </div>
                            {/* <div data-title="Action" className="lease-col">
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
                {totalCount > INTIAL_OFFSET ? (
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
                ) : null
                }
              </div>
            )
            }
          </>
        )}
      </div>

      {
        addModal ? (
          <AddBlockDateModel
            show={addModal}
            handleClose={() => setAddModal(false)}
            updateListItem={updateListItem}
          />
        )
          :
          null
      }
    </>
  );
}
