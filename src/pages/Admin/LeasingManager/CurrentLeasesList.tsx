import { useEffect, useRef, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import sortIcon from "../../../assets/images/Sort.svg";
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../components/SearchBar";
import displayIcon from "../../../assets/images/display.svg";
import plusWhite from "../../../assets/images/plus-white.svg";
import IconBook from "../../../assets/images/IconBook.svg";
import greenIcon from "../../../assets/images/green-tick.svg";
import crossIcon from "../../../assets/images/crossx.svg";
import downIcon from "../../../assets/images/arrowDown.svg";

import { CURRENT_LEASE_TABLE_COLUMNS } from "../../../constants/Filters";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components"; 
import "ag-grid-community/styles/ag-grid.css";
import { formatDate } from "../../../utils/common";
import { LEASE_TYPE_FILTER } from "../../../constants";
import { getAllLeaseList } from "../../../api/admin/lease";
import createXlsxExporter from "../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

export default function CurrentLeaseList() {
    const [rowData, setRowData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>();
    const [columns, setColumns] = useState(CURRENT_LEASE_TABLE_COLUMNS);
    const [count, setCount] = useState<number>(INTIAL_OFFSET);
    const [countText, setCountText] = useState<any>(null);
    const [applyExport, setApplyExport] = useState<any>(false);
    const exportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchParams.get("query") !== searchQuery) {
            setPageNumber(1);
            setSearchQuery(searchParams.get("query"));
        }
    }, [searchParams]);

    useEffect(() => {
        fetchData(pageNumber);
    }, [pageNumber, searchQuery, sortBy]);

    const pageCount = Math.ceil(totalRows / count);

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

    const fetchData = async (page:number, c?: number) => {
        setLoader(true);
        try {
            const payload = {
                count: c ? c : count,
                page,
                search: searchQuery,
                sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ leaseEndDate: 1 }),
                leaseType: LEASE_TYPE_FILTER.CURRENT
            }
            getAllLeaseList(payload).then((res) => {
                setLoader(false);
                setRowData(res.data);
                setTotalRows(res.count);
            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    };

    function toggleColumnVisibility(id: any) {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === id ? { ...col, visible: !col.visible } : col
            )
        );
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    function createLeases() {
        navigate(ROUTE_NAVIGATION_PATH.ADD_LEASING);
    }

    const handleClickOutside = (event: any) => {
        if (displayRef.current && !displayRef.current.contains(event.target)) {
            setApplyDisplay(false);
        }

        if (exportRef.current && !exportRef.current.contains(event.target)) {
            setApplyExport(false);
        }
    };

    const changeData = (value:number, text:any) => {
        setPageNumber(1);
        setCountText(text)
        setCount(value);
        fetchData(1, value); 
    }
    
    function exportData(e:any) {
        e.stopPropagation();
        const exportToXlsx = createXlsxExporter();
        const visibleColumns = CURRENT_LEASE_TABLE_COLUMNS.filter(col => col.visible);

        const headers = visibleColumns.map(col => col.label);
        const keys = visibleColumns.map(col => col.id);

        const apiResponse = rowData;
    
        exportToXlsx(headers, keys, apiResponse, 'Current_Leases.xlsx');
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Leasing Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Current Leases</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <div className="guest-left">
                            <h1>Current Leases</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
                    <div className="table-action-content">
                        <div className="show_count_info">
                            <div className="divshow">Show</div>
                            <div className="display-tab" onClick={() => setApplyExport(!applyExport)}>
                                {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                                {
                                    applyExport ?
                                        <>
                                            <div ref={exportRef} className="drop-text-display scrollbar" >
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
                        <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                            <img src={displayIcon} alt="display" /> Display
                            {
                                applyDisplay ?
                                <>
                                    <div ref={displayRef} className="drop-text-display scrollbar" >
                                        <div className="hdtext">Display</div>
                                        <ul>
                                            {columns.map((col: any, key: any) => (
                                                <li key={col.id} className={`${key === 0 ? 'selected' : ''}`}>
                                                    <div className="check-group commocheckbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={col.visible}
                                                            onChange={() => toggleColumnVisibility(col.id)}
                                                        />
                                                        <label htmlFor={key}>{col.label}</label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                                :
                                null
                            }
                        </div>
                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                        <button className="btn primary" onClick={createLeases}>
                            <img src={plusWhite} alt="Icon" /> New Lease
                        </button>
                    </div>

                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    {columns
                                        .filter((col) => col.visible)
                                        .map((col) => (
                                            <th key={col.id}>
                                                <div className="th-data">{col.label}
                                                    {
                                                        col.sortBy ?
                                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes(col.id) ? 'active' : ''}`} onClick={() => doSort(col.id)}>
                                                                <img src={sortIcon} alt="sort" />
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                            </th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            {
                                loader ?
                                <div className="spinner-wrapper"><Spinner /></div>
                                :
                                rowData.length > 0 ?
                                    <tbody>
                                        {rowData.map((data: any, key: any) => (
                                            <tr>
                                                {columns
                                                    .filter((col) => col.visible)
                                                    .map((col) => (
                                                        <td key={col.id}>

                                                            {
                                                                col.id === 'propertyName' ?
                                                                    <Link to={ROUTE_NAVIGATION_PATH.EDIT_LEASING + '/' + data._id + '/' + 1}>
                                                                        <div className="t-user">
                                                                            <div className="t-user-icon">
                                                                                <img src={IconBook} alt="icon" />
                                                                            </div>
                                                                            <div className="t-user-info">{data.propertyName}</div>
                                                                        </div>
                                                                    </Link>
                                                                :
                                                                (
                                                                    col.isBoolean ?
                                                                        <div className={`t-user _action ${data[col.id] ? '' : '_not'}`}>
                                                                            <div className="t-user-icon">
                                                                                <img src={data[col.id] ? greenIcon : crossIcon} alt="icon" />
                                                                            </div>
                                                                            <div className="t-user-info">{(data[col.id] ? 'Yes' : 'No')}</div>
                                                                        </div>
                                                                    :
                                                                    (col.formateDate ? 
                                                                        (data[col.id] ? formatDate(data[col.id]) : '-') 
                                                                        : 
                                                                        (
                                                                            (data[col.id] === 'No' || data[col.id] === 'no') || (data[col.id] === 'Yes' || data[col.id] === 'yes') ?
                                                                            <div className={`t-user _action ${data[col.id] === 'Yes' || data[col.id] === 'Yes' ? '' : '_not'}`}>
                                                                                <div className="t-user-icon">
                                                                                    <img src={data[col.id] === 'Yes' || data[col.id] === 'yes' ? greenIcon : crossIcon} alt="icon" />
                                                                                </div>
                                                                                <div className="t-user-info">{(data[col.id])}</div>
                                                                            </div>
                                                                            : 
                                                                            data[col.id] || data[col.id]===0 ? (col.isDollar ? '$' : '' ) +data[col.id] :
                                                                            'NA'
                                                                        )
                                                                    )     
                                                                )
                                                            }
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        ))}
                                    </tbody>
                                :
                                <div className="renter_data_msg"><NoData /></div>
                            }
                        </Table>
                    </div>
                    {
                        totalRows > 0 ?
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
                </div>
            </div>
        </>
    );
}
