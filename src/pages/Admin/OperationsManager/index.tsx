import { useEffect, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { property } from "../../../api";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import SortAscending from "../../../assets/images/SortAscending.svg";
import SortDscending from "../../../assets/images/SortDscending.svg";
import checkgrey from "../../../assets/images/checkgrey.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import { BATHROOM_OPTIONS, DEFAULT_OFFSET } from "../../../constants";
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../components/SearchBar";
import displayIcon from "../../../assets/images/display.svg";
import plusWhite from "../../../assets/images/plus-white.svg";
import IconBook from "../../../assets/images/IconBook.svg";
import greenIcon from "../../../assets/images/green-tick.svg";
import crossIcon from "../../../assets/images/crossx.svg";
import buildingIcon from "../../../assets/images/building.svg";


import "ag-grid-community/styles/ag-grid.css";
const INTIAL_OFFSET = 10;

export default function OperationsManagerList() {
    const navigate = useNavigate();
    const [currentItems, setCurrentItems] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalProperties, setTotalProperties] = useState(1);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(false);

    function createLeases() {
        navigate(ROUTE_NAVIGATION_PATH.ADD_LEASING);
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
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Operations Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Reservations</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <div className="guest-left">
                            <h1>Reservations</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
                    <div className="table-action-content">
                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                        {/* <button className="btn primary" onClick={createLeases}>
                            <img src={plusWhite} alt="Icon" /> New Lease
                        </button> */}
                    </div>

                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th><div className="th-data">Property <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                    <th>
                                        <div className="th-data">Primary Guest </div>
                                    </th>
                                    <th><div className="th-data">Type<div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                    <th><div className="th-data">Arrival <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                    <th><div className="th-data">Departure <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                    <th><div className="th-data">Daily/Nightly Rate <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                    <th><div className="th-data">Parking <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>
                                    <th><div className="th-data">Pets Allowed <div className="sort-table"><img src={sortIcon} alt="sort" /></div></div></th>

                                </tr>
                            </thead>
                            <tbody>

                                <tr>
                                    <td>
                                        <div className="t-user">
                                            <div className="t-user-icon">
                                                <img src={buildingIcon} alt="icon" />
                                            </div>
                                            <div className="t-user-info">2715 Ash Dr. San Jose</div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className="_blue">Ralph Edwards</span>
                                        <p className="_font">felicia.reid@example.com</p>
                                    </td>
                                    <td>
                                        Departure
                                    </td>
                                    <td>
                                        November 28, 2015
                                    </td>
                                    <td>November 28, 2015</td>
                                    <td>$169.43</td>
                                    <td>
                                        <div className="t-user _action">
                                            <div className="t-user-icon">
                                                <img src={greenIcon} alt="icon" />
                                            </div>
                                            <div className="t-user-info">Yes</div>
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

                                </tr>

                            </tbody>
                        </Table>
                    </div>



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
