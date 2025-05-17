import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { RECURRING_CLEANING_SCHEDULE } from "../../../constants/Filters";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import arrowDown from "../../../assets/images/down-arrow.png";
import sortIcon from "../../../assets/images/Sort.svg";
import arrowRight from "../../../assets/images/CaretRight.svg";
import placeHolder from "../../../assets/images/placeHolder.png";
import downIcon from "../../../assets/images/arrowDown.svg";

import Table from 'react-bootstrap/Table';
import "ag-grid-community/styles/ag-grid.css";
import { getRecurringScheduleList } from "../../../api/admin/opeartions";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components";
import SearchBar from "../../../components/SearchBar";
import { formatDate } from "../../../utils/common";
import createXlsxExporter from "../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

export default function RecurringCleaningSchedule()  {
    const [currentItems, setCurrentItems] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [searchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState<SortType>();
    const [loader, setLoader] = useState(false);
    const [columns, setColumns] = useState(RECURRING_CLEANING_SCHEDULE);
    const [count, setCount] = useState<number>(INTIAL_OFFSET);
    const [countText, setCountText] = useState<any>(null);
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);

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
                count: c ?  c : count,
                page,
                search: searchQuery,
                sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
            }
            getRecurringScheduleList(payload).then((res) => {
                setLoader(false);
                setCurrentItems(res.data);
                setTotalRows(res.count);
            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
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
        const visibleColumns = RECURRING_CLEANING_SCHEDULE.filter(col => col.visible);

        const headers = visibleColumns.map(col => col.label);
        const keys = visibleColumns.map(col => col.id);

        const apiResponse = currentItems;
    
        exportToXlsx(headers, keys, apiResponse, 'Recurring_Cleaning_Schedule.xlsx');
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
            <div className="table-action-content">
                <div className="show_count_info">
                    <div className="divshow">Show</div>
                    <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                       {count === 0 ? 10 : (countText ? countText : count)} <span className="_span"><img src={downIcon} alt="" /></span>
                        {
                            applyDisplay ?
                                <>
                                    <div ref={displayRef} className="drop-text-display scrollbar" >
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
                    <SearchBar placeHolder="Search" />
                </div>
            </div>

            <div className="table-section-common">
                <Table responsive className="">
                    <thead>
                        <tr>
                            {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                    <th key={col.id}>
                                        <div className={`th-data ${col.label == 'Property' ? 'firstchild' : ''}`}>{col.label}
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
                                ))}
                        </tr>
                    </thead>
                    {
                        loader ?
                            <div className="spinner-wrapper"><Spinner /></div>
                            :
                            currentItems.length > 0 ?
                            <tbody>

                                <>
                                    {currentItems.map((data: any, key: any) => (
                                        
                                        <tr>
                                            {columns
                                                .filter((col) => col.visible)
                                                .map((col) => (
                                                    <td key={col.id}>
                                                        {
                                                        col.formateDate ? (data[col.id] ? formatDate(data[col.id]) : '-') : (data[col.id] ? data[col.id] : 'NA')
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
        </>
       
    );
}
