import { useEffect, useRef, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { property } from "../../../../api";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import plusWhite from "../../../../assets/images/plus-white.svg";
import sortIcon from "../../../../assets/images/Sort.svg";
import buildingIcon from "../../../../assets/images/building.svg";
import displayIcon from "../../../../assets/images/display.svg";
import inactiveIcon from "../../../../assets/images/inactive-icon.svg";
import activeIcon from "../../../../assets/images/tick-green.svg";
import deleteIcon from "../../../../assets/images/trash.svg";
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import { getBlockDateList, updateBlockDate } from "../../../../api/admin/blockDates";
import { BLOCK_DATES_TABLE_COLUMNS } from "../../../../constants/Filters";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../../components";
import { formatDate } from "../../../../utils/common";
import DeleteBlockDateModel from "../../../../components/Modal/DeleteBlockDateModel";
import { AxiosError } from "axios";
import { toast } from 'react-toastify';

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

export default function Buildings() {
    const [rowData, setRowData] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [paginationPageSize, setPaginationPageSize] = useState<number>(INTIAL_OFFSET);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>();
    const [columns, setColumns] = useState(BLOCK_DATES_TABLE_COLUMNS);
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);
    const [openToggle, setOpenToggle] = useState<number | null>(null); // Track which toggle is open
    const divRef = useRef<HTMLDivElement>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [property, setProperty] = useState("");
    const [blockDateId, setBlockDateId] = useState("");
    const [spin, setSpin] = useState(false);

    useEffect(() => {
        if (searchParams.get("query") !== searchQuery) {
            setPageNumber(1);
            setSearchQuery(searchParams.get("query"));
        }
    }, [searchParams]);

    const clearParams = () => {
        // Navigate to the current pathname without parameters
        navigate(window.location.pathname, { replace: true });
    };

    useEffect(() => {
        fetchData(pageNumber);
    }, [pageNumber, searchQuery, sortBy]);

    const pageCount = Math.ceil(totalRows / INTIAL_OFFSET);

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

    const fetchData = async (page: number) => {
        setLoader(true);
        try {
            getBlockDateList({
                count: paginationPageSize,
                page,
                search: searchQuery,
                sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
            }).then((res: any) => {
                setLoader(false);
                setRowData(res.data);
                setTotalRows(res.count);
            });
        } catch (error) {
            setLoader(false);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        // Perform any side effects like re-fetching data with the new page number if necessary
    }, [pageNumber]);

    function navigateToEdit(buildingId: any) {
        navigate(ROUTE_NAVIGATION_PATH.EDIT_BUILDING + '/' + buildingId);
    }

    const stripTags = (str: any) => {
        return str.replace(/<[^>]*>/g, '');
    }

    function navigateToCreate() {
        navigate(ROUTE_NAVIGATION_PATH.CREATE_EDIT_DATE_BLOCK);
    }

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

    const handleClickOutside = (event: any) => {
        // If the click is outside the div, hide the div
        if (divRef.current && !divRef.current.contains(event.target)) {
            setOpenToggle(null);
        }

        if (displayRef.current && !displayRef.current.contains(event.target)) {
            setApplyDisplay(false);
        }
    };

    const handleToggleClick = (index: any) => {
        setOpenToggle(openToggle === index ? null : index);
    };

    const updateListItem = () => {
        setRowData(prevRowData => prevRowData.filter(row => row._id !== blockDateId));
        setProperty('');
        setBlockDateId('');
        navigate(ROUTE_NAVIGATION_PATH.BLOCK_DATES_LIST);
    }

    const openDeleteModel = (property: any, id: any) => {
        setProperty(property);
        setBlockDateId(id);
        setDeleteModal(true);
    }

    const updateOiStatus = (data:any, status: string, index: any) => {
            setSpin(true);
            updateBlockDate(data._id, {
                listingId: data.listingId,
                startDate: data.startDate,
                endDate: data.endDate,
                blockDateStatus: status
            })
            .then((res) => {
                toast.success(`Block Date has been updated sucessfully`)
                setSpin(false);
                // fetchData(pageNumber);
                setRowData(prevRowData => {
                    const updatedRowData = [...prevRowData]; // Shallow copy of the array
                    updatedRowData[index] = { ...updatedRowData[index], blockDateStatus: 'Approved'}; // Update the status of the object at index
                    return updatedRowData;
                });
            })
            .catch((error: AxiosError<{ message: string; status: number }>) => {
                setSpin(false);
                toast.error(error.response?.data?.message as string);
            });
        
    };


    return (
        <>
            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Block Dates</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <div className="guest-left">
                            <h1>Block Dates</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
                    <div className="table-action-content">
                        <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                            <img src={displayIcon} alt="display" /> Display
                            {
                                applyDisplay ?
                                    <>
                                        <div ref={displayRef} className="drop-text-display scrollbar" >
                                            <div className="hdtext">Display</div>
                                            <ul>
                                                {columns.map((col: any, key: any) => (
                                                    <li key={col.id} className={`${key == 0 ? 'selected' : ''}`}>
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
                        <button className="btn primary" onClick={navigateToCreate}>
                            <img src={plusWhite} alt="Icon" /> New Block Lease
                        </button>
                    </div>

                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    {columns
                                        .filter((col) => col.visible)
                                        .map((col) => (
                                            <th key={col.id} className="_widthsmall_145">
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
                                        ))}
                                </tr>
                            </thead>
                            <>
                                { spin ? <div className="spinner-wrapper"><Spinner /></div> : null}
                            </>
                            {
                                loader ?
                                    <div className="spinner-wrapper"><Spinner /></div>
                                    :
                                    rowData.length > 0 ?
                                        <tbody>
                                            {/* <tr>
                                            <td>
                                                <div className="t-user">
                                                    <div className="t-user-icon">
                                                        <img src={buildingIcon} alt="icon" />
                                                    </div>
                                                    <div className="t-user-info">3517 W. Gray St. Utica, Pennsylvania 57867</div>
                                                </div>
                                            </td>
                                            <td>
                                                Theresa Webb
                                                <p className="_font">felicia.reid@example.com</p>
                                            </td>
                                            <td>November 28, 2015</td>
                                            <td>November 28, 2015</td>
                                            <td>November 28, 2015</td>
                                            <td>
                                                <div className="_status-info-td">
                                                    <div className="_status-btn inactive">
                                                        <img src={inactiveIcon} alt="inactiveIcon" /> Inactive
                                                    </div>
                                                    <div className="_status-btn active">
                                                        <img src={activeIcon} alt="inactiveIcon" /> Inactive
                                                    </div>
                                                </div>

                                            </td>
                                            <td>
                                                <div className="_action-info-td">
                                                    <button className="_delete-btn">
                                                        <img src={deleteIcon} alt="Delete" /> Delete
                                                    </button>
                                                </div>
                                            </td>


                                        </tr> */}

                                            <>
                                                {rowData.map((data: any, key: any) => (
                                                    <tr>
                                                        {columns
                                                            .filter((col) => col.visible)
                                                            .map((col) => (
                                                                <td key={col.id}>

                                                                    {
                                                                        col.id == 'name' ?
                                                                            <div className="t-user">
                                                                                <div className="t-user-icon">
                                                                                    <img src={buildingIcon} alt="icon" />
                                                                                </div>
                                                                                <div className="t-user-info">{data.name}</div>
                                                                            </div>
                                                                            :
                                                                            (
                                                                                col.id == 'action' ?
                                                                                    <div className="_action-info-td" onClick={() => openDeleteModel(data.propertyName, data._id)}>
                                                                                        <button className="_delete-btn">
                                                                                            <img src={deleteIcon} alt="Delete" /> Delete
                                                                                        </button>
                                                                                    </div>
                                                                                    :
                                                                                    col.id == 'primaryGuestName' ?
                                                                                        <>
                                                                                            {data[col.id]}
                                                                                            <p className="_font">{data.primaryGuestEmail}</p>
                                                                                        </>
                                                                                        :
                                                                                        (col.id == 'blockDateStatus' ?
                                                                                                <div className="pos_relative">
                                                                                                    <div className="_status-info-td">
                                                                                                        <div className={`_status-btn ${data[col.id] === 'Approved' ? 'active' : 'inactive'}`} onClick={() => handleToggleClick(key)}>
                                                                                                            <img src={data[col.id] === 'Approved' ? activeIcon : inactiveIcon} alt="inactiveIcon" />
                                                                                                            {data[col.id] === 'Approved' ? 'Aprroved' : 'Pending'}
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    {
                                                                                                        data[col.id] !== 'Approved' && openToggle == key ?
                                                                                                            <div ref={divRef} className="drop-text-action">
                                                                                                                <div className="hdtext">Status</div>
                                                                                                                <ul>
                                                                                                                    <li onClick={() => handleToggleClick(key)}>
                                                                                                                        <button className="table-button _rejected">Pending</button>
                                                                                                                    </li>
                                                                                                                    <li onClick={() => updateOiStatus(data, 'Approved', key)}>
                                                                                                                        <button className="table-button _approved">Approved</button>
                                                                                                                    </li>

                                                                                                                </ul>
                                                                                                            </div>
                                                                                                            :
                                                                                                            null
                                                                                                    }
                                                                                                </div>
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
                        totalRows > INTIAL_OFFSET ?
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
                                />
                            </div>
                            :
                            null
                    }
                </div>

            </div>

            {
                blockDateId && deleteModal ? (
                    <DeleteBlockDateModel
                        show={deleteModal}
                        handleClose={() => setDeleteModal(false)}
                        blockDateId={blockDateId}
                        property={property}
                        updateListItem={updateListItem}
                    />
                )
                    :
                    null
            }

        </>
    );
}
