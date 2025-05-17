import { NoData } from "../../components";
import propertiesActive from "../../assets/images/owner-sidebar/my-properties-active.svg";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_OFFSET } from "../../constants";
import { property } from "../../api";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../utils/common";
import placeHolder from "../../assets/images/ph400x500.png";
import ReactPaginate from "react-paginate";
import editIcon from "../../assets/images/edit-icon.svg";
import approveICon from "../../assets/images/approve.svg";
import proImg from "../../assets/images/slider-image.png";
import proInfo from "../../assets/images/Info.svg";
import { Form } from "react-final-form";
import { FormControl } from "../../components/FormElements/FormControl";

import deleteIcon from "../../assets/images/remove-red-icon.svg";
import rejectIcon from "../../assets/images/close-icon-red.svg";
import tuserIcon from "../../assets/images/t-user-icon.svg";
import buildingIcon from "../../assets/images/building.svg";
import greenIcon from "../../assets/images/green-tick.svg";
import plusWhite from "../../assets/images/plus-white.svg";

import crossIcon from "../../assets/images/crossx.svg";
import plusIcon from "../../assets/images/Plus.svg";
import userIconImg from "../../assets/images/the-way-banner.jpg";
import plusGreen from "../../assets/images/plus-green.svg";
import sortIcon from "../../assets/images/Sort.svg";
import filterIcon from "../../assets/images/filter-icon.svg";
import displayIcon from "../../assets/images/display.svg";
import SortAscending from "../../assets/images/SortAscending.svg";
import SortDscending from "../../assets/images/SortDscending.svg";
import checkgrey from "../../assets/images/checkgrey.svg";
import closeIcon from "../../assets/images/close.svg";


import { CheckboxControl } from "../../components/FormElements/CheckboxControl";

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { AgGridReact } from "ag-grid-react";
import SearchBar from "../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
const INTIAL_OFFSET = 10;


export default function OwnerPropertyList() {
  const { pathname } = useLocation();
  const [currentItems, setCurrentItems] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalProperties, setTotalProperties] = useState(1);
  const navigate = useNavigate();
  const [totalRows, setTotalRows] = useState<number>(0);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [loader, setLoader] = useState(false);

  const [paginationPageSize, setPaginationPageSize] =
    useState<number>(INTIAL_OFFSET);

  interface ApiResponse {
    data: {
      // ownerInquiries: OwnerInquiry[];
      totalOwnerInquiriesCount: number;
    };
    error: string | null;
    message: string;
  }
  // const [rowData, setRowData] = useState<OwnerInquiry[]>([]);

  const onSubmit = (values: any) => {

  }


  const gridOptions = {
    pagination: true,
    paginationPageSize: paginationPageSize,
  };

  const onPageSizeChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPaginationPageSize(parseInt(event.target.value, INTIAL_OFFSET));
  };

  const onPaginationChanged = (event: any) => {
    if (
      event.newPage &&
      event.api.paginationGetCurrentPage() + 1 !== pageNumber
    ) {
      setPageNumber(+event.api.paginationGetCurrentPage() + 1);
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const data: any = {
      page: pageNo,
      count: 10,
      filterType: 1
    };

    property.getProperties(data).then((res: any) => {
      setTotalProperties(res.totalProperties);
      setCurrentItems(res.data);
      setLoader(false);
    });
  }, [pageNo]);

  const pageCount = Math.ceil(totalProperties / DEFAULT_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNo(event.selected + 1);
  };


  function navigateToEdit(id: any, isActive: any) {
    navigate(ROUTE_NAVIGATION_PATH.ADMIN_OWNER_EDIT_PROPERTY + '/' + id + '/' + (!isActive ? "edit" : 'view'))
  }


  return (
    <>
      {/* <div className="right-container"> */}
      {loader ? (
        <Spinner />
      ) : (
        <>

          {!currentItems.length ? (
            <NoData />
          ) : (
            <div className="lease-page-container" >
              <div className="lease-payment-schedule">
                <div className="container container-fluid">
                  <div className="lease-payment-head">
                    <div className="lease-col">Property</div>
                    <div className="lease-col">
                      Available Date
                      {/* <span
                          className="sorting-icon"
                          title="Start Date"
                        ></span> */}
                    </div>
                    {/* <div className="lease-col">
                        End Date
                        <span
                          className="sorting-icon"
                          title="End Date"
                        ></span>
                      </div> */}
                    <div className="lease-col">Action</div>
                    {/* <div className="lease-col">Action</div> */}
                  </div>
                  {currentItems &&
                    currentItems.map((data: any, key: any) => (
                      <div className="lease-payment-list" key={key}>
                        <div className="lease-payment-items align-items-center">
                          <div data-title="Property" className="lease-col">
                            <span
                              className="leaselist-link"
                              title={data?.attacheRentalProperty?.propertyDetails?.streetAddress + ' ' + data?.attacheRentalProperty?.propertyDetails?.city + ' ' + data?.attacheRentalProperty?.propertyDetails?.state +
                                ' ' + data?.attacheRentalProperty?.propertyDetails?.postalCode + ' ' + data?.attacheRentalProperty?.propertyDetails?.unitNumber}
                            >
                              <div className="d-flex align-items-center">
                                <div className="lease-img">
                                  <img src={data?.buildiumRentalProperty?.Unit?.Files[0]?.Url ? data?.buildiumRentalProperty?.Unit?.Files[0]?.Url : placeHolder} alt="stay banner" className="first-featurette-img" />
                                </div>
                                <div className="lease-property-text">
                                  {data?.attacheRentalProperty?.propertyDetails?.streetAddress + ' ' + data?.attacheRentalProperty?.propertyDetails?.city + ' ' + data?.attacheRentalProperty?.propertyDetails?.state +
                                    ' ' + data?.attacheRentalProperty?.propertyDetails?.postalCode + ' ' + data?.attacheRentalProperty?.propertyDetails?.unitNumber}
                                </div>
                              </div>
                            </span>
                          </div>
                          <div data-title="Start Date" className="lease-col">
                            {data?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom ? formatDate(data?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom) : 'NA'}
                          </div>
                          {/* <div data-title="End Date" className="lease-col">
                              {data?.LeaseToDate ? formatDate(data.LeaseToDate) : 'NA'}
                            </div> */}

                          <div data-title="Action" className="lease-col">

                            <a
                              className="delete-blobk leaselist-link"
                              onClick={() => navigateToEdit(data?._id, data?.isActive)}
                            >
                              {
                                !data?.isActive ?
                                  <>
                                    <img className="_icons" src={editIcon} alt="Edit"></img> Edit
                                  </>
                                  :
                                  <>
                                    <i className="icon-edit icon-white"></i> View
                                  </>
                              }

                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* {totalLeases > DEFAULT_OFFSET ? ( */}
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
              {/* ) : null} */}
            </div>
          )
          }




          {/* User Property page  */}

          <div className="common-right-panel-section" style={{ 'display': 'none' }}>
            <div className="top-right-bar">
              <Breadcrumb>
                <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Property</Breadcrumb.Item>
                <Breadcrumb.Item active>All Properties</Breadcrumb.Item>
              </Breadcrumb>
              <div className="heading _bottom-tabs-space">
                <h1>Properties</h1>
              </div>

            </div>
            <div className="mid-content-section">
              <Tabs
                defaultActiveKey="allProperties"
                id="fill-tab-example"
                className="mb-3"
                fill
              >
                <Tab eventKey="allProperties" title="All Properties">
                  <div className="table-action-content">
                    <div className="filter-tab">
                      <img src={filterIcon} alt="Filter" /> Filter
                      <div className="drop-text-filter">
                        <div className="hdtext">Filter</div>
                        <ul>
                          <li>Bedroom</li>
                          <li>Min Lease Term</li>
                          <li>Neighborhood</li>
                          <li>Arrival Start</li>
                        </ul>
                      </div>
                    </div>
                    <div className="display-tab">
                      <img src={displayIcon} alt="display" /> Display
                      <div className="drop-text-display">
                        <div className="hdtext">Display</div>
                        <ul>
                          <Form
                            // initialValues={initData}
                            onSubmit={onSubmit}
                            render={({ handleSubmit, values }) => (
                              <form
                                onSubmit={handleSubmit}
                                className="owner-inquery-form"
                              >
                                <li className="active">

                                  <div className="termstext">
                                    <CheckboxControl name="isRemember" label="Ops" />
                                  </div>

                                </li>
                                <li>

                                  <div className="termstext">
                                    <CheckboxControl name="isRemember" label="Available" />
                                  </div>

                                </li>
                                <li>

                                  <div className="termstext">
                                    <CheckboxControl name="isRemember" label="Bedrooms" />
                                  </div>

                                </li>

                              </form>
                            )}
                          />
                        </ul>
                      </div>
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" />
                    </div>
                    <button className="btn primary">
                      <img src={plusWhite} alt="Icon" /> New Property
                    </button>
                  </div>
                  <div className="filter-added">
                    <div className="bdr">
                      <button>Clear Filter</button>

                    </div>
                    <ul>
                      <li>
                       <span>Minimum Lease Term </span>160 Days <img src={closeIcon} alt="Icon" /> 
                      </li>
                      <li>
                      Studio <img src={closeIcon} alt="Icon" /> 
                      </li>

                    </ul>

                  </div>
                  <div className="table-section-common _owner-inquiry-table when-filter-added">
                    <Table responsive className="table-7-column">
                      <thead>
                        <tr>
                          <th><div className="th-data firstchild">Property Editor Link <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Last Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Earliest Available <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th>
                            <div className="th-data">Available
                              <div className="sort-table active"><img src={sortIcon} alt="sort" />
                                <div className="drop-text-sort">
                                  <div className="hdtext">Sort</div>
                                  <ul>
                                    <li className="active">
                                      <img src={SortAscending} alt="Icon" /> <span>Oldest to Newest</span>  <img src={checkgrey} alt="" />
                                    </li>
                                    <li>
                                      <img src={SortDscending} alt="Icon" /> <span>Oldest to Newest</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th><div className="th-data">Ops <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Last Cleaning <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Last QC <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>



                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="t-user">
                              <div className="t-user-icon">
                                <img src={buildingIcon} alt="icon" />
                              </div>
                              <div className="t-user-info">1901 Thornridge Cir. Shiloh, Hawaii 81063</div>
                            </div>
                          </td>
                          <td>
                            January 3, 2020
                          </td>
                          <td>January 3, 2020</td>
                          <td>November 28, 2015</td>
                          <td>Bessie Cooper</td>
                          <td>November 28, 2015</td>
                          <td>
                            Esther Howard
                            <p className="_font">February 9, 2015</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="t-user">
                              <div className="t-user-icon">
                                <img src={buildingIcon} alt="icon" />
                              </div>
                              <div className="t-user-info">1901 Thornridge Cir. Shiloh, Hawaii 81063</div>
                            </div>
                          </td>
                          <td>
                            January 3, 2020
                          </td>
                          <td>January 3, 2020</td>
                          <td>November 28, 2015</td>
                          <td>Bessie Cooper</td>
                          <td>November 28, 2015</td>
                          <td>
                            Esther Howard
                            <p className="_font">February 9, 2015</p>
                          </td>
                        </tr>

                      </tbody>
                    </Table>
                    <div className="ag-theme-alpine" style={{ height: "100%" }}>
                      <AgGridReact
                        // rowData={rowData}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationPageSize={paginationPageSize}
                        onPaginationChanged={onPaginationChanged}

                      ></AgGridReact>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="currentActive" title="Active">
                  <div className="table-action-content">
                    <div className="filter-tab">
                      <img src={filterIcon} alt="Filter" /> Filter
                      <div className="drop-text-filter">
                        <div className="hdtext">Filter</div>
                        <ul>
                          <li>Bedroom</li>
                          <li>Min Lease Term</li>
                          <li>Neighborhood</li>
                          <li>Arrival Start</li>
                        </ul>
                      </div>
                    </div>
                    <div className="display-tab">
                      <img src={displayIcon} alt="display" /> Filter
                      <div className="drop-text-display">
                        <div className="hdtext">Filter</div>
                        <ul>
                          <Form
                            // initialValues={initData}
                            onSubmit={onSubmit}
                            render={({ handleSubmit, values }) => (
                              <form
                                onSubmit={handleSubmit}
                                className="owner-inquery-form"
                              >
                                <li className="active">

                                  <div className="termstext">
                                    <CheckboxControl name="isRemember" label="Ops" />
                                  </div>

                                </li>
                                <li>

                                  <div className="termstext">
                                    <CheckboxControl name="isRemember" label="Available" />
                                  </div>

                                </li>
                                <li>

                                  <div className="termstext">
                                    <CheckboxControl name="isRemember" label="Bedrooms" />
                                  </div>

                                </li>

                              </form>
                            )}
                          />
                        </ul>
                      </div>
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" />
                    </div>
                    <button className="btn primary">
                      <img src={plusWhite} alt="Icon" /> New Property
                    </button>
                  </div>
                  <div className="table-section-common">
                    <Table responsive className="table-7-column">
                      <thead>
                        <tr>
                          <th><div className="th-data firstchild">Property Editor Link <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Last Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Earliest Available <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th>
                            <div className="th-data">Available
                              <div className="sort-table active"><img src={sortIcon} alt="sort" />
                                <div className="drop-text-sort">
                                  <div className="hdtext">Sort</div>
                                  <ul>
                                    <li className="active">
                                      <img src={SortAscending} alt="Icon" /> <span>Oldest to Newest</span>  <img src={checkgrey} alt="" />
                                    </li>
                                    <li>
                                      <img src={SortDscending} alt="Icon" /> <span>Oldest to Newest</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th><div className="th-data">Ops <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Last Cleaning <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                          <th><div className="th-data">Last QC <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>



                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="t-user">
                              <div className="t-user-icon">
                                <img src={buildingIcon} alt="icon" />
                              </div>
                              <div className="t-user-info">1901 Thornridge Cir. Shiloh, Hawaii 81063</div>
                            </div>
                          </td>
                          <td>
                            <div className="t-user _action _not">
                              <div className="t-user-icon">
                                <img src={crossIcon} alt="icon" />
                              </div>
                              <div className="t-user-info">No</div>
                            </div>
                          </td>
                          <td>January 3, 2020</td>
                          <td>November 28, 2015</td>
                          <td>Bessie Cooper</td>
                          <td>November 28, 2015</td>
                          <td>
                            Esther Howard
                            <p className="_font">February 9, 2015</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="t-user">
                              <div className="t-user-icon">
                                <img src={buildingIcon} alt="icon" />
                              </div>
                              <div className="t-user-info">1901 Thornridge Cir. Shiloh, Hawaii 81063</div>
                            </div>
                          </td>
                          <td>
                            <div className="t-user _action">
                              <div className="t-user-icon">
                                <img src={greenIcon} alt="icon" />
                              </div>
                              <div className="t-user-info">Yes</div>
                            </div>
                          </td>
                          <td>January 3, 2020</td>
                          <td>November 28, 2015</td>
                          <td>Bessie Cooper</td>
                          <td>November 28, 2015</td>
                          <td>
                            Esther Howard
                            <p className="_font">February 9, 2015</p>
                          </td>
                        </tr>



                      </tbody>
                    </Table>
                    <div className="ag-theme-alpine" style={{ height: "100%" }}>
                      <AgGridReact
                        // rowData={rowData}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationPageSize={paginationPageSize}
                        onPaginationChanged={onPaginationChanged}

                      ></AgGridReact>
                    </div>
                  </div>

                </Tab>
                <Tab eventKey="Available" title="Available">
                  Tab content for Loooonger Tab
                </Tab>
                <Tab eventKey="onLease" title="On Lease">
                  Tab content for Contact
                </Tab>
              </Tabs>
            </div>
          </div>
          {/* User Management page End  */}




        </>
      )
      }
      {/* </div> */}
    </>
  );
}