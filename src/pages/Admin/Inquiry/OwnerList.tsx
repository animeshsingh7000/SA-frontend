import React, { useState, useEffect, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getInquires, updateStatus } from "../../../api/admin/ownerInquiry";
import { OWNER_INQUIRY_STATUS, OWNER_INQUIRY_TYPE } from "../../../constants";
import ReactPaginate from "react-paginate";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import SearchBar from "../../../components/SearchBar";
import filterIcon from "../../../assets/images/filter-icon.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import downIcon from "../../../assets/images/arrowDown.svg";

import inquiryIcon from "../../../assets/images/inquiry-icon.svg";
import downArrow from "../../../assets/images/down-arrow2.png";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components";
import { capitalizeFirstWord, formatDate } from "../../../utils/common";
import { AxiosError } from "axios";
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import moment from "moment";
import { useMessageModal } from "../../../hooks/useMessage";
import { useAuth } from "../../../hooks/useAuth";
import createXlsxExporter from "../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;

type SortType = Record<string, 1 | -1>;

const OwnerInquiryList: React.FC = () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [paginationPageSize, setPaginationPageSize] =
        useState<number>(INTIAL_OFFSET);
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
    const [spin, setSpin] = useState(false);
    const auth = useAuth();
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
    }, [pageNumber, searchQuery, sortBy, applyFilter]);

    const pageCount = Math.ceil(totalRows / count);

    const handlePageClick = (event: any) => {
        setPageNumber(event.selected + 1);
    };

    const fetchData = async (page: number, c?:number) => {
        setLoader(true);
        try {
            getInquires({
                count: c  ? c :count,
                page,
                status: OWNER_INQUIRY_TYPE.ALL,
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

    const handleToggleClick = (index: any) => {
        setOpenToggle(openToggle === index ? null : index);
    };

    const doSort = (keyName: any) => {
        if (sortBy?.[keyName]) {
            setSortBy({ [keyName]: sortBy?.[keyName] * -1 } as SortType);
        } else {
            setSortBy({ [keyName]: -1 });
        }
        setPageNumber(1);
    };

    const updateOiStatus = (neighborhood:string, status: number, id: string, index: any) => {

        if((neighborhood && status === 1) || status === 2){
            setSpin(true);
            updateStatus({
                ownerInquiryId: id,
                approvalType: OWNER_INQUIRY_STATUS[status],
            })
            .then((res) => {
                toast.success(`Inquiry has been ${OWNER_INQUIRY_STATUS[status]}ed.`)
                setSpin(false);
                // fetchData(pageNumber);
                if(status === 1) {
                    setRowData(prevRowData => {
                        const updatedRowData = [...prevRowData]; // Shallow copy of the array
                        updatedRowData[index] = { ...updatedRowData[index], status: OWNER_INQUIRY_STATUS[status] === 'accept' ? 1 : 2, inquiryApprover: auth?.user?.firstName + ' ' + auth.user.lastName, inquiryApprovedAt: formatDate(new Date()) }; // Update the status of the object at index
                        return updatedRowData;
                    });
                } else {
                    setRowData(prevRowData => {
                        const updatedRowData = [...prevRowData]; // Shallow copy of the array
                        updatedRowData[index] = { ...updatedRowData[index], status: OWNER_INQUIRY_STATUS[status] === 'accept' ? 1 : 2 };
                        return updatedRowData;
                    });
                }
                
            })
            .catch((error: AxiosError<{ message: string; status: number }>) => {
                setSpin(false);
                toast.error(error.response?.data?.message as string);
            });
        } else {
            navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_OWNER_INQUIRY + '/' + id + '?fromStatus=1');
        }
        
    };

    function navigateToEdit(id: any) {
        navigate(ROUTE_NAVIGATION_PATH.ADD_EDIT_OWNER_INQUIRY + '/' + id);
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

    const changeData = (value:number, text:any) => {
        setPageNumber(1);
        setCountText(text)
        setCount(value);
        fetchData(1, value); 
    }
    
    function exportData(e:any) {
        e.stopPropagation();
        const exportToXlsx = createXlsxExporter();
        const headers =  ['Owner Applicant', 'Email', 'Bedrooms', 'Full Bath Count', 'Neighborhood', 'Date Available', 'Submitted On', 'Approved By', 'Approved On'];
        const keys = ['fullName', 'email', 'unitBedroomCountInNum', 'unitBathroomCountInNum', 'neighborhood', 'propertyAvailableFrom', 'createdAt', 'inquiryApprover', 'inquiryApprovedAt'];

        const apiResponse = rowData;

        exportToXlsx(headers, keys, apiResponse, 'Owner_Inquiry.xlsx');
    }


    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Inquiry</Breadcrumb.Item>
                        <Breadcrumb.Item active>Owner Inquiries</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <h1>Owner Inquiries</h1>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
                    <div className="table-action-content ">
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
                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                    </div>
                    
                    
                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th className="_widthsmall_145" style={{minWidth: '165px'}}>
                                        <div className="th-data">Owner Applicant
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('firstName') ? 'active' : ''}`} onClick={() => doSort('firstname')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-data">Email
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('email') ? 'active' : ''}`} onClick={() => doSort('email')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall">
                                        <div className="th-data">Bedrooms
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('unitBedroomCountInNum') ? 'active' : ''}`} onClick={() => doSort('unitBedroomCountInNum')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Full Bath Count
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('unitBathroomCountInNum') ? 'active' : ''}`} onClick={() => doSort('unitBathroomCountInNum')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Neighborhood
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('neighborhood') ? 'active' : ''}`} onClick={() => doSort('neighborhood')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Date Available
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('propertyAvailableFrom') ? 'active' : ''}`} onClick={() => doSort('propertyAvailableFrom')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Submitted On
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('createdAt') ? 'active' : ''}`} onClick={() => doSort('createdAt')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Approved By
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('inquiryApprover') ? 'active' : ''}`} onClick={() => doSort('inquiryApprover')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Approved On
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('inquiryApprovedAt') ? 'active' : ''}`} onClick={() => doSort('inquiryApprovedAt')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th className="_widthsmall_145">
                                        <div className="th-data">Status
                                            <div className={`sort-table ${ sortBy && Object.keys(sortBy).includes('status') ? 'active' : ''}`}  onClick={() => doSort('status')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <>
                                { spin ? <div className="spinner-wrapper"><Spinner /></div> : null}
                            </>
                            {
                                loader ?
                                    <div className="spinner-wrapper"><Spinner /></div>
                                    :
                                    <tbody>
                                        {
                                            rowData.length > 0 ?
                                                <>
                                                    {rowData.map((data: any, key: any) => (
                                                        <tr key={data._id}>
                                                            <td>
                                                                <div className="t-user" onClick={() => navigateToEdit(data._id)}>
                                                                    <div className="t-user-icon">
                                                                        <img src={inquiryIcon} alt="icon" />
                                                                    </div>
                                                                    <div className="t-user-info">{capitalizeFirstWord(data.firstName)} {capitalizeFirstWord(data.lastName)}</div>
                                                                </div>
                                                            </td>
                                                            <td>{data.email}</td>
                                                            <td>{data.unitBedroomCountInNum ? data.unitBedroomCountInNum : 0}</td>
                                                            <td>{data.unitBathroomCountInNum ? data.unitBathroomCountInNum : 0}</td>
                                                            <td>{data.neighborhood ? data.neighborhood : 'NA'}</td>
                                                            <td>{formatDate(data.propertyAvailableFrom)}</td>
                                                            <td>{formatDate(data.createdAt)}</td>
                                                            <td>{data.inquiryApprover ? data.inquiryApprover : 'NA'}</td>
                                                            <td>{data.inquiryApprovedAt ? formatDate(data.inquiryApprovedAt) : 'NA'}</td>
                                                            <td>
                                                                <div className={`action-tab  ${data.status === 0 ? '' : '_withoutbg'}`} onClick={() => handleToggleClick(key)}>
                                                                    <button className={`table-button ${data.status === 1 ? '_approved' : (data.status === 2 ? '_rejected' : '')}`}>{data.status === 0 ? 'In Queue' : (data.status === 1 ? 'Approved ' : 'Rejected')}</button>
                                                                    {
                                                                        data.status === 0 ?
                                                                            <>
                                                                                <div className="arrowimages">
                                                                                    <img className="arrowdown _toparrow" src={downArrow} alt="Arrow" />
                                                                                    <img className="arrowdown" src={downArrow} alt="Arrow" />
                                                                                </div>

                                                                                {
                                                                                    openToggle === key ?
                                                                                        <div ref={divRef} className="drop-text-action">
                                                                                            <div className="hdtext">Status</div>
                                                                                            <ul>
                                                                                                <li onClick={() => handleToggleClick(key)}>
                                                                                                    <button className="table-button">In Queue</button>
                                                                                                </li>
                                                                                                <li onClick={() => updateOiStatus(data.neighborhood, OWNER_INQUIRY_TYPE.ACTIVE, data._id, key)}>
                                                                                                    <button className="table-button _approved">Approved</button>
                                                                                                </li>
                                                                                                <li onClick={() => updateOiStatus(data.neighborhood, OWNER_INQUIRY_TYPE.REJECTED, data._id, key)}>
                                                                                                    <button className="table-button _rejected">Rejected</button>
                                                                                                </li>
                                                                                            </ul>
                                                                                        </div>
                                                                                        :
                                                                                        null
                                                                                }

                                                                            </>
                                                                            :
                                                                            null
                                                                    }

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

export default OwnerInquiryList;
