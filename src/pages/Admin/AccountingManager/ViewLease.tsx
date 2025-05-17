import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import checkgrey from "../../../assets/images/checkgrey.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import buildingIcon from "../../../assets/images/building.svg";
import userIcon from "../../../assets/images/User-Fill.svg";
import redirectIcon from "../../../assets/images/Redirect.svg";
import proImg from "../../../assets/images/slider-image.png";
import downArrow from "../../../assets/images/down-arrow.png";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import "ag-grid-community/styles/ag-grid.css";
import { property } from "../../../api";
import { BATHROOM_OPTIONS, DEFAULT_OFFSET } from "../../../constants";
const INTIAL_OFFSET = 10;


const ViewLeaseList: React.FC = () => {

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

            <div className="common-right-panel-section _edit-property-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Accounting Manager</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">Actionable</Breadcrumb.Item>
                        <Breadcrumb.Item className="active">View Lease</Breadcrumb.Item>


                    </Breadcrumb>
                    <div className="heading guest-header _bottom-tabs-space">
                        <div className="guest-left w-100">
                            <div className="property-top-detail">
                                <div className="pro-thumb">
                                    <img src={proImg} alt="Image" />
                                </div>
                                <div className="pro-desc-top">
                                    <h2>Lease</h2>
                                    <h1>10 Ashby Street Unit D, Alexandria, VA 22305</h1>
                                    <div className="register">Registered on -</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section">
                    <Tabs
                        defaultActiveKey="BillingSchedule"
                        id="fill-tab-example"
                        className="mb-3"
                        fill
                    >
                        <Tab eventKey="BillingSchedule" title="Billing Schedule">

                            <div className="table-section-common">

                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="th-data firstchild">Line Item <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div>
                                            </th>
                                            <th><div className="th-data">Guest Pays <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th>
                                                <div className="th-data">Owner Due

                                                </div>
                                            </th>
                                            <th><div className="th-data">Diff <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                            <th><div className="th-data">Accrued <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Per diem for June 21, 2024 - July 20, 2024 (based on 10 nights at $258.00 per night and 20 nights at $176.00 per night):
                                            </td>

                                            <td>$6,100.00</td>
                                            <td>
                                                $6,100.00
                                            </td>
                                            <td>
                                                $6,100.00
                                            </td>
                                            <td>
                                                $6,100.00
                                            </td>

                                        </tr>

                                    </tbody>
                                </Table>
                            </div>
                        </Tab>

                        <Tab eventKey="AccountingLog" title="Accounting Log">
                            <div className="table-section-common">
                                <Table responsive className="">
                                    <thead>
                                        <tr>
                                            <th><div className="th-data">Action</div></th>

                                            <th>
                                                <div className="th-data">Logged At</div>
                                            </th>
                                            <th>
                                                <div className="th-data firstchild">Data

                                                </div>
                                            </th>
                                            <th><div className="th-data">User</div></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <li> <button className="table-button _revised">Update</button></li>

                                            </td>
                                            <td>
                                                August 24, 2013
                                                <p className="_font">8: 20 am</p>
                                            </td>
                                            <td>
                                                Per diem for June 21, 2024 - July 20, 2024 (based on 10 nights at $258.00 per night and 20 nights at $176.00 per night):
                                            </td>


                                            <td>
                                                nevaeh.simmons@example.com
                                            </td>


                                        </tr>
                                        <tr>
                                            <td>
                                                <li> <button className="table-button _revised">Update</button></li>

                                            </td>
                                            <td>
                                                August 24, 2013
                                                <p className="_font">8: 20 am</p>
                                            </td>
                                            <td>
                                                Per diem for June 21, 2024 - July 20, 2024 (based on 10 nights at $258.00 per night and 20 nights at $176.00 per night):
                                            </td>


                                            <td>
                                                nevaeh.simmons@example.com
                                            </td>


                                        </tr>

                                    </tbody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab eventKey="Details" title="Details">
                            <div className="table-section-common">
                                <div className="lease-card-detail scrollbar">
                                    <div className="card-left-content">
                                        <div className="card-grid">
                                            <div className="infoheading">General Information</div>
                                            <div className="property-info">
                                                <div className="label-tag">Property</div>
                                                <div className="t-user">
                                                    <div className="t-user-icon">
                                                        <img src={buildingIcon} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">1901 Thornridge Cir. Shiloh</div>
                                                </div>
                                            </div>
                                            <div className="property-info">
                                                <div className="label-tag">Accounting Status</div>
                                                <div className="action-tab active">
                                                    <button className="table-button _pendingblue">Pending</button>
                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />

                                                    <div className="drop-text-action">
                                                        <div className="hdtext">Status</div>
                                                        <ul>
                                                            <li className="active"> <button className="table-button _approved ">Completed</button> <img src={checkgrey} alt="" /></li>
                                                            <li> <button className="table-button _pendingblue">Pending</button></li>
                                                            <li> <button className="table-button _pendingyellow">In Progress</button></li>
                                                            <li> <button className="table-button _revised">Revised</button></li>


                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="property-info">
                                                <div className="w-50">
                                                    <div className="label-tag">Created on</div>
                                                    <p>Aug 20, 2024</p>
                                                </div>
                                                <div className="w-50">
                                                    <div className="label-tag">Created on</div>
                                                    <p>---</p>
                                                </div>

                                            </div>

                                        </div>
                                        <div className="card-grid">
                                            <div className="infoheading">Property Owner Info</div>
                                            <div className="property-info">
                                                <div className="w-50">
                                                    <div className="label-tag">Owner</div>
                                                    <div className="t-user">
                                                        <div className="t-user-icon">
                                                            <img src={userIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-user-info">John Doe</div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="label-tag">Email</div>
                                                    <div className="t-user">

                                                        <div className="t-user-info w-100">Johndoe@gmail.com</div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="property-info">
                                                <div className="w-50">
                                                    <div className="label-tag">Phone</div>
                                                    <p>231-564-7890 (Ellen)</p>
                                                    <p>231-564-7890 (Peter)</p>
                                                    <p>231-564-7890</p>

                                                </div>
                                                <div className="w-50">
                                                    <div className="label-tag">Property Manager Rate</div>
                                                    <p>10%</p>
                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                    <div className="card-left-content">
                                        <div className="card-grid">
                                            <div className="infoheading">Primary Guest Info</div>
                                            <div className="property-info">
                                                <div className="w-50">
                                                    <div className="label-tag">Guest</div>
                                                    <div className="t-user">
                                                        <div className="t-user-icon">
                                                            <img src={userIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-user-info">John Doe</div>
                                                    </div>
                                                </div>
                                                <div className="w-50">
                                                    <div className="label-tag">Email</div>
                                                    <div className="t-user">

                                                        <div className="t-user-info w-100">Johndoe@gmail.com</div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="property-info">
                                                <div className="w-100">
                                                    <div className="label-tag">Phone</div>
                                                    <div className="t-user">
                                                        <div className="t-user-icon">
                                                            <img src={redirectIcon} alt="icon" />
                                                        </div>
                                                        <div className="t-user-info">Phone NO</div>
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                        <div className="card-grid">
                                            <div className="infoheading">Arrival / Departure</div>
                                            <div className="property-info">
                                                <div className="w-50">
                                                    <div className="label-tag">Arrival</div>
                                                    <p>Aug 20, 2024</p>
                                                </div>
                                                <div className="w-50">
                                                    <div className="label-tag">Departure</div>
                                                    <p>Aug 20, 2024</p>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
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
export default ViewLeaseList;
