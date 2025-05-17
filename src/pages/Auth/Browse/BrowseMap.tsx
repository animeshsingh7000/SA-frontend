import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Footer, Header } from "../../";
import { attacheProperty, configuration } from "../../../api";
import placeHolder from "../../../assets/images/placeHolder.png";
import MapView from "../../../components/GoogleMap/MapView";
import Spinner from "../../../components/Spinner";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { NoData } from "../../../components";
import { formatDate, formatDate1 } from "../../../utils/common";
import { FILTER_NEIGHBORHOOD, STUDIO } from "../../../constants";
import { Range } from 'react-range';
import close from "../../../assets/images/close-icon.svg";
import downArrow from "../../../assets/images/right-arrow.svg";
import DatePicker from "react-datepicker";
import Datetime from 'react-datetime';

export default function BrowseMap() {
    const fromProperty = new URLSearchParams(document.location.search).get('fromProperty');

    const [items, setItems] = useState<any>([]);
    let [localStorageValue, setLocaltorageValue] = useState<any>(
        fromProperty == '1' && localStorage.getItem("initData")
            ? JSON.parse(localStorage.getItem("initData") as string)
            : null
    );
    const location = useLocation();
    const [initData, setInitData] = useState<any>({
        parking: localStorageValue && localStorageValue.parking ? localStorageValue.parking : "",
        pets: localStorageValue && localStorageValue.pets ? localStorageValue.pets : "",
        bedroom: localStorageValue && localStorageValue.bedroom ? localStorageValue.bedroom : [],
        bedroomTitle: localStorageValue && localStorageValue.bedroomTitle ? localStorageValue.bedroomTitle : [],
        budgetMin: localStorageValue && localStorageValue.budgetMin ? localStorageValue.budgetMin : "",
        budgetMax: localStorageValue && localStorageValue.budgetMax ? localStorageValue.budgetMax : "",
        // arrivalDate: localStorageValue && localStorageValue.arrivalDate ? localStorageValue.arrivalDate : null,
        // departureDate: localStorageValue && localStorageValue.departureDate ? localStorageValue.departureDate : null,
        neighbourhoods: localStorageValue && localStorageValue.neighbourhoods ? localStorageValue.neighbourhoods : [],
        neighbourhoodsNames: localStorageValue && localStorageValue.neighbourhoodsNames ? localStorageValue.neighbourhoodsNames : [],
        amenities: localStorageValue && localStorageValue.amenities ? localStorageValue.amenities : [],
        amenitiesNames: localStorageValue && localStorageValue.amenitiesNames ? localStorageValue.amenitiesNames : [],
    });
    const [loader, setLoader] = useState(true);
    const [searchParams, setSearchParams] = useState("");
    const fromFooter = new URLSearchParams(document.location.search).get('fromFooter');
    const effectRan = useRef(false);
    const [markers, setMarkers] = useState<any[]>([]);
    const [filter, setFilter] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);
    const [showNeighbourhoods, setShowNeighbourhoods] = useState(false);
    const [showBudget, setShowBudget] = useState(false);
    const [showBedrooms, setShowBedrooms] = useState(false);
    const [parkingValue, setParkingValue] = useState<any>(localStorageValue && localStorageValue.parking ? localStorageValue.parking : "");
    const [petAllowed, setpetAllowed] = useState<any>(localStorageValue && localStorageValue.pets ? localStorageValue.pets : "");
    const [bedroomValue, setBedroomValue] = useState<any>(localStorageValue && localStorageValue.bedroom ? localStorageValue.bedroom : []);
    const [amenitiesValues, setAmenitiesValues] = useState<any>(
        localStorageValue && localStorageValue.amenities ? localStorageValue.amenities : []
    );
    const [amenitiesNames, setamenitiesNames] = useState<any>(
        localStorageValue && localStorageValue.amenitiesNames ? localStorageValue.amenitiesNames : []
      );
    const [neighbourhoodsValues, setneighbourhoodsValues] = useState<any>(
        localStorageValue && localStorageValue.neighbourhoods ? localStorageValue.neighbourhoods : []
    );
    const [neighbourhoodsNames, setneighbourhoodsNames] = useState<any>(
        localStorageValue && localStorageValue.neighbourhoodsNames ? localStorageValue.neighbourhoodsNames : []
    );
    const [amenitiesList, setAmenitiesList] = useState<any>([]);
    const [isBudgetAppiled, setIsBudgetApplied] = useState<any>(false);
    const [studio, setStudio] = useState<any>(STUDIO);
    const [values, setValues] = useState<number[]>(initData.budgetMin ? [initData.budgetMin, initData.budgetMax] : [
        2000,
        15000
    ]);
    const [arrivalDate, setArrivalDate] = useState<any>(localStorageValue && localStorageValue.arrivalDate ? localStorageValue.arrivalDate : null);
    const [departureDate, setDepartureDate] = useState<any>(localStorageValue && localStorageValue.departureDate ? localStorageValue.departureDate : null);
    const dateArrivalPickerRef = useRef<DatePicker>(null);
    const dateDeparturePickerRef = useRef<DatePicker>(null);
    const datetimeRef = useRef<Datetime>(null); // Declare ref with Datetime type
    const [filterNeighbourhood, setFilterNeighbourhood] = useState((localStorage.getItem("neighbourhood")
        ? JSON.parse(localStorage.getItem("neighbourhood") as string)
    : []));
    const fullUrl = window.location.pathname;

    useEffect(() => {
        const removeQueryParams = () => {
            const { pathname } = location;
            window.history.replaceState({}, '', pathname);
        };

        removeQueryParams();
    }, [location]);


    useEffect(() => {
        if (!effectRan.current) {
            onBrowse();
        }
        return () => {
            effectRan.current = true;
        };
    }, [markers]);

    useEffect(() => {
        configuration.getSharedAmenitiesV2().then((res: any) => {
            const groupedAmenities = res.data.reduce((acc: any, amenity: any) => {
                if (!acc[amenity.category]) {
                  acc[amenity.category] = [];
                }
                acc[amenity.category].push(amenity);
                return acc;
              }, {});
              setAmenitiesList(groupedAmenities);
        });
    }, [])

    useEffect(() => {
        localStorage.setItem('initData', JSON.stringify(initData));
    }, [initData]);


    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        let obj: any = {};
        if (event.currentTarget.value) {
            obj['search'] = event.currentTarget.value;
        }
        attacheProperty.mapView(obj).then((res: any) => {
            setItems(res.data);
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior
    };

    function removeSearch() {
        setSearchParams("");
        attacheProperty.mapView().then((res: any) => {
            setItems(res.data);
        });
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

    const filterApply = () => {
        setFilter(!filter);
    }

    const amenitiesFilterApply = () => {
        setShowAmenities(!showAmenities);
        setShowBedrooms(false);
        setShowBudget(false);
    }

    const neighbourhoodFilterApply = () => {
        setShowNeighbourhoods(!showNeighbourhoods);
        setShowAmenities(false);
        setShowBedrooms(false);
        setShowBudget(false);
    }

    const bedRoomFilterApply = () => {
        setShowBedrooms(!showBedrooms);
        setShowAmenities(false);
        setShowBudget(false);
    }

    const budgetFilterApply = () => {
        setShowBudget(!showBudget);
        setShowAmenities(false);
        setShowBedrooms(false);
    }

    const selectedTrackStyle: React.CSSProperties = {
        position: 'absolute',
        height: '100%',
        background: '#007bff',
        borderRadius: '3px',
        top: '0',
        left: `${(values[0] / 15000) * 100}%`,
        width: `${((values[1] - values[0]) / 15000) * 100}%`
    };

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
        setShowBudget(false);
        setShowAmenities(false);
        setShowBedrooms(false);
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
        setShowBudget(false);
        setShowAmenities(false);
        setShowBedrooms(false);
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

    function applyBudget() {
        setIsBudgetApplied(true);
        setInitData((prevState: any) => ({
            ...prevState,
            budgetMin: '' + values[0] + '',
            budgetMax: '' + values[1] + ''
        }));
        setShowBudget(false);
    }

    function applyAmenities(e: any, title:any) {
        if (amenitiesValues.includes(e)) {
          var index = amenitiesValues.indexOf(e);
          if (index !== -1) {
            amenitiesValues.splice(index, 1);
            amenitiesNames.splice(index, 1);
          }
          setAmenitiesValues(amenitiesValues);
          setamenitiesNames(amenitiesNames);
          setInitData((prevState: any) => ({
            ...prevState,
            // amenities: amenitiesValues
            amenitiesNames: amenitiesNames
          }));
        } else {
          setAmenitiesValues([...amenitiesValues, e]);
          setamenitiesNames([...amenitiesNames, title]);
          setInitData((prevState: any) => ({
            ...prevState,
            //  amenities: [...amenitiesValues, e],
            amenitiesNames: [...amenitiesNames, title]
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

    function applyArrival(value: any) {
        // setInitData((prevState: any) => ({
        //   ...prevState,
        //   arrivalDate: formatDate1(value)
        // }));
        
        let setDate = new Date(value);
        if (!departureDate) {
            let arrival= new Date(value); 
            arrival.setMonth(arrival.getMonth() + 1); 
            setDepartureDate(arrival); 
        } else {
            let departure = new Date(departureDate);
            if(setDate > departure) {
                let arrival= new Date(value); 
                arrival.setMonth(arrival.getMonth() + 1); 
                setDepartureDate(arrival);
            }
        }
        setArrivalDate(setDate); 
    }
  
    function applyDeparture(value: any) {
      // setInitData((prevState: any) => ({
      //   ...prevState,
      //   departureDate: formatDate1(value)
      // }));
      setDepartureDate(value);
    }

    function removeFilterOnSearch(e: any, value: any) {
        if (e == 'budgetMin' || e == 'budgetMax') {
            setIsBudgetApplied(false);
            setValues([(e == 'budgetMin' ? 2000 : values[0]), (e == 'budgetMax' ? 15000 : values[1])])
            setInitData((prevState: any) => ({
                ...prevState,
                [e]: []
            }));
        }
        else if (e == 'amenitiesNames') {
            if (amenitiesNames.includes(value)) {
              let inde = amenitiesNames.indexOf(value);
              if (inde !== -1) {
                amenitiesValues.splice(inde, 1);
                amenitiesNames.splice(inde, 1);
              }
              setAmenitiesValues(amenitiesValues);
              setamenitiesNames(amenitiesNames);
              setInitData((prevState: any) => ({
                ...prevState,
                amenitiesNames: amenitiesNames
              }));
            }
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
        } else if (e == 'bedroomTitle') {
            let i = studio.findIndex((el: any) => el.show === value);
            let bedroomvalue = studio[i].value;
            setBedroomValue((prevValues: any) => prevValues.filter((value: any) => value !== bedroomvalue));

            let valueToRemove = studio[i].show;
            setInitData((prevData: any) => ({
                ...prevData,
                bedroom: prevData.bedroom.filter((value: any) => value !== valueToRemove),
                bedroomTitle: prevData.bedroom.filter((value: any) => value !== studio[i].show)

            }));
            const newData = [...studio];
            newData[i].selected = false;
            setStudio(newData);
        } else {
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

    const onBrowse = () => {
        let queryParams: any = {};

        if (parkingValue || localStorageValue && localStorageValue.parking) {
            queryParams.isParking = true
        } 
      
      
        if (petAllowed || localStorageValue && localStorageValue.pets) {
            queryParams.isPetAllowed = true;
        }

        if (isBudgetAppiled || localStorageValue && localStorageValue.budgetMin) {
            queryParams['budgetRange'] = [values[0], values[1]]
        }
        // if (bedroomValue) {
        //     queryParams['bedrooms'] = [bedroomValue];
        // }

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
        }

        if (amenitiesValues.length > 0) {
            if (queryParams.amenities !== undefined && queryParams.amenities.length > 0) {
                amenitiesValues.forEach((element: any) => {
                    queryParams.amenities.push(element);
                });
            } else {
                amenitiesValues.forEach((element: any) => {
                    if (queryParams.amenities == undefined) {
                        queryParams['amenities'] = [element];
                    } else {
                        queryParams.amenities.push(element);
                    }
                })
            }
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

        if (arrivalDate) {
            queryParams.availableDate = formatDate1(arrivalDate);
        }

        if (departureDate) {
            queryParams.departureDate = formatDate1(departureDate);
        }

        attacheProperty.mapView(queryParams).then((res: any) => {
            setItems(res.data);
            setMarkers(res.data);
            setLoader(false);
        });
    }

    return (
        <>
            <Header mainClass="with-btn" isNavButton={true} />
            <main className={`main-content browsetop ${filter ? 'active' : ""}`}>

                <>
                    <div className="filter-plugin-container">
                        <div className="main-filter">
                            <a
                                className="mobile-btn"
                                data-toggle="modal"
                                data-target="#mbSearchFilters"
                            >
                                <span className="pr-3">Filters</span>
                            </a>
                            <a className={`filter-btn d-none d-md-flex ${filter ? 'active' : ""}`} onClick={filterApply}>
                                <span className="pr-3">Filters</span>
                            </a>
                            <div className="filter-select">
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
                                            <input
                                                type="text"
                                                placeholder="Click on filters to sort browse results"
                                                readOnly
                                            />
                                        </>
                                        :
                                        <ul className="chips-wrapper">
                                            {Object.entries(initData).map(([key, value]) => (
                                                <React.Fragment key={key}>
                                                    {key != 'bedroom' ?
                                                        <>
                                                            {Array.isArray(value) && value.length > 0 ? (
                                                                <>
                                                                    {value.map((item, index) => (
                                                                        <>
                                                                            <li key={index}>
                                                                                {item}
                                                                                <span>
                                                                                    <img src={close} alt="close-1" onClick={() => removeFilterOnSearch(key, item)} />
                                                                                </span>
                                                                            </li>
                                                                        </>

                                                                    ))}
                                                                </>
                                                            ) : (
                                                                value != "" && (
                                                                    <>
                                                                        <li key={key}>
                                                                            <>{value}</>
                                                                            <span>
                                                                                <img src={close} alt="close" onClick={() => removeFilterOnSearch(key, value)} />
                                                                            </span>
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
                            <div className="form-group">
                                <div className="datepicker">
                                    <>
                                        <DatePicker
                                            selected={arrivalDate ? arrivalDate : null}
                                            onChange={(date) => {
                                                applyArrival(date);
                                            }}
                                            minDate={new Date()}
                                            dateFormat="MM/dd/yyyy"
                                            className={"form-control spacing-equal"}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                            }}
                                            ref={dateArrivalPickerRef}
                                            placeholderText='Arrival Date'
                                        />
                                        <em className="icon-calender" onClick={() => openDatePicker(1)}></em>
                                    </>
                                </div>
                                <div className="datepicker">
                                    <>
                                        <DatePicker
                                            selected={departureDate ? departureDate : null}
                                            onChange={(date) => {
                                                applyDeparture(date)
                                               
                                            }}
                                            minDate={new Date()}
                                            dateFormat="MM/dd/yyyy"
                                            className={"form-control spacing-equal"}
                                            onKeyDown={(e) => {
                                                e.preventDefault();
                                            }}
                                            ref={dateDeparturePickerRef}
                                            placeholderText='Departure Date'
                                        />
                                        <em className="icon-calender" onClick={() => openDatePicker(2)}></em>
                                    </>
                                </div>onHide=
                            </div>

                            <button className="btn primary" id="searchBrowse-id" onClick={onBrowse}>
                                Browse
                            </button>
                        </div>
                        <section className={`main-filter-option  ${filter ? 'main-filter-active' : ""}`}>
                            <div className="container">
                                <div className="filter-option-item" onClick={() => applyParking('With Parking')}>
                                    <div className={`filter-option-btn ${parkingValue ? 'active' : ""}`}>
                                        <label className="custom-filter-check" >
                                            <div>Parking</div>
                                            {/* <span className="arrow-icon"><img src={downArrow} alt="" /></span> */}
                                        </label>
                                    </div>
                                </div>
                                <div className="filter-option-item" onClick={() => applyPets('Pet Friendly')}>
                                    <div className={`filter-option-btn ${petAllowed ? 'active' : ""}`}>
                                        <label className="custom-filter-check">
                                            <div>Pets</div>
                                        </label>
                                    </div>
                                </div>
                                <div className="filter-option-item" >
                                    <div className={`filter-option-btn ${showBedrooms ? 'active' : ""}`} onClick={bedRoomFilterApply}>
                                        <label className="custom-filter-check">
                                            <div>Bedrooms</div>
                                        </label>
                                    </div>
                                    <div className={`select-dropdown bedrooms-filter  ${showBedrooms ? '' : "d-none"}`}>
                                        <div className="popup-content">
                                            <ul>
                                                {/* <li className="selected-item">Studio</li> */}
                                                {studio.map((data: any, key: any) => (
                                                    <li key={data.title} className={`${data.selected ? "selected-item" : ""}`} onClick={() => setBedRoomSelection(key)}>{data.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="popup-footer">
                                            <button className="btn link secondary bedroom-filter-footer" onClick={bedRoomFilterApply}>
                                                Cancel
                                            </button>
                                            <button className="btn link bedroom-filter-footer bedroom-filter-apply primary" onClick={applyBedroom}>
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-option-item">
                                    <div className={`filter-option-btn ${showBudget ? 'active' : ""}`} onClick={budgetFilterApply}>
                                        <label className="custom-filter-check">
                                            <div>Budget</div>
                                        </label>
                                    </div>
                                    <div className={`select-dropdown budget ${showBudget ? '' : "d-none"}`}>
                                        <div className="popup-content">
                                            <div className="rangeslide">
                                                <Range
                                                    allowOverlap={true}
                                                    step={1}
                                                    min={2000} // Set the minimum value to start from 2000
                                                    max={15000}
                                                    values={values}
                                                    onChange={(newValues: number[]) => setValues(newValues)}
                                                    renderTrack={({ props, children }) => (
                                                        <div
                                                            {...props}
                                                            style={{
                                                                ...props.style,
                                                                height: '4px',
                                                                background: '#ccc',
                                                                position: 'relative'
                                                            }}
                                                        >
                                                            {children}
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    background: '#3ca160',
                                                                    height: '100%',
                                                                    left: `${((values[0] - 2000) / (15000 - 2000)) * 100}%`,
                                                                    width: `${((values[1] - values[0]) / (15000 - 2000)) * 100}%`
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    renderThumb={({ props }) => (
                                                        <div
                                                            {...props}
                                                            style={{
                                                                ...props.style,
                                                                height: '14px',
                                                                width: '14px',
                                                                backgroundColor: '#fff',
                                                                borderRadius: '50%',
                                                                border: '1px solid black', // Add border style
                                                                zIndex: 2
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="popup-range-input">
                                                <div className="popup-max">
                                                    <label>Min Price</label>
                                                    ${values[0]}
                                                </div>
                                                <div className="popup-min">
                                                    <label>Max Price</label>
                                                    ${values[1]}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="popup-footer">
                                            <button className="btn link secondary bedroom-filter-footer" onClick={budgetFilterApply}>
                                                Cancel
                                            </button>
                                            <button className="btn link bedroom-filter-footer bedroom-filter-apply primary" onClick={applyBudget}>
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="filter-option-item" onClick={neighbourhoodFilterApply}>
                                    <div className="filter-option-btn">
                                        <label className="custom-filter-check">
                                            <div>{neighbourhoodsValues.length == 0 ? 'Neighborhoods' : neighbourhoodsValues.length} </div>
                                            <span className="arrow-icon">
                                                <img src={downArrow} alt="" />
                                            </span>
                                        </label>
                                    </div>
                                    <div className={`select-dropdown ${showNeighbourhoods ? '' : "d-none"}`}>
                                        <ul>
                                            {filterNeighbourhood.map((ame: any, key: any) => (
                                                <li key={key} className={`${key == 0 ? 'selected' : ''}`}>
                                                    <div className="check-group">
                                                        <input type="checkbox" id={key} checked={neighbourhoodsValues.includes(ame._id)} onChange={(e: any) => applyNeighbourhood(ame._id, ame.name)} />
                                                        <label htmlFor={key}>{ame.name}</label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="filter-option-item" onClick={amenitiesFilterApply}>
                                    <div className="filter-option-btn">
                                        <label className="custom-filter-check">
                                            <div>{amenitiesValues.length == 0 ? 'Amenities' : amenitiesValues.length}</div>
                                            <span className="arrow-icon">
                                                <img src={downArrow} alt="" />
                                            </span>
                                        </label>
                                    </div>
                                    <div className={`select-dropdown ${showAmenities ? '' : "d-none"}`}>
                                        <ul>
                                            {/* {amenitiesList.map((ame: any, key: any) => (
                                                <li key={key} className={`${key == 0 ? 'selected' : ''}`}>
                                                    <div className="check-group">
                                                        <input type="checkbox" id={ame.label} checked={amenitiesValues.includes(ame.value)} onChange={(e: any) => applyAmenities(ame.value, ame.label)} />
                                                        <label htmlFor={ame.label}>{ame.label}</label>
                                                    </div>
                                                </li>
                                            ))} */}
                                            {Object.keys(amenitiesList).map((category) => (
                                                    <div key={category} className="category-group">
                                                        <h6>{category}</h6>
                                                        <ul>
                                                        {amenitiesList[category].map((ame: any, key: any) => (
                                                            <li key={key} className={`${key === 0 ? "selected" : ""}`}>
                                                            <div className="check-group">
                                                                <input
                                                                type="checkbox"
                                                                id={ame.label}
                                                                checked={amenitiesValues.includes(ame.value)}
                                                                onChange={(e: any) => applyAmenities(ame.value, ame.label)}
                                                                />
                                                                <label htmlFor={ame.label}>{ame.label}</label>
                                                            </div>
                                                            </li>
                                                        ))}
                                                        </ul>
                                                    </div>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
                {
                    !loader ?
                        <div className="search-map-module">
                            {/* {
                                markers.length > 0 ? */}
                            <MapView height={"670"} markers={markers} />
                            {/* :
                                    <></> */}
                            {/* } */}
                            {
                                fullUrl != ROUTE_NAVIGATION_PATH.BROWSE_MAP_FULL ?
                                    <>

                                        <div className="search-map-list">
                                            <div className="search-bar">
                                                <form className="" onSubmit={handleSubmit}>
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        value={searchParams}
                                                        placeholder="search"
                                                        aria-label="Search"
                                                        onChange={(e) => setSearchParams(e.target.value)}
                                                        onKeyUp={handleKeyPress}
                                                    />
                                                    <button className="_search">
                                                        <em className="icon-search"></em>
                                                    </button>
                                                    <button className="searchbtn" onClick={removeSearch}>
                                                        <em className="icon-close search-map-clear"></em>
                                                    </button>
                                                </form>
                                            </div>

                                            <div className="search-map-data containerItems">
                                                {items.length == 0 ? <NoData /> : <></>}
                                                {items.map((marker: any, key: any) => (
                                                    <div className="search-data-item" key={key} data-search={marker?.Unit?.Address?.AddressLine1 + (marker?.Unit?.Address?.AddressLine2 || marker?.Unit?.Address?.AddressLine3 ? " " : ", ") + (marker?.Unit?.Address?.AddressLine2 ? marker?.Unit?.Address?.AddressLine2 + (marker?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (marker?.Unit?.Address?.AddressLine3 ? marker?.Unit?.Address?.AddressLine3 + ", " : "") + marker?.Unit?.Address?.City + ", " + marker?.Unit?.Address?.State + " " + marker?.Unit?.Address?.PostalCode}
                                                        data-search-owner="Logan Circle">
                                                        <div className="search-data-image">
                                                            <Link to={'/' + (marker.Unit.Address.State).toString().toLowerCase() + '/' + marker.neighborhoodSlug + '/' + (marker.isFurnished ? 'furnished' : 'unfurnished') + '/' + marker?.Unit?.Id} title={marker?.Unit?.Address?.AddressLine1 + (marker?.Unit?.Address?.AddressLine2 || marker?.Unit?.Address?.AddressLine3 ? " " : ", ") + (marker?.Unit?.Address?.AddressLine2 ? marker?.Unit?.Address?.AddressLine2 + (marker?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (marker?.Unit?.Address?.AddressLine3 ? marker?.Unit?.Address?.AddressLine3 + ", " : "") + marker?.Unit?.Address?.City + ", " + marker?.Unit?.Address?.State + " " + marker?.Unit?.Address?.PostalCode}>
                                                                <img
                                                                    src={marker?.Property?.Files[0]?.Url ? marker?.Property?.Files[0]?.Url : placeHolder}
                                                                    onError={(e: any) => {
                                                                        e.target.src = placeHolder;
                                                                    }}
                                                                    alt="property"
                                                                />
                                                            </Link>
                                                        </div>
                                                        <div className="search-data-content">
                                                            <div className="search-data-left">
                                                                <h4>{marker?.Unit?.Address?.AddressLine1 + (marker?.Unit?.Address?.AddressLine2 || marker?.Unit?.Address?.AddressLine3 ? " " : ", ") + (marker?.Unit?.Address?.AddressLine2 ? marker?.Unit?.Address?.AddressLine2 + (marker?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (marker?.Unit?.Address?.AddressLine3 ? marker?.Unit?.Address?.AddressLine3 + ", " : "") + marker?.Unit?.Address?.City + ", " + marker?.Unit?.Address?.State + " " + marker?.Unit?.Address?.PostalCode}</h4>
                                                                {/* <p>Logan Circle</p> */}
                                                                <h5>Available {marker?.AvailableDate ? formatDate(marker?.AvailableDate) : 'NA'} </h5>
                                                            </div>
                                                            <div className="search-data-right">${marker?.Rent}/<span>night</span></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="search-map-tab">
                                            <div className="card-control-tabs">
                                                <Link to={ROUTE_NAVIGATION_PATH.BROWSE + '?fromMap=1'} >
                                                    <em className="icon-bullet"></em>
                                                </Link>
                                                <Link to={ROUTE_NAVIGATION_PATH.BROWSE_MAP + '?fromMap=1'} className="active">
                                                    <em className="icon-locations"></em>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                        :
                        <Spinner />

                }

            </main>
            <Footer />
        </>
    );
}
