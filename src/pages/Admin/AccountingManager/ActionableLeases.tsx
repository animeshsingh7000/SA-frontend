import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import checkgrey from "../../../assets/images/checkgrey.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import downArrow from "../../../assets/images/down-arrow.png";
import IconBook from "../../../assets/images/IconBook.svg";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import "ag-grid-community/styles/ag-grid.css";
import { property } from "../../../api";
import { BATHROOM_OPTIONS, DEFAULT_OFFSET } from "../../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import SearchBar from "../../../components/SearchBar";
const INTIAL_OFFSET = 10;

export default function AccountingManagerList() {
    const navigate = useNavigate();
    const [currentItems, setCurrentItems] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalProperties, setTotalProperties] = useState(1);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(false);
    const [amenitiesList, setAmenitiesList] = useState<any>(BATHROOM_OPTIONS);

    function viewLeases() {
        //navigate(ROUTE_NAVIGATION_PATH.VIEW_LEASE_LIST);
    }



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


    return (
        <>

            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Accounting Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Actionable</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading _bottom-tabs-space">
                        <div className="guest-left">
                            <h1>Actionable Leases</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section">
                    <Tabs
                        defaultActiveKey="Actionable"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="Actionable" title="Actionable">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>

                            </div>
                            <div className="table-section-common">

                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Primary Guest <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Alternative Name

                                                </div>
                                            </th>
                                            <th><div className="th-data">Arrival <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Created <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Status <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={() => viewLeases()}>
                                                    <div className="t-user-icon">
                                                        <img src={IconBook} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Jacob Jones</span>
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                15 May 2020 9:00 am
                                            </td>
                                            <td>
                                                <div className="action-tab active">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                    <div className="drop-text-action">
                                                        <div className="hdtext">Status</div>
                                                        <ul>
                                                            <li> <button className="table-button _approved">Completed</button> <img src={checkgrey} alt="" /></li>
                                                            <li> <button className="table-button _pendingblue">Pending</button></li>
                                                            <li> <button className="table-button _pendingyellow">In Progress</button></li>
                                                            <li> <button className="table-button _revised">Revised</button></li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={() => viewLeases()}>
                                                    <div className="t-user-icon">
                                                        <img src={IconBook} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Jacob Jones</span>
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                15 May 2020 9:00 am
                                            </td>
                                            <td>
                                                <div className="action-tab">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey="New" title="New">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>

                            </div>
                            <div className="table-section-common">

                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Primary Guest <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Alternative Name

                                                </div>
                                            </th>
                                            <th><div className="th-data">Arrival <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Created <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Status <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={() => viewLeases()}>
                                                    <div className="t-user-icon">
                                                        <img src={IconBook} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Jacob Jones</span>
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                15 May 2020 9:00 am
                                            </td>
                                            <td>
                                                <div className="action-tab active">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                    <div className="drop-text-action">
                                                        <div className="hdtext">Status</div>
                                                        <ul>
                                                            <li> <button className="table-button _approved">Completed</button> <img src={checkgrey} alt="" /></li>
                                                            <li> <button className="table-button _pendingblue">Pending</button></li>
                                                            <li> <button className="table-button _pendingyellow">In Progress</button></li>
                                                            <li> <button className="table-button _revised">Revised</button></li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </Table>
                            </div>


                        </Tab>
                        <Tab eventKey="Revised" title="Revised">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>

                            </div>
                            <div className="table-section-common">

                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Primary Guest <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Alternative Name

                                                </div>
                                            </th>
                                            <th><div className="th-data">Arrival <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Created <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Status <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={() => viewLeases()}>
                                                    <div className="t-user-icon">
                                                        <img src={IconBook} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Jacob Jones</span>
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                15 May 2020 9:00 am
                                            </td>
                                            <td>
                                                <div className="action-tab active">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                    <div className="drop-text-action">
                                                        <div className="hdtext">Status</div>
                                                        <ul>
                                                            <li> <button className="table-button _approved">Completed</button> <img src={checkgrey} alt="" /></li>
                                                            <li> <button className="table-button _pendingblue">Pending</button></li>
                                                            <li> <button className="table-button _pendingyellow">In Progress</button></li>
                                                            <li> <button className="table-button _revised">Revised</button></li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </Table>
                            </div>


                        </Tab>
                        <Tab eventKey="LeaseProgress" title="Lease in Progress">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>

                            </div>
                            <div className="table-section-common">

                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Primary Guest <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Alternative Name

                                                </div>
                                            </th>
                                            <th><div className="th-data">Arrival <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Created <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Status <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={() => viewLeases()}>
                                                    <div className="t-user-icon">
                                                        <img src={IconBook} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Jacob Jones</span>
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                15 May 2020 9:00 am
                                            </td>
                                            <td>
                                                <div className="action-tab active">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                    <div className="drop-text-action">
                                                        <div className="hdtext">Status</div>
                                                        <ul>
                                                            <li> <button className="table-button _approved">Completed</button> <img src={checkgrey} alt="" /></li>
                                                            <li> <button className="table-button _pendingblue">Pending</button></li>
                                                            <li> <button className="table-button _pendingyellow">In Progress</button></li>
                                                            <li> <button className="table-button _revised">Revised</button></li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </Table>
                            </div>


                        </Tab>
                        <Tab eventKey="Completed" title="Completed">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>

                            </div>
                            <div className="table-section-common">

                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Primary Guest <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Alternative Name

                                                </div>
                                            </th>
                                            <th><div className="th-data">Arrival <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Created <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Status <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="t-user" onClick={() => viewLeases()}>
                                                    <div className="t-user-icon">
                                                        <img src={IconBook} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Jacob Jones</span>
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                May 12, 2019
                                            </td>
                                            <td>
                                                15 May 2020 9:00 am
                                            </td>
                                            <td>
                                                <div className="action-tab active">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                    <div className="drop-text-action">
                                                        <div className="hdtext">Status</div>
                                                        <ul>
                                                            <li> <button className="table-button _approved">Completed</button> <img src={checkgrey} alt="" /></li>
                                                            <li> <button className="table-button _pendingblue">Pending</button></li>
                                                            <li> <button className="table-button _pendingyellow">In Progress</button></li>
                                                            <li> <button className="table-button _revised">Revised</button></li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </Table>
                            </div>


                        </Tab>

                    </Tabs>

                    <div className="custom-pagination container container-fluid pt-2">
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
                </div>

            </div>

        </>
    );
}
