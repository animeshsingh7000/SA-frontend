import { NoData } from "../../../../components";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import greenIcon from "../../../../assets/images/green-tick.svg";
import plusWhite from "../../../../assets/images/plus-white.svg";
import sortIcon from "../../../../assets/images/Sort.svg";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getFeaturetteList } from "../../../../api/admin/siteManger";
import crossIcon from "../../../../assets/images/crossx.svg";
import createXlsxExporter from "../../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;


export default function AdminFeaturetteListing() {
    const [rowData, setRowData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [count, setCount] = useState<number>(INTIAL_OFFSET);
    const [countText, setCountText] = useState<any>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>();
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (searchParams.get("query") !== searchQuery) {
            setPageNumber(1);
            setSearchQuery(searchParams.get("query"));
        }
    }, [searchParams]);

    // const clearParams = () => {
    //     // Navigate to the current pathname without parameters
    //     navigate(window.location.pathname, { replace: true });
    // };

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

    const fetchData = async (page: number, c?:number) => {
        setLoader(true);
        try {
            getFeaturetteList({
                count: c ? c : count,
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

    function navigateToEdit(id: any) {
        navigate(ROUTE_NAVIGATION_PATH.EDIT_FEATURETTE + '/' + id);
    }

    // const stripTags = (str:any) => {
    //     return str.replace(/<[^>]*>/g, '');
    // }

    function createFeaturette() {
        navigate(ROUTE_NAVIGATION_PATH.CREATE_FEATURETTE);
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
        const headers = ['Heading', 'Lead', 'Enabled', 'Position'];
        const keys =['heading', 'lead', 'enabled', 'position'];
    
        const apiResponse = rowData;
    
        exportToXlsx(headers, keys, apiResponse, 'Featurette.xlsx');
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
            {/* User Property page  */}
            <div className="common-right-panel-section">
                <div className="top-right-bar">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Site Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Featurettes</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <h1>Featurettes</h1>
                    </div>

                </div>
                <div className="mid-content-section">
                    <div className="table-action-content ">
                        <div className="display-tab" onClick={() => setApplyDisplay(!applyDisplay)}>
                            {count === 0 ? 10 : (countText ? countText : count)}
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
                        <div className="suggested-tab" onClick={(e) => exportData(e)}>
                            Export
                        </div>
                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                        <button className="btn primary" onClick={createFeaturette}>
                            <img src={plusWhite} alt="Icon" /> New Featurette
                        </button>
                    </div>
                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-data firstchild">Heading 
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('heading') ? 'active' : ''}`} onClick={() => doSort('heading')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-data">Lead
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('lead') ? 'active' : ''}`} onClick={() => doSort('lead')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-data">Enabled
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('enabled') ? 'active' : ''}`} onClick={() => doSort('enabled')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-data">Position
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('position') ? 'active' : ''}`} onClick={() => doSort('position')}>
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
                                                        <tr >
                                                            <td>
                                                                <div className="t-user" onClick={() => navigateToEdit(data?._id)}>

                                                                    <div className="t-user-info">{data?.heading}</div>
                                                                </div>
                                                            </td>

                                                            <td className="max300">
                                                                <div className="doted-3-line">
                                                                  {data?.lead ? data?.lead : 'NA'}
                                                                </div>
                                                                </td>

                                                            <td>
                                                                <div className={`t-user _action ${data.enabled ? '' : '_not'}`}>
                                                                    <div className="t-user-icon">
                                                                        <img src={data.enabled ? greenIcon : crossIcon} alt="icon" />
                                                                    </div>
                                                                    <div className="t-user-info">{data.enabled ? 'Enabled' : 'Disabled'}</div>
                                                                </div>
                                                            </td>
                                                            <td>{data.position ? data.position : 'NA'}</td>
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
                        totalRows > 0 && (
                            <div className="custom-pagination container container-fluid pt-2">
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
                        )
                    }
                </div>
            </div>
            {/* User Management page End  */}
        </>
    );
}