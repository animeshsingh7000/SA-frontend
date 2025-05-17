import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams, useSearchParams, } from "react-router-dom";
import buildingIcon from "../../../assets/images/building.svg";
import sortIcon from "../../../assets/images/Sort.svg";
import Table from 'react-bootstrap/Table';
import { getRentalInquirySuggestedProperties, updateSuggestedPropStatus } from "../../../api/admin/renterInquiry";
import { AxiosError } from "axios";
import { formatDate } from "../../../utils/common";
import { NoData } from "../../../components";
import { Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import downArrow from "../../../assets/images/down-arrow2.png";
import checkgrey from "../../../assets/images/checkgrey.svg";
import filterIcon from "../../../assets/images/filter-icon.svg";
import displayIcon from "../../../assets/images/display.svg";
import SearchBar from "../../../components/SearchBar";
import { toast } from 'react-toastify';
import { SUGGESTED_TABLE_COLUMNS } from "../../../constants/Filters";
import { MINIMUM_LEASE, STUDIO, SuggestionPropertyFilters } from "../../../constants";
import DatePicker from "react-datepicker";
import Datetime from 'react-datetime';
import closeIcon from "../../../assets/images/close.svg";
import { format } from "date-fns";

const INTIAL_OFFSET = 10;
type SortType = Record<string, 1 | -1>;

const SuggestedProperty: React.FC = () => {
    const [initData, setInitData] = useState<any>({
        parking: "",
        pets: "",
        bedroom: [],
        bedroomTitle: [],
        budgetMin: "",
        budgetMax: "",
        neighbourhoodsNames: [],
        arrivalStart: "",
        arrivalEnd: "",
        arrivalUntil: "",
        minimumLeaseTerm: "",
    });
    const [rowData, setRowData] = useState<any[]>([]);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [loader, setLoader] = useState(false);
    const params = useParams();
    const handleSubmitRef = useRef<() => void>(() => { }); // Create a ref to store the handleSubmit function
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string | null>("");
    const effectRan = useRef(false);
    const [paginationPageSize, setPaginationPageSize] =
        useState<number>(INTIAL_OFFSET);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [sortBy, setSortBy] = useState<SortType>({ createdAt: -1 });
    const divRef = useRef<HTMLDivElement>(null);
    // const filterRef = useRef<HTMLDivElement>(null);
    const [openToggle, setOpenToggle] = useState<number | null>(null); // Track which toggle is open
    // const [openFilter, setOpenFilter] = useState<any>(false);
    const [spin, setSpin] = useState(false);
    const [type, setType] = useState("");
    const [columns, setColumns] = useState(SUGGESTED_TABLE_COLUMNS);
    const [applyDisplay, setApplyDisplay] = useState<any>(false);
    const displayRef = useRef<HTMLDivElement>(null);
    const [studio, setStudio] = useState<any>(STUDIO);
    const [values, setValues] = useState<number[]>([2000, 15000]);
    const [parkingValue, setParkingValue] = useState<any>("");
    const [arrivalStareDateValue, setArrivalStareDateValue] = useState<any>("");
    const [arrivalEndValue, setArrivalEndValue] = useState<any>("");
    const [arrivalUntilValue, setArrivalUntilValue] = useState<any>("");
    const [minimumLeaseValue, setMinimumLeaseValue] = useState<any>("");
    const [bedroomValue, setBedroomValue] = useState<any>([]);
    const [neighbourhoodsValues, setneighbourhoodsValues] = useState<any>([]);
    const [neighbourhoodsNames, setneighbourhoodsNames] = useState<any>([]);
    const [petAllowed, setpetAllowed] = useState<any>("");
    const [showArrivalDate, setArrivalDate] = useState<any>(null);
    const [showArrivalEnd, setArrivalEnd] = useState<any>(null);
    const [showArrivalUntil, setArrivalUntil] = useState<any>(null);
    const [showBudget, setShowBudget] = useState(false);
    const [showBedrooms, setShowBedrooms] = useState(false);
    const [showNeighbourhoods, setShowNeighbourhoods] = useState(false);
    const [showMinimumLease, setShowMinimumLease] = useState(false);
    const [filterNeighbourhood, setFilterNeighbourhood] = useState((localStorage.getItem("neighbourhood")
        ? JSON.parse(localStorage.getItem("neighbourhood") as string)
    : []));
    const dateArrivalPickerRef = useRef<DatePicker>(null);
    const dateDeparturePickerRef = useRef<DatePicker>(null);
    const datetimeRef = useRef<Datetime>(null); 
    const filterRef = useRef<HTMLDivElement>(null);
    const [openFilter, setOpenFilter] = useState<any>(false);
    const [onBrowseFilter, setOnBrowseFilter] = useState<any>(false);


    useEffect(() => {
        if (searchParams.get("query") !== searchQuery) {
            setPageNumber(1);
            setSearchQuery(searchParams.get("query"));
        }
    }, [searchParams]);

    useEffect(() => {
        setLoader(true);
        let data = {
            count: paginationPageSize,
            page: pageNumber,
            search: searchQuery,
            sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
        }
        fetchData(data);
    }, [pageNumber, searchQuery]);

    const fetchData = (queryParams:any) => {
        getRentalInquirySuggestedProperties(params.id, queryParams)
            .then((res: any) => {
                setRowData(res.data);
                setTotalRows(res.count);
                setLoader(false);
            })
            .catch((error: AxiosError<{ message: string; status: number }>) => {
                setLoader(false);
            });
    }

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
        setPageNumber(1);
    };

    const handleClickOutside = (event: any) => {
        // If the click is outside the div, hide the div
        if (divRef.current && !divRef.current.contains(event.target)) {
            setOpenToggle(null);
            setRowData(prevRowData => {
                const updatedRowData = prevRowData.map(item => ({
                    ...item,
                    type: "" // Set type to an empty string for each item
                }));
                return updatedRowData;
            });
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

    const handleToggleClick = (index: any) => {
        setOpenToggle(openToggle === index ? null : index);
    };

    const updateOiStatus = (e: any, preference: string, status: string, id: string, index: any) => {
        if (!status) {
            e.stopPropagation();
            return;
        }

        if (status === 'default') {
            handleToggleClick(index);
        } else {
            setSpin(true);
            updateSuggestedPropStatus({
                // updateType: status,
                propertyId: id,
                rentalInquiryId: params.id
            })
                .then((res) => {
                    toast.success(`Property Updated!!!`)
                    setSpin(false);
                    setRowData(prevRowData => prevRowData.filter(row => row._id !== id));
                    setOpenToggle(null);

                })
                .catch((error: AxiosError<{ message: string; status: number }>) => {
                    setSpin(false);
                    toast.error(error.response?.data?.message as string);
                });
        }

    };

    const updateType = (e: any, pre: string, index: any) => {
        e.stopPropagation();
        setRowData(prevRowData => {
            const updatedRowData = [...prevRowData]; // Shallow copy of the array
            updatedRowData[index] = { ...updatedRowData[index], type: pre }; // Update the status of the object at index
            return updatedRowData;
        });
    }

    const closePreference = (index: any) => {
        setOpenToggle(null);
        setRowData(prevRowData => {
            const updatedRowData = [...prevRowData]; // Shallow copy of the array
            updatedRowData[index] = { ...updatedRowData[index], type: "" }; // Update the status of the object at index
            return updatedRowData;
        });
    }

    function toggleColumnVisibility(id: any) {
        setColumns((prevColumns) =>
            prevColumns.map((col) =>
                col.id === id ? { ...col, visible: !col.visible } : col
            )
        );
    }

    function removeFilterOnSearch(e: any, value: any) {
        if (e == "budgetMin") {
          setValues([
            2000, 15000,
          ]);
          setInitData((prevState: any) => ({
            ...prevState,
            [e]: [],
          }));
        } else if (e == 'neighbourhoodsNames') {
          if (neighbourhoodsNames.includes(value)) {
            let inde = neighbourhoodsNames.indexOf(value);
            if (inde !== -1) {
              neighbourhoodsValues.splice(inde, 1);
              neighbourhoodsNames.splice(inde, 1);
            }
            setneighbourhoodsValues(neighbourhoodsValues);
            setneighbourhoodsNames(neighbourhoodsNames);
            setInitData((prevState: any) => ({
              ...prevState,
              neighbourhoodsNames: neighbourhoodsNames
            }));
          }
        } else if (e == "bedroomTitle") {
          let i = studio.findIndex((el: any) => el.show === value);
          let bedroomvalue = studio[i].value;
          setBedroomValue((prevValues: any) =>
            prevValues.filter((value: any) => value !== bedroomvalue)
          );
    
          let valueToRemove = studio[i].show;
          setInitData((prevData: any) => ({
            ...prevData,
            bedroom: prevData.bedroom.filter(
              (value: any) => value !== valueToRemove
            ),
            bedroomTitle: prevData.bedroomTitle.filter(
              (value: any) => value !== studio[i].show
            ),
          }));
          const newData = [...studio];
          newData[i].selected = false;
          setStudio(newData);
        } else if (e == "minimumLeaseTerm") {
            setInitData((prevState: any) => ({
                ...prevState,
                [e]: ""
            }));
            setMinimumLeaseValue("");
        } else if(e == "arrivalStart") {
            setInitData((prevState: any) => ({
                ...prevState,
                [e]: ""
            }));
            setArrivalStareDateValue("");
        } else if(e == "arrivalEnd") {
            setInitData((prevState: any) => ({
                ...prevState,
                [e]: ""
            }));
            setArrivalEndValue("");
        } else if(e == "arrivalUntil") {
            setInitData((prevState: any) => ({
                ...prevState,
                [e]: ""
            }));
            setArrivalUntilValue("");
        }  else {
          setInitData((prevState: any) => ({
              ...prevState,
              [e]: ""
          }));
          if (e == 'parking') {
              setParkingValue("");
          }
          if (e == 'pets') {
              setpetAllowed("");
          }
        }
    }

    const openDatePicker = (type: any) => {
        if (type == 1) {
          if (dateArrivalPickerRef.current) {
            dateArrivalPickerRef.current.setOpen(true);
          }
        } else {
          if (dateDeparturePickerRef.current) {
            dateDeparturePickerRef.current.setOpen(true);
          }
        }
    };

    function applyFilters() {
        
        if(showBedrooms) {
            setShowBedrooms(!showBedrooms);
        } else if(showNeighbourhoods) {
            setShowNeighbourhoods(!showNeighbourhoods);
        } else if(showMinimumLease) {
            setShowMinimumLease(!showMinimumLease);
        } else {
            setOpenFilter(!openFilter);
        }        
    }

    function setFilters(event:any, e:any) {
        // event.stopPropagation();
        if (e == "budgetMin") {
            //
        } else if(e == "bedroomTitle"){
           setShowBedrooms(!showBedrooms);
            
        } else if(e == "minimumLeaseTerm") {
            setShowMinimumLease(!showMinimumLease)
        } else if(e == "neighbourhoodsNames") {
            setShowNeighbourhoods(!showNeighbourhoods);
        } else if(e == "arrivalStart") {
            setArrivalDate(!showArrivalDate);
        } else if(e == "arrivalEnd") {
            setArrivalDate(!showArrivalEnd);
        } else if(e == "arrivalUntil") {
            setArrivalDate(!showArrivalUntil);
        } else {
            if(e == 'pets') {
                applyPets('Pet Friendly');
            } else {
                applyParking('With Parking')
            }
        }

    }

    function applyParking(value: any) {
        if (parkingValue) {
          setInitData((prevState: any) => ({
            ...prevState,
            parking: ""
          }));
          setParkingValue("");
        } else {
          setInitData((prevState: any) => ({
            ...prevState,
            parking: value
          }));
          setParkingValue(value);
        }
    }
    
    function applyPets(value: any) {
        if (petAllowed) {
            setInitData((prevState: any) => ({
            ...prevState,
            pets: ""
            }));
            setpetAllowed("");
        } else {
            setInitData((prevState: any) => ({
            ...prevState,
                pets: value
            }));
            setpetAllowed(value);
        }
    }

    function applyNeighbourhood(e: any, title:any) {
        if (neighbourhoodsValues.includes(e)) {
          var index = neighbourhoodsValues.indexOf(e);
          if (index !== -1) {
            neighbourhoodsValues.splice(index, 1);
            neighbourhoodsNames.splice(index, 1);
          }
          setneighbourhoodsValues(neighbourhoodsValues);
          setneighbourhoodsNames(neighbourhoodsNames);
          setInitData((prevState: any) => ({
            ...prevState,
            // neighbourhoods: neighbourhoodsValues,
            neighbourhoodsNames: neighbourhoodsNames
          }));
        } else {
          setneighbourhoodsValues([...neighbourhoodsValues, e]);
          setneighbourhoodsNames([...neighbourhoodsNames, title]);
          setInitData((prevState: any) => ({
            ...prevState,
            // neighbourhoods: [...neighbourhoodsValues, e],
            neighbourhoodsNames: [...neighbourhoodsNames, title]
          }));
        }
    }

    function setBedRoomSelection(id: any) {
        const newData = [...studio];
        if (newData[id].selected) {
          newData[id].selected = false;
        } else {
          newData.forEach((el: any) => {
            // el.selected = false;
            if (el.id == id) {
              el.selected = true
            }
          })
        }
    
        setStudio(newData);
        applyBedroom();
    }

    function applyBedroom() {
        let data: any = studio.filter((item: any) => (item.selected === true));
        if (data.length > 0) {
          data.forEach((element: any) => {
            if (bedroomValue.includes(element.value)) {
              var index = bedroomValue.indexOf(element.value);
              if (index !== -1) {
                let i = studio.findIndex((el: any) => el.show === element.show);
                let valueToRemove = studio[i].show;
                bedroomValue.splice(index, 1);
                setInitData((prevData: any) => ({
                  ...prevData,
                  bedroom: prevData.bedroom.filter((value: any) => value !== studio[i].value),
                  bedroomTitle: prevData.bedroomTitle.filter((value: any) => value !== studio[i].show)
                }));
              }
            }
            setBedroomValue((prevItems: any) => [...prevItems, element.value]);
            setInitData((prevState: any) => ({
              ...prevState,
              bedroom: [...prevState.bedroom, element.value],
              bedroomTitle: [...prevState.bedroomTitle, element.show]
            }));
          });
        } else {
          setInitData((prevState: any) => ({
            ...prevState,
            bedroom: [],
            bedroomTitle: []
          }));
          setBedroomValue([]);
        }
    
        setShowBedrooms(false);
    }

    function applyMinimumResevations(e: any) {
        if (minimumLeaseValue) {
            setInitData((prevState: any) => ({
                ...prevState,
                minimumLeaseTerm: ""
            }));
            setMinimumLeaseValue("");
        } else {
            setInitData((prevState: any) => ({
                ...prevState,
                minimumLeaseTerm: e
            }));
            setMinimumLeaseValue(e);
        }
    }

    function resetFilter() {
        setInitData({
            parking: "",
            pets: "",
            bedroom: [],
            bedroomTitle: [],
            budgetMin: "",
            budgetMax: "",
            neighbourhoodsNames: [],
            arrivalStart: "",
            arrivalEnd: "",
            arrivalUntil: "",
            minimumLeaseTerm: "",
        })
        setParkingValue("");
        setpetAllowed("");
        setValues([2000, 15000]);
        setArrivalUntilValue("");
        setArrivalStareDateValue("");
        setArrivalEndValue("");
        setBedroomValue([]);
        setStudio(STUDIO);
        setneighbourhoodsValues([]);
        setneighbourhoodsNames([]);
        if(onBrowseFilter) {
            setSearchQuery("");
            setOnBrowseFilter(false);
        }
    }

    const onBrowse = () => {
        setOnBrowseFilter(true);
        let queryParams: any = {
            count: paginationPageSize,
            page: pageNumber,
            search: searchQuery,
            sortby: sortBy ? JSON.stringify(sortBy) : JSON.stringify({ createdAt: -1 }),
        };
        
        if (parkingValue) {
            queryParams.isParking = true
        } 
      
        if (petAllowed) {
            queryParams.isPetAllowed = true;
        }

        if(minimumLeaseValue) {
            queryParams.minimumLeaseTerm = minimumLeaseValue;
        }

        if(arrivalStareDateValue) {
            queryParams.arrivalStart = format(arrivalStareDateValue, 'YYYY-MM-DD');
        }

        if(arrivalEndValue) {
            queryParams.arrivalEnd = format(arrivalEndValue, 'YYYY-MM-DD');
        }

        if(arrivalUntilValue) {
            queryParams.arrivalUntil = format(arrivalUntilValue, 'YYYY-MM-DD');
        }

        if (bedroomValue.length > 0) {
            if (queryParams.bedrooms !== undefined && queryParams.bedrooms.length > 0) {
              bedroomValue.forEach((element: any) => {
                queryParams.bedrooms.push(element);
              });
            } else {
              bedroomValue.forEach((element: any) => {
                if (queryParams.bedrooms == undefined) {
                  queryParams['bedrooms'] = [element];
                } else {
                  queryParams.bedrooms.push(element);
                }
              })
            }
          } else {
            queryParams['bedrooms'] = [];
        }

        if (neighbourhoodsValues.length > 0) {
            if (queryParams.neighborhoods !== undefined && queryParams.neighborhoods.length > 0) {
              neighbourhoodsValues.forEach((element: any) => {
                queryParams.neighborhoods.push(element);
              });
            } else {
              neighbourhoodsValues.forEach((element: any) => {
                if (queryParams.neighborhoods == undefined) {
                  queryParams['neighborhoods'] = [element];
                } else {
                  queryParams.neighborhoods.push(element);
                }
              })
            }
        }
        

        fetchData(queryParams);
    }

    return (
        <>
            {/* Rental  Inquiry edit form  start */}

            <div className="table-action-content ">
                <div className="filter-tab" onClick={() => applyFilters()}>
                  <img src={filterIcon} alt="Filter" /> Filter
                    {
                        openFilter ?
                            <>
                                <div ref={filterRef} className="drop-text-filter">
                                    <div className="hdtext">Filter</div>
                                    <ul>
                                        {(SuggestionPropertyFilters).map((data: any, key: any) => (
                                            <li onClick={(e:any) => setFilters(e, data.value)}>{data.label}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        :
                        null
                    }
                    {
                        showBedrooms ? 
                        <>
                            <div ref={filterRef} className="drop-text-filter">
                                <ul>
                                    {studio.map((data: any, key: any) => (
                                        <li key={data.title} className={`${data.selected ? "selected" : ""}`} onClick={() => setBedRoomSelection(key)}>
                                            {data.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                        :
                        showNeighbourhoods ?
                        <>
                            <div ref={filterRef} className="drop-text-filter">
                                <ul>
                                    {filterNeighbourhood.map((ame: any, key: any) => (
                                        <li key={ame.name} className={`${neighbourhoodsNames.some((item: any) => item === ame.name) ? "selected" : ""}`} onClick={(e: any) => applyNeighbourhood(ame._id, ame.name)}>
                                            {ame.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                        :
                        showMinimumLease ?
                        <>
                            <div ref={filterRef} className="drop-text-filter">
                                <ul>
                                    {(MINIMUM_LEASE).map((cat: any, key: any) => (
                                        <li key={key} className={`${(minimumLeaseValue === cat) ? "selected" : ""}`} onClick={() => applyMinimumResevations(cat.value)}>
                                            {cat.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                        :
                        showArrivalDate ?
                        <>
                            <div className="calendar_suggested" onClick={(e) => e.stopPropagation()}>
                                <DatePicker
                                    selected={arrivalStareDateValue}
                                    onChange={(date) => { 
                                        setInitData((prevState: any) => ({
                                            ...prevState,
                                            arrivalStart: date ? 'Arrival Start: ' +  format(date, 'dd-MM-yyyy') : ''
                                        }));
                                        setArrivalStareDateValue(date);
                                        setArrivalDate(false)
                                    }}
                                    onClickOutside={(e) => { e.stopPropagation(); setArrivalDate(false) }} 
                                    inline
                                />
                            </div>
                        </>
                        :
                        showArrivalEnd ?
                            <>
                                <DatePicker
                                    selected={arrivalEndValue}
                                    onChange={(date) => { 
                                        setInitData((prevState: any) => ({
                                            ...prevState,
                                            arrivalEnd: date ? 'Arrival End: ' + format(date, 'dd-MM-yyyy') : ''
                                        }));
                                        setArrivalEndValue(date);
                                        setArrivalEnd(false)
                                    }}
                                    onClickOutside={(e) => { e.stopPropagation(); setArrivalEnd(false) }}
                                    inline
                                />
                            </>
                        :
                        showArrivalUntil ?
                            <>
                                <DatePicker
                                    selected={arrivalUntilValue}
                                    onChange={(date) => { 
                                        setInitData((prevState: any) => ({
                                            ...prevState,
                                            arrivalUntil: date ? 'Arrival Until: ' +  format(date, 'dd-MM-yyyy') : ''
                                        }));
                                        setArrivalUntilValue(date);
                                        setArrivalUntil(false)
                                    }}
                                    onClickOutside={(e) => { e.stopPropagation(); setArrivalUntil(false) }}
                                    inline
                                />
                            </>
                        :
                        null
                    }
                </div>
                <div className={`display-tab ${applyDisplay ? 'active' : ''}`} onClick={() => setApplyDisplay(!applyDisplay)}>
                    <img src={displayIcon} alt="display" /> Display
                    {
                        applyDisplay ?
                            <>
                                <div ref={displayRef} className="drop-text-display scrollbar">
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
                {
                    !Object.values(initData).some(value => {
                        if (typeof value === 'string') {
                            return value.trim() !== '';
                        } else if (Array.isArray(value)) {
                            return value.length > 0;
                        } else {
                            return false;
                        }
                    }) ?
                    <>
                    </>
                    :
                    <button className="btn primary ml-4 _apply_filter _staticbtn" onClick={onBrowse}>
                        Apply Filter
                    </button>
                }
                {/* <button className="btn primary">
                  <img src={plusWhite} alt="Icon" /> New Property
                </button> */}
                <div className="filter-added">
                    {
                    !Object.values(initData).some(value => {
                        if (typeof value === 'string') {
                            return value.trim() !== '';
                        } else if (Array.isArray(value)) {
                            return value.length > 0;
                        } else {
                            return false;
                        }
                    }) ?
                    <>
                    </>
                    :
                    <ul className="chips-wrapper">
                            <div className="bdr" onClick={resetFilter}>
                                <button>Clear Filter</button>
                            </div>
                            {Object.entries(initData).map(([key, value]) => (
                                <React.Fragment key={key}>
                                    {(key !== 'bedroom') ?
                                    <>
                                        {
                                        Array.isArray(value) && value.length > 0 ? (
                                            <>
                                            {
                                                value.map((col, index) => (
                                                    <>
                                                        <li key={col}>
                                                            {col} <img src={closeIcon} alt="Icon" onClick={() => removeFilterOnSearch(key, col)} />
                                                        </li>
                                                    </>
                                                ))
                                            }

                                            </>
                                        ) : (
                                            value != "" && (
                                                <>
                                                    <li key={key}>
                                                        <>{value}</>
                                                        <img src={closeIcon} alt="close" onClick={() => removeFilterOnSearch(key, value)} />
                                                    </li>
                                                </>
                                            )
                                        )}
                                    </>
                                    :
                                    null
                                    }
                                </React.Fragment>
                            ))}
                    </ul>
                    }
                </div>
            </div>
            <div className="table-section-common _suggested-property-table">
                <Table responsive className="suggestedTable">
                    <thead>
                        <tr>

                            {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                    <th key={col.id} className={` ${col.label == 'Preference' ? 'actionSticky _perth' : (col.label == 'Bedroom' || col.label == 'Full Baths' || col.label == 'Half Baths' ? 'min100' : '')}`}>
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
                        {spin ? <div className="spinner-wrapper"><Spinner /></div> : null}
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
                                                <tr key={key}>
                                                    {columns
                                                        .filter((col) => col.visible)
                                                        .map((col) => (
                                                            <>

                                                                <td key={col.id} className={col.id == 'preference' ? 'actionSticky' : ''}>
                                                                    {
                                                                        col.id == 'propertyUrl' ?
                                                                            <Link
                                                                                to={'/' + (data.Unit.Address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') +'/' + data?.Unit?.Id}
                                                                                title={data?.Unit?.Address?.AddressLine1 + (data?.Unit?.Address?.AddressLine2 || data?.Unit?.Address?.AddressLine3 ? " " : ", ") + (data?.Unit?.Address?.AddressLine2 ? data?.Unit?.Address?.AddressLine2 + (data?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (data?.Unit?.Address?.AddressLine3 ? data?.Unit?.Address?.AddressLine3 + ", " : "") + data?.Unit?.Address?.City + ", " + data?.Unit?.Address?.State + " " + data?.Unit?.Address?.PostalCode}
                                                                            >
                                                                                <div className="t-user">
                                                                                    
                                                                                        <div className="t-user-icon">
                                                                                            <img src={buildingIcon} alt="icon" />
                                                                                        </div>
                                                                                        <div className="t-user-info">{data[col.id]}</div>
                                                                                    
                                                                                </div>
                                                                            </Link>
                                                                            :
                                                                            (

                                                                                col.isBoolean ? (data[col.id] ? 'Yes' : 'No') :
                                                                                    (
                                                                                        col.formateDate ? (data[col.id] ? formatDate(data[col.id]) : '-'
                                                                                        )

                                                                                            :
                                                                                            (
                                                                                                col.id !== 'preference' ? data[col.id] :

                                                                                                    <div className="action-tab " onClick={() => handleToggleClick(key)}>
                                                                                                        {
                                                                                                            data.type ?
                                                                                                                <button className={`table-button  ${data.type === 'Matching Property' ? '_favorited' : (data.type === 'disliked') ? '_disliked' : '_set'}`} >
                                                                                                                    {data.type === 'Matching Property' ? 'Matching Property' : (data.type === 'disliked') ? 'Disliked' : 'Set Preference'}
                                                                                                                </button>
                                                                                                                :
                                                                                                                <button className={`table-button  ${data.preference === 'Matching Property' ? '_favorited' : (data.preference === 'disliked') ? '_disliked' : '_set'}`} >
                                                                                                                    {data.preference === 'Matching Property' ? 'Matching Property' : (data.preference === 'disliked') ? 'Disliked' : 'Set Preference'}
                                                                                                                </button>
                                                                                                        }


                                                                                                        {
                                                                                                            data.preference ?
                                                                                                                <>
                                                                                                                    <div className="arrowimages">
                                                                                                                        <img className="arrowdown _toparrow" src={downArrow} alt="Arrow" />
                                                                                                                        <img className="arrowdown" src={downArrow} alt="Arrow" />
                                                                                                                    </div>


                                                                                                                </>
                                                                                                                :
                                                                                                                null
                                                                                                        }

                                                                                                    </div>
                                                                                            )

                                                                                    )
                                                                            )

                                                                    }


                                                                </td>
                                                                {
                                                                    col.id === 'preference' && openToggle == key ?
                                                                     <div className="sticky_right_per" ref={divRef}>
                                                                        <div  className="drop-text-action _preference-drop">
                                                                            <div className="hdtext">Status</div>
                                                                            <ul className="setPreference">
                                                                                <li className={`${data.preference == 'deafult' ? 'active' : ''}`} onClick={(e: any) => updateType(e, "default", key)}>
                                                                                    Default
                                                                                    {
                                                                                        data.preference == 'deafult' || data.type == 'deafult' ?
                                                                                            <img src={checkgrey} alt="" />
                                                                                            :
                                                                                            null
                                                                                    }
                                                                                </li>
                                                                                <li onClick={(e: any) => updateType(e, "Matching Property", key)} className={`${data.preference == 'Matching Property' ? 'active' : ''}`}>
                                                                                    <button className={`table-button _favorited`} >
                                                                                        Matching Property
                                                                                        {
                                                                                            data.preference == 'Matching Property' || data.type == 'Matching Property' ?
                                                                                                <img src={checkgrey} alt="" />
                                                                                                :
                                                                                                null
                                                                                        }
                                                                                    </button>
                                                                                </li>
                                                                                {/* <li onClick={(e: any) => updateType(e, "disliked", key)} className={`${data.preference == 'disliked' ? 'active' : ''}`} >
                                                                                    <button className={`table-button _disliked`} >
                                                                                        Disliked
                                                                                        {
                                                                                            data.preference == 'disliked' || data.type == 'disliked' ?
                                                                                                <img src={checkgrey} alt="" />
                                                                                                :
                                                                                                null
                                                                                        }
                                                                                    </button>
                                                                                </li> */}
                                                                            </ul>
                                                                            <div className="preference-footer">
                                                                                <button className="button-pre _cancel" onClick={() => closePreference(key)}>Cancel</button>
                                                                                <button className="button-pre" onClick={(e: any) => updateOiStatus(e, data.preference, data.type, data._id, key)}>Apply</button>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                }
                                                            </>
                                                        ))}

                                                </tr>
                                            ))}
                                        </>
                                        :
                                        <div className="renter_data_msg"><NoData /></div>

                                }

                            </tbody>
                    }
                </Table>
                {
                    totalRows > INTIAL_OFFSET
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
                            />
                        </div>
                        :
                        null
                }
            </div>
        </>
    );
};

export default SuggestedProperty;
