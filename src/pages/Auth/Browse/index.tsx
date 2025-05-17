import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useLocation } from "react-router-dom";
import { Footer, Header } from "../../";
import { attacheProperty, configuration } from "../../../api";
import placeHolder from "../../../assets/images/placeHolder.png";
import downArrow from "../../../assets/images/right-arrow.svg";
import { NoData } from "../../../components";
import Spinner from "../../../components/Spinner";
import { DEFAULT_OFFSET, FILTER_NEIGHBORHOOD, STUDIO } from "../../../constants";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { formatDate, formatDate1, isArrayHas, textToNumber } from "../../../utils/common";
import { Range } from 'react-range';
import close from "../../../assets/images/close-icon.svg";
import DatePicker from "react-datepicker";
import Datetime from 'react-datetime';

export default function Browse() {
  const fromMap = new URLSearchParams(document.location.search).get('fromMap');

  const { pathname } = useLocation();
  let [localStorageValue, setLocaltorageValue] = useState<any>(
    fromMap == '1' && localStorage.getItem("initData")
      ? JSON.parse(localStorage.getItem("initData") as string)
      : null
  );
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
    amenities: localStorageValue && localStorageValue.amenities ? localStorageValue.amenities : [],
    neighbourhoodsNames: localStorageValue && localStorageValue.neighbourhoodsNames ? localStorageValue.neighbourhoodsNames : [],
    amenitiesNames: localStorageValue && localStorageValue.amenitiesNames ? localStorageValue.amenitiesNames : [],
  });
  const location = useLocation();
  const [currentItems, setCurrentItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalProperty, setTotalProperty] = useState(1);
  const [filter, setFilter] = useState(false);
  const [showNeighbourhoods, setShowNeighbourhoods] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showBedrooms, setShowBedrooms] = useState(false);
  const [values, setValues] = useState<number[]>(initData.budgetMin ? [initData.budgetMin, initData.budgetMax] : [
    2000,
    15000
  ]);
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
  const [arrivalDate, setArrivalDate] = useState<any>(localStorageValue && localStorageValue.arrivalDate ? localStorageValue.arrivalDate : null);
  const [departureDate, setDepartureDate] = useState<any>(localStorageValue && localStorageValue.departureDate ? localStorageValue.departureDate : null);
  const dateArrivalPickerRef = useRef<DatePicker>(null);
  const dateDeparturePickerRef = useRef<DatePicker>(null);
  const datetimeRef = useRef<Datetime>(null); // Declare ref with Datetime type
  const [filterNeighbourhood, setFilterNeighbourhood] = useState((localStorage.getItem("neighbourhood")
  ? JSON.parse(localStorage.getItem("neighbourhood") as string)
  : []));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const removeQueryParams = () => {
      const { pathname } = location;
      window.history.replaceState({}, '', pathname);
    };

    removeQueryParams();
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // const data = {
    //   page: pageNo,
    //   count: DEFAULT_OFFSET,
    // };
    // attacheProperty.browseProperty(data).then((res: any) => {
    //   setTotalProperty(res.totalProperty);
    //   setCurrentItems(res.data);
    //   setLoader(false);
    // });
    // COMMENTED OUT: attacheProperty.browseProperty(queryParams) and related browseProperties/onBrowse logic for chat-only property search focus.
  }, [pageNo]);

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

  const pageCount = Math.ceil(totalProperty / DEFAULT_OFFSET);

  const handlePageClick = (event: any) => {
    setPageNo(event.selected + 1);
    //setLoader(true);
  };

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
        bedroomTitle: prevData.bedroomTitle.filter((value: any) => value !== studio[i].show)

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

  // const onBrowse = () => {
  //   navigate(ROUTE_NAVIGATION_PATH.BROWSE_MAP)
  // }

  const onBrowse = () => {
    let queryParams: any = {
      page: pageNo,
      count: DEFAULT_OFFSET,
    };

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
    //   queryParams['bedrooms'] = [bedroomValue];
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
    } else {
      queryParams['bedrooms'] = [];
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

    // COMMENTED OUT: attacheProperty.browseProperty(queryParams) and related browseProperties/onBrowse logic for chat-only property search focus.
  }

  function browseProperties() {
    setLoader(true);
    setPageNo(1);
    onBrowse();
  }

  return (
    <>
      <Header mainClass="with-btn" isNavButton={true} />
      {/* <main className="main-content browsetop"> */}
      <main className={`main-content browsetop ${filter ? 'active' : ""}`}>


        <div className="filter-plugin-container">
          <div className="main-filter">
            {/* <a
              className="mobile-btn"
              data-toggle="modal"
              data-target="#mbSearchFilters"
            >
              <span className="pr-3">Filters</span>
            </a> */}
            <a className={`filter-btn  d-md-flex ${filter ? 'active' : ""}`} onClick={filterApply}>
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
                            {
                              Array.isArray(value) && value.length > 0 ? (
                                <>
                                  {
                                    value.map((item, index) => (
                                      <>
                                        <li key={index}>
                                          {item}
                                          <span>
                                            <img src={close} alt="close-1" onClick={() => removeFilterOnSearch(key, item)} />
                                          </span>
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
                      applyDeparture(date);
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
              </div>
            </div>

            <button className="btn primary" id="searchBrowse" onClick={browseProperties}>
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
                <div className={`filter-option-btn ${showBedrooms || bedroomValue.length > 0 ? 'active' : ""}`} onClick={bedRoomFilterApply}>
                  <label className="custom-filter-check">
                    <div>Bedroom</div>
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
                <div className={`filter-option-btn ${showBudget || isBudgetAppiled ? 'active' : ""}`} onClick={budgetFilterApply}>
                  <label className="custom-filter-check">
                    <div>Budget</div>
                  </label>
                </div>
                <div className={`select-dropdown budget ${showBudget ? '' : "d-none"}`}>
                  <div className="popup-content">
                    <div className="rangeslide">
                      <Range
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
                    <div>{amenitiesValues.length == 0 ? 'Amenities' : amenitiesValues.length} </div>
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

        <div className="container d-flex justify-content-between align-items-end" >

          <div className="breadcrumb-links">
            <ul>
              <li>
                <a href="/">
                  <span>Home</span>
                </a>
              </li>
              <li>Browse</li>
            </ul>
            <div className="breadcrumb-link-title">
              Results found ({totalProperty})
            </div>

          </div>
          <div className="card-control-tabs">
            <Link to={ROUTE_NAVIGATION_PATH.BROWSE + '?fromProperty=1'} className="active">
              <em className="icon-bullet"></em>
            </Link>
            <Link to={ROUTE_NAVIGATION_PATH.BROWSE_MAP + '?fromProperty=1'}>
              <em className="icon-locations"></em>
            </Link>
          </div>
        </div>

        <div className="container pt-2">
          <div className="row">
            {loader ? (
              <Spinner />
            ) : (
              <>
                {!currentItems.length ? (
                  <NoData />
                ) : (
                  <>
                    {currentItems.map((data: any, key: any) => (
                      <div className="col-12 col-md-6 col-lg-3" key={key}>
                        <Link
                          className="sale-wrapper"
                          to={'/' + (data.Unit.Address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') +'/' + data?.Unit?.Id}
                          title={data?.Unit?.Address?.AddressLine1 + (data?.Unit?.Address?.AddressLine2 || data?.Unit?.Address?.AddressLine3 ? " " : ", ") + (data?.Unit?.Address?.AddressLine2 ? data?.Unit?.Address?.AddressLine2 + (data?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (data?.Unit?.Address?.AddressLine3 ? data?.Unit?.Address?.AddressLine3 + ", " : "") + data?.Unit?.Address?.City + ", " + data?.Unit?.Address?.State + " " + data?.Unit?.Address?.PostalCode}
                        >
                          {
                            data?.propertyOnDiscount && (
                              <div className="sale-container">
                                <div className="sale-image">
                                  <div className="sale-txt">SALE</div>
                                </div>
                              </div>
                            )

                          }
                          <div className="cards _browse">
                            <div className="card-image">
                              <img
                                src={data?.Property?.Files[0]?.Url ? data?.Property?.Files[0]?.Url : placeHolder}
                                onError={(e: any) => {
                                  e.target.src = placeHolder;
                                }}
                                alt="property"
                              />
                            </div>
                            <div className="card-price">
                              <div className="card-price-from">Starting from</div>
                              <div className="d-flex align-items-end">
                                <div className="card-price-sign">${data?.propertyOnDiscount && data?.discountedValue ? data?.discountedValue : (data?.Rent ? data?.Rent : 0)}/</div>
                                <div className="card-price-day">Night</div>
                                {
                                  data?.propertyOnDiscount && (
                                  <div className="card-price-day off-amount-with-strike">
                                      <div className="actual-amount">${data?.Rent ? data?.Rent : 0 }*</div>
                                  </div>
                                  )
                                }
                              </div>
                            </div>
                            <div className="card-content mapcard-content-home ">
                              <div className="card-subtitle">
                                Available from {data?.AvailableDate ? formatDate(data?.AvailableDate) : 'NA'}
                              </div>
                              <div className="card-title card-neighbourhood">
                                {data?.propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood}
                              </div>
                              <div className="card-title">
                                {data?.Unit?.Address?.AddressLine1 + " " + data?.Unit?.Address?.AddressLine2 + " " + data?.Unit?.Address?.AddressLine3}
                              </div>

                              <div className="card-footer">
                                <div className="card-footer-item col-12 justify-content-between">
                                  <div className="d-flex">
                                    <span className="d-flex align-items-center">
                                      <em className="icon-bed"></em>
                                      {data?.Unit?.UnitBedrooms ? (data?.Unit?.UnitBedrooms === "Studio" ? "Studio" : textToNumber(data?.Unit?.UnitBedrooms)) : 0}
                                    </span>
                                  </div>
                                  <div className="d-flex">
                                    <span className="d-flex align-items-center ml-2">
                                      <em className="icon-bath"></em>
                                      {data?.Unit?.UnitBathrooms ? textToNumber(data?.Unit?.UnitBathrooms) : 0}
                                    </span>
                                  </div>

                                  <div className="d-flex">
                                    <span className="d-flex align-items-center ml-2">
                                      {/* {data?.Property?.Features.length == 0 ? (
                                        <em className="icon-not-parking"></em>
                                      ) : (
                                        <>
                                          {isArrayHas(
                                            data?.Property?.Features,
                                            "Parking"
                                          ) ? (
                                            <em className="icon-parking"></em>
                                          ) : (
                                            <em className="icon-not-parking"></em>
                                          )}
                                        </>
                                      )} */}
                                      {
                                        data.isParking ?
                                        <em className="icon-parking"></em>
                                        :
                                        <em className="icon-not-parking"></em>
                                      }
                                    </span>
                                  </div>

                                  <div className="d-flex">
                                    <span className="d-flex align-items-center ml-2">
                                      {/* {
                                        data.Unit.Features.length == 0
                                          ?
                                          <em className="icon-not-pet-care"></em>
                                          : (
                                            <>
                                              {
                                                isArrayHas(data?.Unit?.Features, "PetsAllowed")
                                                  ?

                                                  <em className="icon-pet-care"></em>
                                                  :
                                                  <em className="icon-not-pet-care"></em>
                                              }
                                            </>
                                          )
                                      } */}
                                      {
                                        data.isPetsAllowed ?
                                        <em className="icon-pet-care"></em>
                                        :
                                        <em className="icon-not-pet-care"></em>
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                    {totalProperty > DEFAULT_OFFSET ? (
                      <div className="custom-pagination">
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
                    ) : null}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
