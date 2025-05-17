import { useEffect, useRef, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import sortIcon from "../../../../assets/images/Sort.svg";
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../../components/SearchBar";
import { getNeighbourhoodList } from "../../../../api/admin/neighborhood";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../../components";
import plusWhite from "../../../../assets/images/plus-white.svg";
import downIcon from "../../../../assets/images/arrowDown.svg";

import createXlsxExporter from "../../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;

type SortType = Record<string, 1 | -1>;

export default function Neighborhood() {
    const [rowData, setRowData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>();
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

    const fetchData = async (page: number, c?:number) => {
        setLoader(true);
        try {
            getNeighbourhoodList({
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

    // function convertSortBy(sortBy: any) {
    //     const updatedSortBy: any = {};

    //     // Loop through the keys in sortBy
    //     for (const key in sortBy) {
    //         if (sortBy.hasOwnProperty(key)) {
    //             // If the key is enclosed in square brackets, extract and format it
    //             const newKey = key.startsWith("[") && key.endsWith("]")
    //                 ? key.slice(1, -1).toLowerCase()  // Remove brackets and convert to lowercase
    //                 : key.toLowerCase();              // Otherwise just convert to lowercase

    //             // Assign the value to the updated key in the new object
    //             updatedSortBy[newKey] = sortBy[key];
    //         }
    //     }

    //     return updatedSortBy;
    // }

    // function formatSortBy(sortBy: any) {
    //     const key = Object.keys(sortBy)[0];
    //     const value = sortBy[key];
    //     return `${key}:${value}`;
    // }

    function navigateToEdit(neighbourhoodId: any) {
        navigate(ROUTE_NAVIGATION_PATH.EDIT_NEIGHBORHOOD + '/' + neighbourhoodId);
    }

    const stripTags = (str:any) => {
        return str.replace(/<[^>]*>/g, '');
    }

    function navigateToCreate() {
        navigate(ROUTE_NAVIGATION_PATH.CREATE_NEIGHBORHOOD);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event: any) => {
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

        const headers = ['Neighborhood', 'Description'];
        const keys = ['name', 'description'];

        const apiResponse = rowData;
    
        exportToXlsx(headers, keys, apiResponse, 'Neighborhood.xlsx');
    }

    return (
        <>

            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Property Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Neighborhood</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <div className="guest-left">
                            <h1>Neighborhood</h1>
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
                        <div className="_search-bar">
                            <SearchBar placeHolder="Search" />
                        </div>
                        <button className="btn primary" onClick={navigateToCreate}>
                            <img src={plusWhite} alt="Icon" /> New Neighborhood
                        </button>
                    </div>

                    <div className="table-section-common">
                        <Table responsive className="">
                            <thead>
                                <tr>
                                    <th>
                                        <div className="th-data">Neighborhood
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('name') ? 'active' : ''}`} onClick={() => doSort('name')}>
                                                <img src={sortIcon} alt="sort" />
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="th-data">Description
                                            <div className={`sort-table ${sortBy && Object.keys(sortBy).includes('description') ? 'active' : ''}`} onClick={() => doSort('description')}>
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
                                                        <tr key={key}>
                                                            <td>
                                                                <div className="t-user" onClick={() => navigateToEdit(data._id)}>
                                                                    <div className="t-user-info">{data.name}</div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {data.description ? stripTags(data.description) : 'NA'}
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
