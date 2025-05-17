import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import checkgrey from "../../../assets/images/checkgrey.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import downArrow from "../../../assets/images/down-arrow.png";
import InvoiceIcon from "../../../assets/images/Invoice.svg";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import { property } from "../../../api";
import { BATHROOM_OPTIONS, DEFAULT_OFFSET } from "../../../constants";
import SearchBar from "../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
const INTIAL_OFFSET = 10;

export default function PaymentList() {
    const navigate = useNavigate();
    const [currentItems, setCurrentItems] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalProperties, setTotalProperties] = useState(1);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(false);
    const [amenitiesList, setAmenitiesList] = useState<any>(BATHROOM_OPTIONS);

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
                        <Breadcrumb.Item href="#">Account Receivables</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading _bottom-tabs-space">
                        <div className="guest-left">
                            <h1>Payments</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section">
                    <Tabs
                        defaultActiveKey="AccountReceivables"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="AccountReceivables" title="Account Receivables">
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
                                                <div className="th-data">Due Date <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Id <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Primary Guest

                                                </div>
                                            </th>
                                            <th><div className="th-data">Alternative Name <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Aging <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Total Due <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Lease <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Status <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>November 28, 2015</td>

                                            <td>
                                                <div className="t-user">
                                                    <div className="t-user-icon">
                                                        <img src={InvoiceIcon} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">79843</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Albert Flores</span>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                432
                                            </td>
                                            <td>
                                                $169.43
                                            </td>
                                            <td>
                                                <span className="_blue ">6391 Elgin St. Celina, Delaware 10299</span>

                                            </td>
                                            <td>
                                                <span className="_blue ">897886</span>

                                            </td>
                                            <td>
                                                <div className="action-tab clicknone">
                                                    <button className="table-button _approved">Paid</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>November 28, 2015</td>

                                            <td>
                                                <div className="t-user">
                                                    <div className="t-user-icon">
                                                        <img src={InvoiceIcon} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">79843</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Albert Flores</span>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                432
                                            </td>
                                            <td>
                                                $169.43
                                            </td>
                                            <td>
                                                <span className="_blue ">6391 Elgin St. Celina, Delaware 10299</span>

                                            </td>
                                            <td>
                                                <span className="_blue ">897886</span>

                                            </td>
                                            <td>
                                                <div className="action-tab clicknone">
                                                    <button className="table-button _revised">Issued</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>November 28, 2015</td>

                                            <td>
                                                <div className="t-user">
                                                    <div className="t-user-icon">
                                                        <img src={InvoiceIcon} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">79843</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="_blue ">Albert Flores</span>
                                            </td>
                                            <td>None</td>
                                            <td>
                                                432
                                            </td>
                                            <td>
                                                $169.43
                                            </td>
                                            <td>
                                                <span className="_blue ">6391 Elgin St. Celina, Delaware 10299</span>

                                            </td>
                                            <td>
                                                <span className="_blue ">897886</span>

                                            </td>
                                            <td>
                                                <div className="action-tab clicknone">
                                                    <button className="table-button _pendingblue">Partially Paid</button>
                                                </div>
                                            </td>
                                        </tr>



                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey="AccountsPayable" title="Accounts Payable">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>
                                <div className="table-section-common">

                                    <Table responsive className="">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <div className="th-data">UUID <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                                </th>
                                                <th><div className="th-data">AP Vendor <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th>
                                                    <div className="th-data">Invoice Due Date

                                                    </div>
                                                </th>
                                                <th><div className="th-data">Invoice Paid Date <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th><div className="th-data">Bill Due Date <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th><div className="th-data">Aging <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th><div className="th-data firstchild">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th><div className="th-data">Ammount <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th><div className="th-data">Lease <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                                <th className="stickycolumn"><div className="th-data">Paid <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>

                                                <td>
                                                    <div className="t-user">
                                                        <div className="t-user-icon">
                                                            <img src={InvoiceIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-user-info">79843</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="_blue ">Albert Flores</span>
                                                </td>
                                                <td>November 28, 2015</td>

                                                <td>November 28, 2015</td>
                                                <td>
                                                    November 28, 2015
                                                </td>
                                                <td>
                                                    455
                                                </td>

                                                <td>
                                                    <span className="_blue ">6391 Elgin St. Celina, Delaware 10299</span>

                                                </td>
                                                <td>
                                                    $169.43
                                                </td>
                                                <td>
                                                    <span className="_blue ">897886</span>

                                                </td>
                                                <td className="stickycolumn">
                                                    <div className="action-tab active">
                                                        <button className="table-button _approved">Paid</button>
                                                        <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                        <div className="drop-text-action">
                                                            <div className="hdtext">Status</div>
                                                            <ul>
                                                                <li className="active"> <button className="table-button _approved">Paid</button> <img src={checkgrey} alt="" /></li>
                                                                <li> <button className="table-button _revised">Unpaid</button></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>

                                                <td>
                                                    <div className="t-user">
                                                        <div className="t-user-icon">
                                                            <img src={InvoiceIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-user-info">79843</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="_blue ">Albert Flores</span>
                                                </td>
                                                <td>November 28, 2015</td>

                                                <td>November 28, 2015</td>
                                                <td>
                                                    November 28, 2015
                                                </td>
                                                <td>
                                                    455
                                                </td>

                                                <td>
                                                    <span className="_blue ">6391 Elgin St. Celina, Delaware 10299</span>

                                                </td>
                                                <td>
                                                    $169.43
                                                </td>
                                                <td>
                                                    <span className="_blue ">897886</span>

                                                </td>
                                                <td className="stickycolumn">
                                                    <div className="action-tab active">
                                                        <button className="table-button _revised">UnPaid</button>
                                                        <img className="arrowdown" src={downArrow} alt="Arrow" />
                                                    </div>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </Table>
                                </div>

                            </div>



                        </Tab>
                        <Tab eventKey="Insights" title="Insights">
                            <div className="table-action-content">
                                <div className="_search-bar">
                                    <SearchBar placeHolder="Search" />
                                </div>

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
