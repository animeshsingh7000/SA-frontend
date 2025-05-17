import { useEffect, useRef, useState } from "react";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import downIcon from "../../../assets/images/arrowDown.svg";
import Table from 'react-bootstrap/Table';
import SearchBar from "../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import { Spinner } from "react-bootstrap";
import { NoData } from "../../../components";
import { getDocumentList } from "../../../api/admin/opeartions";
import greenIcon from "../../../assets/images/green-tick.svg";
import crossIcon from "../../../assets/images/crossx.svg";
import createXlsxExporter from "../../../hooks/createXlsxExporter";
const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

export default function DocumentList() {
    const [rowData, setRowData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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
    }, [pageNumber, searchQuery]);

    const pageCount = Math.ceil(totalRows / count);

    const handlePageClick = (event: any) => {
        setPageNumber(event.selected + 1);
    };

    const fetchData = async (page: number, c?:number) => {
        setLoader(true);
        try {
            getDocumentList({
                count: c ?  c : count,
                page,
                search: searchQuery,
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
        navigate(ROUTE_NAVIGATION_PATH.DOCUMENT_VIEW + '/' + id);
    }

    const stripTags = (str:any) => {
        return str.replace(/<[^>]*>/g, '');
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

        const headers = ['Title', 'Description', 'Context', 'Type', 'Enabled'];
        const keys = ['title', 'description', 'context', 'type', 'enabled'];

        const apiResponse = rowData;
    
        exportToXlsx(headers, keys, apiResponse, 'Document_list.xlsx');
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

            <div className="common-right-panel-section">
                <div className="top-right-bar _bdr-none">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">Opeartion Manager</Breadcrumb.Item>
                        <Breadcrumb.Item active>Document Templates</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="heading">
                        <div className="guest-left">
                            <h1>Document Templates</h1>
                        </div>
                    </div>

                </div>
                <div className="mid-content-section pt-0">
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
                                    <th>
                                        <div className="th-data">Title</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Description</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Context</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Type</div>
                                    </th>
                                    <th>
                                        <div className="th-data">Enabled</div>
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
                                                                    <div className="t-user-info">{data.title}</div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {data.description ? stripTags(data.description) : 'NA'}
                                                            </td>
                                                            <td>
                                                                {data.context ? stripTags(data.context) : 'NA'}
                                                            </td>
                                                            <td>
                                                                {data.type ? data.type : 'NA'}
                                                            </td>
                                                            <td>
                                                                <div className={`t-user _action ${data.enabled ? '' : '_not'}`}>
                                                                    <div className="t-user-icon">
                                                                        <img src={data.enabled ? greenIcon : crossIcon} alt="icon" />
                                                                    </div>
                                                                    <div className="t-user-info">{(data.enabled ? 'Yes' : 'No')}</div>
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
