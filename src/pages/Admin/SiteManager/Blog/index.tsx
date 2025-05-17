import { NoData } from "../../../../components";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import plusWhite from "../../../../assets/images/plus-white.svg";
import sortIcon from "../../../../assets/images/Sort.svg";
import downIcon from "../../../../assets/images/arrowDown.svg";

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getBlogList } from "../../../../api/admin/siteManger";
import { capitalizeFirstWord } from "../../../../utils/common";
import createXlsxExporter from "../../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;


export default function AdminBlogListing() {
    const [rowData, setRowData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>();
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState<number>(INTIAL_OFFSET);
    const [countText, setCountText] = useState<any>(null);

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

    const fetchData = async (page: number, c?:number) => {
        setLoader(true);
        try {
            getBlogList({
                count: c ?  c : count,
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
        navigate(ROUTE_NAVIGATION_PATH.EDIT_BLOG + '/' + id);
    }

    function createFeaturette() {
        navigate(ROUTE_NAVIGATION_PATH.CREATE_BLOG);
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
        const headers = ['Title', 'Post Author', 'Post Status'];
        const keys =['title', 'createdBy', 'blogStatus'];
    
        const apiResponse = rowData;
    
        exportToXlsx(headers, keys, apiResponse, 'Blogs.xlsx');
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
                        <Breadcrumb.Item active>Blogs</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <h1>Blogs</h1>
                    </div>

                </div>
                <div className="mid-content-section">
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

                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                        <button className="btn primary" onClick={createFeaturette}>
                            <img src={plusWhite} alt="Icon" /> New Blog
                        </button>
                    </div>
                    <div className="table-section-common _owner-inquiry-table">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-data firstchild">Title 
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('title') ? 'active' : ''}`} onClick={() => doSort('title')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-data">Post Author</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Post Status</div>
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

                                                                    <div className="t-user-info">{data?.title}</div>
                                                                </div>
                                                            </td>

                                                            <td>{data?.createdBy ? capitalizeFirstWord(data?.createdBy?.firstName) + ' '+ capitalizeFirstWord(data?.createdBy?.lastName) : 'NA'}</td>

                                                            <td>{data.blogStatus ? capitalizeFirstWord(data.blogStatus) : 'NA'}</td>
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
                                    renderOnZeroPageCount={null}
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