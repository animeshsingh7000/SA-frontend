import React, { useState, useEffect, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import SearchBar from "../../../components/SearchBar";
import filterIcon from "../../../assets/images/filter-icon.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import inquiryIcon from "../../../assets/images/inquiry-icon.svg";
import downIcon from "../../../assets/images/arrowDown.svg";

import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import moment from "moment";
import { capitalizeFirstWord, formatDate } from "../../../utils/common";
import { getRentalInquires } from "../../../api/admin/renterInquiry";
import { useMessageModal } from "../../../hooks/useMessage";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components";
import { RENTER_TABLE_COLUMNS } from "../../../constants/Filters";
import displayIcon from "../../../assets/images/display.svg";
import { WEB_BASE_URL } from "../../../constants";
import createXlsxExporter from "../../../hooks/createXlsxExporter";


const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;


const RenterInquiryList: React.FC = () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [count, setCount] = useState<number>(INTIAL_OFFSET);
    const [countText, setCountText] = useState<any>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>({createdAt: -1});
    const [openToggle, setOpenToggle] = useState<number | null>(null); // Track which toggle is open
    const divRef = useRef<HTMLDivElement>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);  // Accepts both Date and null
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [openFilter, setOpenFilter] = useState<any>(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const [showDatePicker, setShowDatePicker] = useState(false); // Control visibility
    const [showEndDatePicker, setShowEndDatePicker] = useState(false); // Control visibility
    const formattedStartDate = startDate ? format(startDate, 'dd-MM-yyyy') : '';
    const formattedEndDate = endDate ? format(endDate, 'dd-MM-yyyy') : '';
    const [applyFilter, setApplyFilter] = useState<number>(0);
    const { showMessage } = useMessageModal();
    const [columns, setColumns] = useState(RENTER_TABLE_COLUMNS);
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);
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
    }, [pageNumber, searchQuery, sortBy, applyFilter]);

    const pageCount = Math.ceil(totalRows / count);

    const handlePageClick = (event: any) => {
        setPageNumber(event.selected + 1);
    };

    const fetchData = async (page: number, c?:number) => {
        setLoader(true);
        try {
            getRentalInquires({
                count: c ? c : count,
                page: page,
                search: searchQuery,
                sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({createdAt: -1}),
                startDate : startDate ? moment(new Date(startDate)).format('YYYY-MM-DD') : null,
                endDate: endDate ? moment(new Date(endDate)).format('YYYY-MM-DD') : null,
            }).then((res) => {
                setRowData(res.data);
                setTotalRows(res.count);
                setLoader(false);
            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    };

    const doSort = (keyName: any) => {
        if (sortBy?.[keyName]) {
            setSortBy({ [keyName]: sortBy?.[keyName] * -1 } as SortType);
        } else {
            setSortBy({ [keyName]: -1 });
        }
        setPageNumber(1);
    };

    function navigateToEdit(id: any) {
        navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_RENTAL_INQUIRY + '/' + id);
    }

    const handleFilterClick = () => {
        setOpenFilter(!openFilter);
    };

    const handleClickOutside = (event: any) => {
        // If the click is outside the div, hide the div
        if (divRef.current && !divRef.current.contains(event.target)) {
            setOpenToggle(null);
        }

        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setOpenFilter(false);
        }

        if (displayRef.current && !displayRef.current.contains(event.target)) {
            setApplyDisplay(false);
        }

        if (exportRef.current && !exportRef.current.contains(event.target)) {
            setApplyExport(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const clearFilter = () => {
        setStartDate(null);
        setEndDate(null);
        setPageNumber(1);
        setApplyFilter(0);
        setOpenFilter(!openFilter);
    }

    const handleLiClick = () => {
        setShowDatePicker(!showDatePicker);
    };
    

    const handleLiEndClick = () => {
        setShowEndDatePicker(!showEndDatePicker);
    };
    

    const applyDateFilter = (e:any) => {
        if(!startDate || !endDate) {
            e.stopPropagation()
            return;
        } else {
            setPageNumber(1);
            setApplyFilter(applyFilter+1);
        } 
    }

    function toggleColumnVisibility(id:any) {
        setColumns((prevColumns) =>
          prevColumns.map((col) =>
            col.id === id ? { ...col, visible: !col.visible } : col
          )
        );
    }

    function openNewTab(url:any) {
        window.open(url, "_blank"); // Replace with your URL
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
        const visibleColumns = RENTER_TABLE_COLUMNS.filter(col => col.visible);

        const headers = visibleColumns.map(col => col.label);
        const keys = visibleColumns.map(col => col.id);

        const apiResponse = rowData;

        exportToXlsx(headers, keys, apiResponse, 'Rental_Inquiries.xlsx');
    }

    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Inquiry</Breadcrumb.Item>
                        <Breadcrumb.Item active>Rental Inquiries</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <h1>Rental Inquiries</h1>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
                    <div className="table-action-content ">
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
                        <div className={`filter-tab ${ applyFilter === 1 ? 'active' : ''}`} onClick={handleFilterClick}>
                            <img src={filterIcon} alt="Filter" /> Filter
                            {
                                openFilter ?
                                    <div ref={filterRef} className="drop-text-filter _owner_filter">
                                        <div className="hdtext">Filter</div>
                                        <div className="hdtext cursor-pointer" onClick={(e) => { e.stopPropagation(); clearFilter() }}>Clear</div>
                                        <ul>
                                            <li onClick={(e) => { e.stopPropagation(); handleLiClick(); }}>Submitted Start Date <span>{formattedStartDate}</span> </li>
                                            <li onClick={(e) => {
                                                if (!startDate) {
                                                    e.stopPropagation();  // Prevent opening if startDate is not selected
                                                    showMessage({
                                                        heading: "Error",
                                                        body: <p>Please select Submitted Start Date</p>,
                                                        type: "error",
                                                    });
                                                } else {
                                                    e.stopPropagation();
                                                    handleLiEndClick();  // Open end date picker if startDate is available
                                                }
                                            }}>Submitted End Date <span>{formattedEndDate}</span> </li>
                                        </ul>
                                        {showDatePicker && (
                                            <div className="start-datewrapper" onClick={(e) => e.stopPropagation()}>
                                                <DatePicker
                                                selected={startDate}
                                                onChange={(date) => { setStartDate(date); setShowDatePicker(false) }}
                                                onClickOutside={(e) => { e.stopPropagation(); setShowDatePicker(false) }}  // Close when clicking outside
                                                inline  // This makes the date picker always visible when open
                                                />
                                            </div>
                                        )}

                                        {showEndDatePicker && (
                                            <div className="end-datewrapper" onClick={(e) => e.stopPropagation()}>
                                                <DatePicker
                                                selected={endDate}
                                                minDate={startDate} 
                                                onChange={(date) => {setEndDate(date); setShowEndDatePicker(false)}}
                                                onClickOutside={(e) => { e.stopPropagation();setShowEndDatePicker(false) }}  // Close when clicking outside
                                                inline  // This makes the date picker always visible when open
                                                />
                                            </div>
                                        )}
                                        <div className="clearbtnwrapper">
                                        <div className="clearbtn" onClick={applyDateFilter}>Apply</div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }

                        </div>
                        <div className={`display-tab ${ applyDisplay? 'active' : ''}`} onClick={() => setApplyDisplay(!applyDisplay)}>
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
                    </div>
                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                    <th key={col.id} className={col.id==="estimatedDepartureDate"?'_widthsmall_220': ''}>
                                        <div className="th-data">{col.label}
                                            {
                                                col.sortBy ?
                                                <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes(col.id) ? 'active' : ''}`} onClick={() => doSort(col.id)}>
                                                    <img src={sortIcon} alt="sort" />
                                                    
                                                </div>
                                            :
                                                null
                                            }  
                                        </div>
                                    </th>
                                ))}
                                    
                                </tr>
                            </thead>
                            {
                                loader ?
                                    <div className="spinner-wrapper"><Spinner /></div>
                                    :
                                    rowData.length > 0 ?
                                    <tbody>
                                        <>
                                            {rowData.map((data: any, key: any) => (
                                                <tr>
                                                    {columns
                                                    .filter((col) => col.visible)
                                                    .map((col) => (
                                                        <td key={col.id}>

                                                            {
                                                                col.id === 'fullName' ?
                                                                <div className="t-user" onClick={() => navigateToEdit(data._id)}>
                                                                    <div className="t-user-icon">
                                                                        <img src={inquiryIcon} alt="icon" />
                                                                    </div>
                                                                    <div className="t-user-info">{capitalizeFirstWord(data.fullName)}</div>
                                                                </div>
                                                                :
                                                                (
                                                                col.id === 'matchingPropertyUrl' ?
                                                                    <div className="t-user" onClick={() => openNewTab(WEB_BASE_URL+'matching-property/'+data._id)}>
                                                                        <div className="t-user-info">
                                                                            { WEB_BASE_URL+'matching-property/'+data._id }
                                                                        </div>
                                                                    </div>
                                                                :
                                                                    (col.id === 'estimatedArrivalEstimatedDeparture' ?
                                                                        data.estimatedArrivalDate ? formatDate(data.estimatedArrivalDate) + ' - ' + formatDate(data.estimatedDepartureDate) : '-'
                                                                    :
                                                                        col.isBoolean ? (data[col.id] ? 'Yes' : 'No') : (col.formateDate ? (data[col.id] ? formatDate(data[col.id]) : '-') : (data[col.id] ? data[col.id] : 'NA'))
                                                                    )
                                                                )

                                                            }
                                                            
                                                            
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    </tbody>
                                    :
                                    <div className="renter_data_msg"><NoData /></div>
                            }
                        </Table>
                    </div>
                    {
                        totalRows > 0
                        ?
                        <div className="custom-pagination p-0 pt-4 container container-fluid">
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

            {/* Owner Inquiry new page  end */}
        </>
    );
};

export default RenterInquiryList;
