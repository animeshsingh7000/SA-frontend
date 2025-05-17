import { NoData } from "../../../../components";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { configuration } from "../../../../api";
import { ROUTE_NAVIGATION_PATH } from "../../../../routes/routes";
import { capitalizeFirstWord, formatDate } from "../../../../utils/common";
import ReactPaginate from "react-paginate";
import buildingIcon from "../../../../assets/images/building.svg";
import plusWhite from "../../../../assets/images/plus-white.svg";
import sortIcon from "../../../../assets/images/Sort.svg";
import filterIcon from "../../../../assets/images/filter-icon.svg";
import displayIcon from "../../../../assets/images/display.svg";
import Table from 'react-bootstrap/Table';
import closeIcon from "../../../../assets/images/close.svg";
import downIcon from "../../../../assets/images/arrowDown.svg";

import SearchBar from "../../../../components/SearchBar";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getAvailableProperty } from "../../../../api/admin/property";
import { ALL_PROPERTY_TABLE_COLUMNS } from "../../../../constants/Filters";
import { Spinner } from "react-bootstrap";
import greenIcon from "../../../../assets/images/green-tick.svg";
import crossIcon from "../../../../assets/images/crossx.svg";
import createXlsxExporter from "../../../../hooks/createXlsxExporter";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

export default function AllProperty() {
    const [rowData, setRowData] = useState([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const [loader, setLoader] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<SortType>();
    const [columns, setColumns] = useState(ALL_PROPERTY_TABLE_COLUMNS);
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const [applyFilter, setApplyFilter] = useState<any>(false);
    const [onBrowseFilter, setOnBrowseFilter] = useState<any>(false);
    const amenityFilterRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const [categoriesList, setCategoriesList] = useState<any>([]);
    const [amenitiesList, setAmenitiesList] = useState<any>([]);
    const [initData, setInitData] = useState<any>([]);
    const [showCategories, setShowCategories] = useState(false);
    const [showAmmenities, setShowAmmenities] = useState(false);
    const [filteredData, setFilteredData] = useState<any>([]);
    const [categories, setCategories] = useState<any>([]);
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


    const fetchData = async (page:number, c?: number, quetyParams?:any) => {
        setLoader(true);
        try {
            const payload = quetyParams ? quetyParams : {
                count: c ? c : count,
                page,
                search: searchQuery,
                sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
            }
            getAvailableProperty(payload).then((res) => {
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
        configuration.getSharedAmenitiesV2().then((res: any) => {
            const cat = Object.keys(
                res.data.reduce((acc: any, item: any) => {
                    if (!acc[item.category]) {
                        acc[item.category] = true; // Use a boolean or any value
                    }
                    return acc;
                }, {})
            );

            setCategories(cat);
            setCategoriesList(res.data);
        });
    }, [])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event: any) => {
        // If the click is outside the div, hide the div
        // if (divRef.current && !divRef.current.contains(event.target)) {
        //     setOpenToggle(null);
        // }

        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setApplyFilter(false);
        }

        if (displayRef.current && !displayRef.current.contains(event.target)) {
            setApplyDisplay(false);
        }

        if (exportRef.current && !exportRef.current.contains(event.target)) {
            setApplyExport(false);
        }

        if(categoryRef.current && !categoryRef.current.contains(event.target)) {
            setShowAmmenities(false);
            setShowCategories(false);
            setApplyFilter(false);
        }

        if(amenityFilterRef.current && !amenityFilterRef.current.contains(event.target)) {
            setShowAmmenities(false);
            setShowCategories(false);
            setApplyFilter(false);
        }
    };

    function toggleColumnVisibility(id: any) {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === id ? { ...col, visible: !col.visible } : col
            )
        );
    }

    function navigateToCreate() {
        navigate(ROUTE_NAVIGATION_PATH.CREATE_PROPERTY + '/' + 2);
    }

    function applyCategories(e: any, title: any) {
        e.stopPropagation();
        let filteredValues = categoriesList
            .filter((item: any) => item.category === title)
            .map((item: any) => item.value); // Extract the "value" field

        const index = initData.findIndex((item: any) => item.type === 'category');
        if (index !== -1) {
            // initData.splice(index, 1);
            // const filteredArray = filteredData.filter((value: any) => !filteredValues.includes(value));
            // setInitData(initData);
            // setAmenitiesList([]);
            // setFilteredData(filteredArray);
            clearFilter();
        } else {
            const filtered = categoriesList
                .filter((item: any) => item.category === title)
                .map((item: any) => item); // Extract the "value" field
            setInitData((prevItems: any) => [...prevItems, { label: title, value: title, type: 'category' }]);
            setAmenitiesList(filtered);
            setFilteredData(filteredValues);
        }
        setShowCategories(false);
    }

    function applyAmenities(e: any, amm: any) {
        e.stopPropagation();
        const catIndx = initData.findIndex((item: any) => item.type === 'category');
        const amIndx = initData.findIndex((item: any) => item.type === 'amenity');

        if (catIndx !== -1 && amIndx == -1) {
            setFilteredData([]);
        }
        const index = initData.findIndex((item: any) => item.value === amm.value);
        const ind = filteredData.findIndex((item: any) => item === amm.value);

        if (index !== -1) {
            const newInitData = [...initData];
            newInitData.splice(index, 1);
            setInitData(newInitData);
            const newFilteredData = [...filteredData];
            newFilteredData.splice(ind, 1);
            setFilteredData(newFilteredData);
        } else {
            setInitData((prevItems: any) => [...prevItems, { label: amm.label, value: amm.value, type: 'amenity' }]);
            setFilteredData((prevItems: any) => [...prevItems, amm.value]);
        }
    }

    function showCategoriesList(event: any) {
        event.stopPropagation();
        setShowCategories(true);
    }

    function showAmmenitiesList(event: any) {
        event.stopPropagation();
        setShowAmmenities(true);
        setApplyFilter(false);
    }

    function applyFilters() {
        if (showCategories || showAmmenities) {
            setShowCategories(false);
            setShowAmmenities(false);
        } else {
            setApplyFilter(!applyFilter);
        }
    }

    function clearFilter() {
        setInitData([]);
        setFilteredData([]);
        setAmenitiesList([]);
        if(onBrowseFilter) {
            setSearchQuery("");
            setOnBrowseFilter(false);
        }
    }

    function removeFilter(e: any, title: any) {
        const index = initData.findIndex((item: any) => item.type === 'category');
        const amIndx = initData.findIndex((item: any) => item.type === 'amenity');
        const amenityCount = initData.filter((item:any) => item.type === "amenity").length;

        const ameIndx = initData.findIndex((item: any) => item.value === title.value);
        const ind = filteredData.findIndex((item: any) => item === title.value);
        if (index !== -1 && amIndx == -1) {
            clearFilter();
        }
        else if(amenityCount == 1 && index !== -1) {
            if (ameIndx !== -1) {
                if (ameIndx > -1) {
                    const newInitData = [...initData];
                    newInitData.splice(ameIndx, 1);
                    setInitData(newInitData);
                }
            
                if (ind > -1) {
                    const filtered = categoriesList
                    .filter((item: any) => item.category === title)
                    setFilteredData(filtered);
                }
            }
        } else if(initData.length == 1) {
            if (ameIndx !== -1) {
                if (ameIndx > -1) {
                    const newInitData = [...initData];
                    newInitData.splice(ameIndx, 1);
                    setInitData(newInitData);
                }
            
                if (ind > -1) {
                    const newFilteredData = [...filteredData];
                    newFilteredData.splice(ind, 1);
                    setFilteredData(newFilteredData);
                }
            }
            setOnBrowseFilter(true);
            clearFilter();
        } else {
            if (ameIndx !== -1) {
                if (ameIndx > -1) {
                    const newInitData = [...initData];
                    newInitData.splice(ameIndx, 1);
                    setInitData(newInitData);
                }
            
                if (ind > -1) {
                    const newFilteredData = [...filteredData];
                    newFilteredData.splice(ind, 1);
                    setFilteredData(newFilteredData);
                }
            }
        }
    }

    const browse = (c?:number) => {
        setOnBrowseFilter(true);
        let queryParams: any = {
            count: c? c : INTIAL_OFFSET,
            page: pageNumber,
            search: searchQuery,
            sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
        };
        if (filteredData.length > 0) {
            if (queryParams.amenities !== undefined && queryParams.amenities.length > 0) {
                filteredData.forEach((element: any) => {
                    queryParams.amenities.push(element);
                });
            } else {
                filteredData.forEach((element: any) => {
                    if (queryParams.amenities == undefined) {
                        queryParams['amenities'] = [element];
                    } else {
                        queryParams.amenities.push(element);
                    }
                })
            }
        }

        fetchData(1, count, queryParams);
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
        const visibleColumns = ALL_PROPERTY_TABLE_COLUMNS.filter(col => col.visible);

        const headers = visibleColumns.map(col => col.label);
        const keys = visibleColumns.map(col => col.id);

        const apiResponse = rowData;
    
        exportToXlsx(headers, keys, apiResponse, 'Available_Properties.xlsx');
    }

    return (
        <>
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
                <div ref={filterRef} className="filter-tab" onClick={() => applyFilters()}>
                    <img src={filterIcon} alt="Filter" /> Filter
                    {
                        applyFilter == 1 ?
                            <>
                                <div  className="drop-text-filter">
                                    <div className="hdtext">Filter</div>
                                    <ul>
                                        <li key={0} onClick={(e) => showCategoriesList(e)}>Categories</li>
                                        <li key={1} onClick={(e) => showAmmenitiesList(e)}>Amenities</li>
                                    </ul>
                                </div>
                            </>
                            :
                            null
                    }
                    {
                        showCategories ?
                            <div ref={categoryRef} className="drop-text-filter">
                                {(categories).map((cat: any, key: any) => (
                                    <ul>
                                        <li key={cat} className={`${initData.some((item: any) => item.label === cat && item.type === 'category') ? "selected" : ""}`} onClick={(e: any) => applyCategories(e, cat)}>
                                            {cat}
                                        </li>
                                    </ul>
                                ))}
                            </div>
                            :
                            null
                    }
                    {
                        showAmmenities ?
                            <div ref={amenityFilterRef} className="drop-text-filter">
                                {
                                    amenitiesList.length == 0 ?
                                    <ul>
                                            <li onClick={() => applyFilters()}>
                                                No Data
                                            </li>
                                        </ul>
                                    :
                                    <>
                                        {(amenitiesList).map((amm: any, key: any) => (
                                        <ul>
                                            <li key={key} className={`${initData.some((item: any) => item.label === amm.label && item.type === 'amenity') ? "selected" : ""}`} onClick={(e: any) => applyAmenities(e, amm)}>
                                                {amm.label}
                                            </li>
                                        </ul>
                                        ))}

                                    </>
                                }
                                
                            </div>
                            :
                            null

                    }
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
                    <img src={plusWhite} alt="Icon" /> New Property
                </button>
                {initData.length > 0 ?

                    <button className="btn primary ml-4 _apply_filter"  onClick={() => count > 0 ? browse(count) : browse()}>
                        Apply Filter
                    </button>
                    :
                    null
                }
            </div>
            <div className="filter-added">
                {
                    initData && initData.length ?
                        <>
                            <div className="bdr" onClick={clearFilter}>
                                <button>Clear Filter</button>
                            </div>

                            <ul>
                                {/* <li>
                                <span>Minimum Lease Term </span>160 Days <img src={closeIcon} alt="Icon" />
                            </li> */}
                                {initData.map((col: any, key: any) => (
                                    <li key={col}>
                                        {col.label} <img src={closeIcon} alt="Icon" onClick={() => removeFilter(col.value, col)} />
                                    </li>
                                ))}

                            </ul>
                        </>
                        :
                        null
                }
            </div>
            <div className="table-section-common when-filter-added">
                <Table responsive className="table-7-column">
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
                                ))}
                        </tr>
                    </thead>
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
                                                                col.id == 'propertyName' ?
                                                                    <Link to={ROUTE_NAVIGATION_PATH.UPDATE_PROPERTY + '/' + data._id + '/' + 2}>
                                                                        <div className="t-user">
                                                                            <div className="t-user-icon">
                                                                                <img src={buildingIcon} alt="icon" />
                                                                            </div>
                                                                            <div className="t-user-info">{data.propertyName}</div>
                                                                        </div>
                                                                    </Link>
                                                                    :
                                                                    (
                                                                        col.id == 'lastQcDate' ?
                                                                            <>
                                                                                {data[col.id] ? formatDate(data[col.id]) : 'NA'}
                                                                                <p className="_font">{data.lastQcBy}</p>
                                                                            </>
                                                                            :
                                                                            col.id == 'birdwatch' ?
                                                                                <div className={`t-user _action ${data[col.id] ? '' : '_not'}`}>
                                                                                    <div className="t-user-icon">
                                                                                        <img src={data[col.id] ? greenIcon : crossIcon} alt="icon" />
                                                                                    </div>
                                                                                    <div className="t-user-info">{(data[col.id] ? 'Yes' : 'No')}</div>
                                                                                </div>
                                                                                :
                                                                                (
                                                                                    col.isBoolean ?
                                                                                        <div className={`t-user _action ${data[col.id] === capitalizeFirstWord('Yes') ? '' : '_not'}`}>
                                                                                            <div className="t-user-icon">
                                                                                                <img src={data[col.id] === capitalizeFirstWord('Yes') ? greenIcon : crossIcon} alt="icon" />
                                                                                            </div>
                                                                                            <div className="t-user-info">{capitalizeFirstWord(data[col.id])}</div>
                                                                                        </div>
                                                                                        : (col.formateDate ? (data[col.id] ? formatDate(data[col.id]) : '-') : (data[col.id] ? data[col.id] : 'NA'))
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