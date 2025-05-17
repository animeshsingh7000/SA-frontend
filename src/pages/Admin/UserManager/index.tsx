import React, { useState, useEffect, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SearchBar from "../../../components/SearchBar";
import tuserIcon from "../../../assets/images/t-user-icon.svg";
import greenIcon from "../../../assets/images/green-tick.svg";
import downIcon from "../../../assets/images/arrowDown.svg";
import buildingIcon from "../../../assets/images/building.svg";
import crossIcon from "../../../assets/images/crossx.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { getUserList } from "../../../api/admin/user";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components";
import plusWhite from "../../../assets/images/plus-white.svg";
import createXlsxExporter from "../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;

type SortType = Record<string, 1 | -1>;

const UserManagerList: React.FC = () => {
  const editActiveType= new URLSearchParams(document.location.search).get('activeKey');
  const editType= new URLSearchParams(document.location.search).get('type');

  const [rowData, setRowData] = useState([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [count, setCount] = useState<number>(INTIAL_OFFSET);
  const [countText, setCountText] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const [loader, setLoader] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [type, setType] = useState(editType ? Number(editType) : -1);
  const [sortBy, setSortBy] = useState<SortType>();
  const [activeKey, setActiveKey] = useState(editActiveType ? editActiveType : 'allUser');
  const [activeTab, setActiveTab] = useState("");
  const [applyDisplay, setApplyDisplay] = useState<any>(false);
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get("query") !== searchQuery) {
      setPageNumber(1);
      setSearchQuery(searchParams.get("query"));
    }
  }, [searchParams]);

  // const clearParams = () => {
  //   // Navigate to the current pathname without parameters
  //   navigate(window.location.pathname, { replace: true });
  // };


  const handleSelect = (key:any) => {
    setActiveKey(key); // Set the active tab
    let typeOfuser = key === 'allUser' ? -1 : (key === 'owners' ? 1 : (key === 'attache' ? 2 : (key === 'renters' ? 3 : 0)));
    setCount(10);
    setCountText(10);
    setPageNumber(1);
    setSortBy({createdAt: -1});
    setActiveTab(key);
    // clearParams()
    setType(typeOfuser);
  };

  useEffect(() => {
    fetchData(pageNumber);
  }, [pageNumber, searchQuery, type, sortBy]);

  const pageCount = Math.ceil(totalRows / count);

  const handlePageClick = (event: any) => {
    setPageNumber(event.selected + 1);
  };

  const doSort = (keyName:any) => {
    if (sortBy?.[keyName]) {
      setSortBy({ [keyName]: sortBy?.[keyName] * -1 } as SortType);
    } else {
      setSortBy({ [keyName]: -1 });
    }
  };


  const fetchData = async (page: number, c?:number) => {
    setLoader(true);
    try {
      getUserList({
        count: c ? c : count,
        page: page,
        type: type,
        search: searchQuery,
        sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({createdAt: -1}),
      }).then((res) => {
        setLoader(false);
        setRowData(res.data);
        setTotalRows(res.count);
        setActiveTab("");
      });
    } catch (error) {
      setLoader(false);
      console.error("Error fetching data:", error);
    }
  };


  // function convertSortBy(sortBy: any) {
  //   const updatedSortBy: any = {};
  
  //   // Loop through the keys in sortBy
  //   for (const key in sortBy) {
  //     if (sortBy.hasOwnProperty(key)) {
  //       // If the key is enclosed in square brackets, extract and format it
  //       const newKey = key.startsWith("[") && key.endsWith("]") 
  //                       ? key.slice(1, -1).toLowerCase()  // Remove brackets and convert to lowercase
  //                       : key.toLowerCase();              // Otherwise just convert to lowercase
  
  //       // Assign the value to the updated key in the new object
  //       updatedSortBy[newKey] = sortBy[key];
  //     }
  //   }
  
  //   return updatedSortBy;
  // }

  // function formatSortBy(sortBy:any) {
  //   const key = Object.keys(sortBy)[0];
  //   const value = sortBy[key];
  //   return `${key}:${value}`;
  // }

  useEffect(() => {
    // Perform any side effects like re-fetching data with the new page number if necessary
  }, [pageNumber]);

  function navigateToEdit(id:any, type:any) {
    navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_USERS+'/'+id+'/'+type);
  }

  function navigateToCreate() {
    navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_USERS+'/0'+'/0');
  }

  const changeData = (value:number, text:any) => {
    setPageNumber(1);
    setCountText(text)
    setCount(value);
    fetchData(1, value); 
}

  function exportData(e:any) {
    e.stopPropagation();
    const exportToXlsx = createXlsxExporter();
    const headers = type !== 1 && type !== 0 ? ['Username', 'Email', 'Enabled'] : ['Username', 'Email', 'Property', 'Enabled'];
    const keys = type !== 1 && type !== 0 ? ['fullName', 'email', 'enabledStatus'] : (type === 0 ?['fullName', 'email', 'propertyName', 'enabledStatus'] : ['fullName', 'email', 'unitIds', 'enabledStatus']);

    const apiResponse = rowData;

    exportToXlsx(headers, keys, apiResponse, 'Users.xlsx');
  }

  const handleClickOutside = (event: any) => {
    // If the click is outside the div, hide the div
    if (displayRef.current && !displayRef.current.contains(event.target)) {
        setApplyDisplay(false);
    }
  };

  useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      // Cleanup the event listener when the component unmounts
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  return (
    <>
      {/* User Management page  */}
      <div className="common-right-panel-section usermanager_wrap">
          <div className="top-right-bar">
            <Breadcrumb>
              <Breadcrumb.Item href="#">User Manager</Breadcrumb.Item>
              <Breadcrumb.Item active>{type === 1 ? 'Owners' : (type === 3 ? 'Renters' : (type === 2 ? 'Attache Users' : (type === 0 ? 'Current Guests': 'All Users')))}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="heading _bottom-tabs-space">
              <h1>User Manager</h1>
            </div>
          </div>
        
          <>
            <div className="mid-content-section">
              <Tabs
                activeKey={activeKey}
                onSelect={handleSelect}
                id="fill-tab-example"
                className="mb-3"
                fill
              >
                <Tab eventKey="allUser" title="All User">
                  <div className="table-action-content">
                    <div className="show_count_info">
                      <div className="divshow">Show</div>
                       <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                        {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                        {
                            applyDisplay ?
                              <>
                                  <div className="drop-text-display scrollbar" >
                                      <ul>
                                          <li className={`${countText === 10 ? 'selected' : ''}`} onClick={() => changeData(10, 10)}>10</li>
                                          <li className={`${countText === 25 ? 'selected' : ''}`} onClick={() => changeData(25, 25)}>25</li>
                                          <li className={`${countText === 50 ? 'selected' : ''}`} onClick={() => changeData(50, 50)}>50</li>
                                          <li className={`${countText === 100 ? 'selected' : ''}`} onClick={() => changeData(100, 100)}>100</li>
                                          <li className={`${countText === 'All' ? 'selected' : ''}`} onClick={() => changeData(totalRows, 'All')}>All</li>
                                      </ul>
                                  </div>
                              </>
                              :
                            null
                        }
                      </div>
                    </div>
                    <div className="suggested-tab" onClick={(e) => exportData(e)}>
                        Export
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" activeTab={activeTab} />
                    </div>
                  </div>
                  <div className="table-section-common">
                    <Table responsive className="table-3-column">
                      <thead>
                        <tr>
                          <th>
                            <div className="th-data">
                              Username
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('fullName') ? 'active' : ''}`} onClick={()=>doSort('fullName')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Email 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('email') ? 'active' : ''}`} onClick={()=>doSort('email')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Enabled
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`} onClick={()=>doSort('status')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {
                        loader ?
                        <div className="spinner-wrapper"><Spinner /></div> 
                          
                        :
                        <tbody>
                          {
                            rowData.length > 0 ?
                            <>
                              {rowData.map((data: any, key: any) => (
                                  <tr key={key}>
                                      <td>
                                        <div className="t-user" onClick={() => navigateToEdit(data?._id, (data?.userRole ? (data?.userRole === 0 ? 1 : data?.userRole) : type))}>
                                          <div className="t-user-icon">
                                            <img src={tuserIcon} alt="icon" />
                                          </div>
                                          <div className="t-user-info">{data?.fullName}</div>
                                        </div>
                                      </td>
                                      <td>{data.email}</td>
                                      <td>
                                        <div className={`t-user _action ${data?.status === 1 ? '' : '_not'}`}>
                                          <div className="t-user-icon">
                                            <img src={data?.status === 1 ? greenIcon : crossIcon} alt="icon" />
                                          </div>
                                          <div className="t-user-info">{data?.enabledStatus}</div>
                                        </div>
                                      </td>
                                  </tr>
                              ))}
                            </>
                            :
                            <NoData />
                          }
                        </tbody>
                      }
                    </Table>
                  </div>
                  {
                    totalRows > 0 && type !== 0 ?
                    <div className="custom-pagination container container-fluid mt-4">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        activeClassName={"active"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel=""
                        renderOnZeroPageCount={null}
                        forcePage={pageNumber - 1}
                      />
                    </div>
                    :
                    null
                  }
                </Tab>

                <Tab eventKey="currentGuests" title="Current/ Future Guests">
                  <div className="table-action-content">
                  <div className="show_count_info">
                      <div className="divshow">Show</div>
                      <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                        {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                        {
                            applyDisplay ?
                                <>
                                    <div className="drop-text-display scrollbar" >
                                      <ul>
                                          <li className={`${countText === 10 ? 'selected' : ''}`} onClick={() => changeData(10, 10)}>10</li>
                                          <li className={`${countText === 25 ? 'selected' : ''}`} onClick={() => changeData(25, 25)}>25</li>
                                          <li className={`${countText === 50 ? 'selected' : ''}`} onClick={() => changeData(50, 50)}>50</li>
                                          <li className={`${countText === 100 ? 'selected' : ''}`} onClick={() => changeData(100, 100)}>100</li>
                                          <li className={`${countText === 'All' ? 'selected' : ''}`} onClick={() => changeData(totalRows, 'All')}>All</li>
                                      </ul>
                                    </div>
                                </>
                                :
                                null
                        }
                      </div>
                    </div>
                    <div className="suggested-tab" onClick={(e) => exportData(e)}>
                        Export
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" activeTab={activeTab} />
                    </div>
                    {/* <button className="btn primary" onClick={navigateToCreate}>
                        <img src={plusWhite} alt="Icon" /> Add User
                    </button> */}
                  </div>
                  <div className="table-section-common">
                    <Table responsive className="table-4-column">
                      <thead>
                        <tr>
                          <th>
                            <div className="th-data">
                              Username
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('fullName') ? 'active' : ''}`} onClick={()=>doSort('fullName')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Email 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('email') ? 'active' : ''}`} onClick={()=>doSort('email')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Property 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('property') ? 'active' : ''}`} onClick={()=>doSort('property')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Enabled
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`} onClick={()=>doSort('status')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      
                      {
                        loader ?
                        <div className="spinner-wrapper"><Spinner /></div> 
                          
                        :
                        <tbody>
                          {
                            rowData.length > 0 ?
                            <>
                              {rowData.map((data: any, key: any) => (
                                <tr key={key}>
                                  <td>
                                    <div className="t-user" onClick={() => navigateToEdit(data?._id, type)}>
                                      <div className="t-user-icon">
                                        <img src={tuserIcon} alt="icon" />
                                      </div>
                                      <div className="t-user-info">{data?.fullName}</div>
                                    </div>
                                  </td>
                                  <td>{data.email}</td>
                                  <td>
                                    <div className="t-user">
                                      <div className="t-user-icon">
                                        <img src={buildingIcon} alt="icon" />
                                      </div>
                                      <div className="t-user-info">{data?.propertyName}</div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className={`t-user _action ${data?.status === 1 ? '' : '_not'}`}>
                                        <div className="t-user-icon">
                                          <img src={data?.status === 1 ? greenIcon : crossIcon} alt="icon" />
                                        </div>
                                        <div className="t-user-info">{data?.enabledStatus}</div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </>
                            :
                            <NoData />
                          }
                        </tbody>
                      }
                    </Table>
                  </div>
                  {
                    totalRows > 0 && type === 0 ?
                    <div className="custom-pagination container container-fluid mt-4">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        activeClassName={"active"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel=""
                        renderOnZeroPageCount={null}
                        forcePage={pageNumber - 1}
                      />
                    </div>
                    :
                    null
                  }
                </Tab>

                <Tab eventKey="owners" title="Owners">
                  <div className="table-action-content">
                  <div className="show_count_info">
                      <div className="divshow">Show</div>
                       <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                        {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                        {
                            applyDisplay ?
                                <>
                                    <div className="drop-text-display scrollbar" >
                                      <ul>
                                          <li className={`${countText === 10 ? 'selected' : ''}`} onClick={() => changeData(10, 10)}>10</li>
                                          <li className={`${countText === 25 ? 'selected' : ''}`} onClick={() => changeData(25, 25)}>25</li>
                                          <li className={`${countText === 50 ? 'selected' : ''}`} onClick={() => changeData(50, 50)}>50</li>
                                          <li className={`${countText === 100 ? 'selected' : ''}`} onClick={() => changeData(100, 100)}>100</li>
                                          <li className={`${countText === 'All' ? 'selected' : ''}`} onClick={() => changeData(totalRows, 'All')}>All</li>
                                      </ul>
                                    </div>
                                </>
                                :
                                null
                        }
                      </div>
                    </div>
                    <div className="suggested-tab" onClick={(e) => exportData(e)}>
                        Export
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" activeTab={activeTab} />
                    </div>
                    {/* <button className="btn primary" onClick={navigateToCreate}>
                        <img src={plusWhite} alt="Icon" /> Add User
                    </button> */}
                  </div>
                  <div className="table-section-common">
                    <Table responsive className="table-3-column">
                      <thead>
                        <tr>
                          <th>
                            <div className="th-data">
                              Username
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('fullName') ? 'active' : ''}`} onClick={()=>doSort('fullName')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Email 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('email') ? 'active' : ''}`} onClick={()=>doSort('email')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Property 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`} onClick={()=>doSort('property')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Enabled
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`} onClick={()=>doSort('status')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {
                        loader ?
                        <div className="spinner-wrapper"><Spinner /></div> 
                        :
                        <tbody>
                          {
                            rowData.length > 0 ?
                            <>
                            {rowData.map((data: any, key: any) => (
                              <tr key={key}>
                                <td>
                                  <div className="t-user" onClick={() => navigateToEdit(data?._id, type)}>
                                    <div className="t-user-icon">
                                      <img src={tuserIcon} alt="icon" />
                                    </div>
                                    <div className="t-user-info">{data?.fullName}</div>
                                  </div>
                                </td>
                                <td>{data?.email}</td>
                                <td>
                                  {data?.unitIds ? data?.unitIds.length : 0}
                                </td>
                                <td>
                                  <div className={`t-user _action ${data?.status === 1 ? '' : '_not'}`}>
                                    <div className="t-user-icon">
                                      <img src={data?.status === 1 ? greenIcon : crossIcon} alt="icon" />
                                    </div>
                                    <div className="t-user-info">{data?.enabledStatus}</div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            </>
                            :
                            <NoData />
                          }
                        </tbody>
                      }
                    </Table>
                  </div>
                  {
                    totalRows > 0 && type !== 0 ?
                    <div className="custom-pagination container container-fluid mt-4">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        activeClassName={"active"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel=""
                        renderOnZeroPageCount={null}
                        forcePage={pageNumber - 1}
                      />
                    </div>
                    :
                    null
                  }
                </Tab>

                <Tab eventKey="attache" title="Attache">
                  <div className="table-action-content">
                    <div className="show_count_info">
                      <div className="divshow">Show</div>
                       <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                        {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                        {
                            applyDisplay ?
                                <>
                                    <div className="drop-text-display scrollbar" >
                                        <ul>
                                            <li className={`${countText === 10 ? 'selected' : ''}`} onClick={() => changeData(10, 10)}>10</li>
                                            <li className={`${countText === 25 ? 'selected' : ''}`} onClick={() => changeData(25, 25)}>25</li>
                                            <li className={`${countText === 50 ? 'selected' : ''}`} onClick={() => changeData(50, 50)}>50</li>
                                            <li className={`${countText === 100 ? 'selected' : ''}`} onClick={() => changeData(100, 100)}>100</li>
                                            <li className={`${countText === 'All' ? 'selected' : ''}`} onClick={() => changeData(totalRows, 'All')}>All</li>
                                        </ul>
                                    </div>
                                </>
                                :
                                null
                        }
                      </div>
                    </div>
                    <div className="suggested-tab" onClick={(e) => exportData(e)}>
                        Export
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" activeTab={activeTab} />
                    </div>
                    {/* <button className="btn primary" onClick={navigateToCreate}>
                        <img src={plusWhite} alt="Icon" /> Add User
                    </button> */}
                  </div>
                  <div className="table-section-common">
                    <Table responsive className="table-3-column">
                      <thead>
                        <tr>
                          <th>
                            <div className="th-data">
                              Username
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('fullName') ? 'active' : ''}`} onClick={()=>doSort('fullName')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Email 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('email') ? 'active' : ''}`} onClick={()=>doSort('email')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Enabled
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`} onClick={()=>doSort('status')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {
                        loader ?
                        <div className="spinner-wrapper"><Spinner /></div>
                        :
                        <tbody>
                          {
                            rowData.length > 0 ?
                            <>
                            {rowData.map((data: any, key: any) => (
                                <tr key={key}>
                                    <td>
                                      <div className="t-user" onClick={() => navigateToEdit(data?._id, type)}>
                                        <div className="t-user-icon">
                                          <img src={tuserIcon} alt="icon" />
                                        </div>
                                        <div className="t-user-info">{data?.fullName}</div>
                                      </div>
                                    </td>
                                    <td>{data.email}</td>
                                    <td>
                                      <div className={`t-user _action ${data?.status === 1 ? '' : '_not'}`}>
                                        <div className="t-user-icon">
                                          <img src={data?.status === 1 ? greenIcon : crossIcon} alt="icon" />
                                        </div>
                                        <div className="t-user-info">{data?.enabledStatus}</div>
                                      </div>
                                    </td>
                                </tr>
                            ))}
                            </>
                            :
                            <NoData />
                          }

                        </tbody>
                                    
                      }
                    </Table>
                  </div>
                  {
                    totalRows > 0 && type !== 0 ?
                    <div className="custom-pagination container container-fluid mt-4">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        activeClassName={"active"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel=""
                        forcePage={pageNumber - 1}
                      />
                    </div>
                    :
                    null
                  }
                </Tab>

                <Tab eventKey="renters" title="All Renters"> 
                  <div className="table-action-content">
                  <div className="show_count_info">
                      <div className="divshow">Show</div>
                       <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                        {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                        {
                            applyDisplay ?
                                <>
                                    <div className="drop-text-display scrollbar" >
                                        <ul>
                                              <li className={`${countText === 10 ? 'selected' : ''}`} onClick={() => changeData(10, 10)}>10</li>
                                              <li className={`${countText === 25 ? 'selected' : ''}`} onClick={() => changeData(25, 25)}>25</li>
                                              <li className={`${countText === 50 ? 'selected' : ''}`} onClick={() => changeData(50, 50)}>50</li>
                                              <li className={`${countText === 100 ? 'selected' : ''}`} onClick={() => changeData(100, 100)}>100</li>
                                              <li className={`${countText === 'All' ? 'selected' : ''}`} onClick={() => changeData(totalRows, 'All')}>All</li>
                                        </ul>
                                    </div>
                                </>
                                :
                                null
                        }
                      </div>
                    </div>
                    <div className="suggested-tab" onClick={(e) => exportData(e)}>
                        Export
                    </div>
                    <div className="_search-bar">
                      <SearchBar placeHolder="Search" activeTab={activeTab} />
                    </div>
                    <button className="btn primary" onClick={navigateToCreate}>
                        <img src={plusWhite} alt="Icon" /> Add User
                    </button>
                  </div>
                  <div className="table-section-common">
                    <Table responsive className="table-3-column">
                      <thead>
                        <tr>
                          <th>
                            <div className="th-data">
                              Username
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('fullName') ? 'active' : ''}`} onClick={()=>doSort('fullName')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Email 
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('email') ? 'active' : ''}`} onClick={()=>doSort('email')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                          <th>
                            <div className="th-data">
                              Enabled
                              <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`} onClick={()=>doSort('status')}>
                                <img src={sortIcon} alt="sort" />
                              </div>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      {
                        loader ?
                        <div className="spinner-wrapper"><Spinner /></div> 
                          
                        :
                        <tbody>
                          {
                            rowData.length > 0 ?
                            <>
                              {rowData.map((data: any, key: any) => (
                                <tr key={key}>
                                    <td>
                                      <div className="t-user" onClick={() => navigateToEdit(data?._id, type)}>
                                        <div className="t-user-icon">
                                          <img src={tuserIcon} alt="icon" />
                                        </div>
                                        <div className="t-user-info">{data?.fullName}</div>
                                      </div>
                                    </td>
                                    <td>{data.email}</td>
                                    <td>
                                      <div className={`t-user _action ${data?.status === 1 ? '' : '_not'}`}>
                                        <div className="t-user-icon">
                                          <img src={data?.status === 1 ? greenIcon : crossIcon} alt="icon" />
                                        </div>
                                        <div className="t-user-info">{data?.enabledStatus}</div>
                                      </div>
                                    </td>
                                </tr>
                              ))}
                            </>
                            :
                            <NoData />
                          }
                        </tbody>
                      }
                    </Table>
                  </div>
                  {
                    totalRows > 0 && type !== 0 ?
                    <div className="custom-pagination container container-fluid mt-4">
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel=""
                        activeClassName={"active"}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel=""
                        renderOnZeroPageCount={null}
                        forcePage={pageNumber - 1}
                      />
                    </div>
                    :
                    null
                  }
                </Tab>
              </Tabs>
            </div>
          </>
      </div>
      {/* User Management page End  */}
    </>
  );
};

export default UserManagerList;
