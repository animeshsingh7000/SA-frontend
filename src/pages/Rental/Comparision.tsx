import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { comparison, configuration } from "../../api";
import { STUDIO, FILTER_NEIGHBORHOOD } from "../../constants";
import { useAuth } from "../../hooks/useAuth";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { Any } from "../../types/global.type";
import bannerIcon from "../../assets/images/icon-compare.png";
import { SideBar } from "../../components";
import downArrow from "../../assets/images/right-arrow.svg";
import { Range } from 'react-range';
import close from "../../assets/images/close-icon.svg";
import placeHolder from "../../assets/images/placeHolder.png";
import { formatDate, isArrayHas, textToNumber } from "../../utils/common";
import Spinner from "../../components/Spinner";
import { Footer, Header } from "..";
import DatePicker from "react-datepicker";
import Datetime from 'react-datetime';


export default function Comparision() {
  const [compareProperties, setCompareProperties] = useState<any>([]);
  const [loading, setLoader] = useState(true);
  const auth = useAuth();
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
    neighbourhoods: localStorageValue && localStorageValue.neighbourhoods ? localStorageValue.neighbourhoods : [],
    neighbourhoodsNames: localStorageValue && localStorageValue.neighbourhoodsNames ? localStorageValue.neighbourhoodsNames : [],
    // arrivalDate: localStorageValue && localStorageValue.arrivalDate ? localStorageValue.arrivalDate : null,
    // departureDate: localStorageValue && localStorageValue.departureDate ? localStorageValue.departureDate : null,
    amenities: localStorageValue && localStorageValue.amenities ? localStorageValue.amenities : [],
    amenitiesNames: localStorageValue && localStorageValue.amenitiesNames ? localStorageValue.amenitiesNames : [],
  });
  const location = useLocation();
  const [filter, setFilter] = useState(false);
  const [showAmenities, setShowAmenities] = useState(false);
  const [showNeighbourhoods, setShowNeighbourhoods] = useState(false);
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
  const navigate = useNavigate();
  const [localstorageExists, setlocalstorageExists] = useState(false);
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
    const existingArray = loadFromLocalStorage("propertyDetail");
    if (existingArray && existingArray.length > 0) {
      setCompareProperties(existingArray);
      setlocalstorageExists(true);
      setLoader(false);

    } else {
      getCompareProperty();
    }
  }, []);

  function getCompareProperty() {
    comparison
      .compareProperties()
      .then((res: { data: Any }) => {
        setlocalstorageExists(false);
        setCompareProperties(res.data);
        setLoader(false);
      });
  }

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

  const filterApply = () => {
    setFilter(!filter);
  }

  const loadFromLocalStorage = (key: any) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

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

  const onBrowse = () => {
    navigate(ROUTE_NAVIGATION_PATH.BROWSE + '?fromMap=1');
  }

  const removeLocalstorageProperty = (id: any) => {
    const updatedItems = removeObjectFromLocalStorageArray('_id', id);
  };

  const removeObjectFromLocalStorageArray = (removeKey: any, removeValue: any) => {
    let existingArray = loadFromLocalStorage("propertyDetail");

    if (!existingArray) {
      existingArray = [];
    }

    const filteredArray = existingArray.filter((item: any) => item[removeKey] !== removeValue);
    saveToLocalStorage("propertyDetail", filteredArray);

    let existingArray1 = loadFromLocalStorage("propertyDetail");
    if (existingArray1 && existingArray1.length > 0) {
      setCompareProperties(loadFromLocalStorage("propertyDetail"));
    } else {
      setLoader(true);

      getCompareProperty();
    }
  };

  const saveToLocalStorage = (key: any, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };


  return (
    <>
      {
        auth.user ?
          <SideBar />
          :
          <Header mainClass="with-btn" isNavButton={true} />
      }

      <div className={` ${auth.user ? "right-container" : 'main-content'}`}>
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

            </div><div className="form-group">
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
              </div>
            </div>

            <button className="btn primary" id="searchBrowse" onClick={onBrowse}>
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
                    <div>{neighbourhoodsValues.length == 0 ? 'Neighbourhoods' : neighbourhoodsValues.length} </div>
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
                          <input type="checkbox" id={key} checked={amenitiesValues.includes(ame.value)} onChange={(e: any) => applyAmenities(ame.value)} />
                          <label htmlFor={key}>{ame.label}</label>
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
        <div className="breadcrumb-module breadcrumb-compare-module">
          <div className="container">
            <div className="breadcrumb-row align-items-start">
              <div className="breadcrumb-icon mr-5">
                <img src={bannerIcon} alt="compare icon" />
              </div>
              <div className="breadcrumb-content">
                <h4>Comparing a few random properties.</h4>
                <p className="mb-0">
                  You can create your own comparison by clicking on "Add for
                  Comparison" while viewing individual properties.
                </p>
              </div>
            </div>
          </div>
        </div>
        {
          loading ?
            <Spinner />

            :
            <div className="compare-property-module">
              <div className="container">
                <div className="row compare-property-row with-card-view">
                  <div className="col-12 col-md-3">
                    <div className="add-compare">All details</div>
                  </div>

                  {
                    compareProperties[0] ?
                      <div className="col-12 col-md-3">
                        <div className="add-compare-image">
                          <img src={compareProperties[0]?.Property.Files[0]?.Url ? compareProperties[0]?.Property.Files[0]?.Url : placeHolder}
                            onError={(e: any) => {
                              e.target.src = placeHolder;
                            }}
                            alt="property"
                          />
                          {
                            localstorageExists ?
                              <div className="card-close">
                                <a onClick={() => removeLocalstorageProperty(compareProperties[0]?._id)} title="Remove from comparison.">
                                  <em className="icon-close"></em>
                                </a>
                              </div>
                              : null
                          }
                        </div>
                      </div>
                      : null
                  }
                  {
                    compareProperties[1] ?
                      <div className="col-12 col-md-3">
                        <div className="add-compare-image">
                          <img src={compareProperties[1]?.Property.Files[0]?.Url ? compareProperties[1]?.Property.Files[0]?.Url : placeHolder}
                            onError={(e: any) => {
                              e.target.src = placeHolder;
                            }}
                            alt="property"
                          />
                          {
                            localstorageExists ?
                              <div className="card-close">
                                <a title="Remove from comparison." onClick={() => removeLocalstorageProperty(compareProperties[1]?._id)}>
                                  <em className="icon-close"></em>
                                </a>
                              </div>
                              : null
                          }
                        </div>
                      </div>
                      : null
                  }
                  {
                    compareProperties[2] ?
                      <div className="col-12 col-md-3">
                        <div className="add-compare-image">
                          <img src={compareProperties[2]?.Property.Files[0]?.Url ? compareProperties[2]?.Property.Files[0]?.Url : placeHolder}
                            onError={(e: any) => {
                              e.target.src = placeHolder;
                            }}
                            alt="property"
                          />
                          
                          {
                            localstorageExists ?
                              <div className="card-close">
                                <a onClick={() => removeLocalstorageProperty(compareProperties[2]?._id)} title="Remove from comparison.">
                                  <em className="icon-close"></em>
                                </a>
                              </div>
                              : null
                          }
                        </div>
                      </div>
                      :
                      null
                  }
                </div>
              </div>
              <div className="compare-property-data">
                <div className="container">
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Property</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <Link
                              to={'/'+ (compareProperties[0]?.Unit?.Address?.State).toString().toLowerCase() + '/' + compareProperties[0].neighborhoodSlug + '/' + (compareProperties[0].isFurnished ? 'furnished' : 'unfurnished') + '/' + compareProperties[0]?.Unit?.Id}
                              title={compareProperties[0]?.Unit?.Address?.AddressLine1 + (compareProperties[0]?.Unit?.Address?.AddressLine2 || compareProperties[0]?.Unit?.Address?.AddressLine3 ? " " : ", ") + (compareProperties[0]?.Unit?.Address?.AddressLine2 ? compareProperties[0]?.Unit?.Address?.AddressLine2 + (compareProperties[0]?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (compareProperties[0]?.Unit?.Address?.AddressLine3 ? compareProperties[0]?.Unit?.Address?.AddressLine3 + ", " : "") + compareProperties[0]?.Unit?.Address?.City + ", " + compareProperties[0]?.Unit?.Address?.State + " " + compareProperties[0]?.Unit?.Address?.PostalCode}
                            >
                              {compareProperties[0]?.Unit?.Address?.AddressLine1 + " " + compareProperties[0]?.Unit?.Address?.AddressLine2 + " " + compareProperties[0]?.Unit?.Address?.AddressLine3}{" "}
                            </Link>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <Link
                              to={'/'+ (compareProperties[1]?.Unit?.Address?.State).toString().toLowerCase() + '/' + compareProperties[1].neighborhoodSlug + '/' + (compareProperties[1].isFurnished ? 'furnished' : 'unfurnished') + '/' + compareProperties[1]?.Unit?.Id}
                              title={compareProperties[1]?.Unit?.Address?.AddressLine1 + (compareProperties[1]?.Unit?.Address?.AddressLine2 || compareProperties[1]?.Unit?.Address?.AddressLine3 ? " " : ", ") + (compareProperties[1]?.Unit?.Address?.AddressLine2 ? compareProperties[1]?.Unit?.Address?.AddressLine2 + (compareProperties[1]?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (compareProperties[1]?.Unit?.Address?.AddressLine3 ? compareProperties[1]?.Unit?.Address?.AddressLine3 + ", " : "") + compareProperties[1]?.Unit?.Address?.City + ", " + compareProperties[1]?.Unit?.Address?.State + " " + compareProperties[1]?.Unit?.Address?.PostalCode}
                            >
                              {compareProperties[1]?.Unit?.Address?.AddressLine1 + " " + compareProperties[1]?.Unit?.Address?.AddressLine2 + " " + compareProperties[1]?.Unit?.Address?.AddressLine3}{" "}
                            </Link>
                          </div>
                        </div>
                        :
                        null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <Link
                              to={'/'+ (compareProperties[2]?.Unit?.Address?.State).toString().toLowerCase() + '/' + compareProperties[2].neighborhoodSlug + '/' + (compareProperties[2].isFurnished ? 'furnished' : 'unfurnished') + '/' + compareProperties[2]?.Unit?.Id}
                              title={compareProperties[2]?.Unit?.Address?.AddressLine1 + (compareProperties[2]?.Unit?.Address?.AddressLine2 || compareProperties[2]?.Unit?.Address?.AddressLine3 ? " " : ", ") + (compareProperties[2]?.Unit?.Address?.AddressLine2 ? compareProperties[2]?.Unit?.Address?.AddressLine2 + (compareProperties[2]?.Unit?.Address?.AddressLine3 ? " " : ", ") : "") + (compareProperties[2]?.Unit?.Address?.AddressLine3 ? compareProperties[2]?.Unit?.Address?.AddressLine3 + ", " : "") + compareProperties[2]?.Unit?.Address?.City + ", " + compareProperties[2]?.Unit?.Address?.State + " " + compareProperties[2]?.Unit?.Address?.PostalCode}
                            >
                              {compareProperties[2]?.Unit?.Address?.AddressLine1 + " " + compareProperties[2]?.Unit?.Address?.AddressLine2 + " " + compareProperties[2]?.Unit?.Address?.AddressLine3}{" "}
                            </Link>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>

                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Neighborhood</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[0].propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood ? compareProperties[0].propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood : 'NA'}
                            </p>
                          </div>
                        </div>
                        : null
                    } {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[1].propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood ? compareProperties[1].propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood : 'NA'}
                            </p>
                          </div>
                        </div>
                        :
                        null
                    } {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[2].propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood ? compareProperties[2].propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood : 'NA'}
                            </p>
                          </div>
                        </div>
                        :
                        null

                    }
                  </div>

                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Bedrooms</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[0]?.Unit?.UnitBedrooms ? textToNumber(compareProperties[0]?.Unit?.UnitBedrooms) : 0} {textToNumber(compareProperties[0]?.Unit?.UnitBedrooms) > 1 ? 'Beds' : 'Bed'}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[1]?.Unit?.UnitBedrooms ? textToNumber(compareProperties[1]?.Unit?.UnitBedrooms) : 0} {textToNumber(compareProperties[1]?.Unit?.UnitBedrooms) > 1 ? 'Beds' : 'Bed'}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[2]?.Unit?.UnitBedrooms ? textToNumber(compareProperties[2]?.Unit?.UnitBedrooms) : 0} {textToNumber(compareProperties[2]?.Unit?.UnitBedrooms) > 1 ? 'Beds' : 'Bed'}</p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Full Baths</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[0]?.Unit?.UnitBathrooms ? textToNumber(compareProperties[0]?.Unit?.UnitBathrooms) : 0}</p>
                          </div>
                        </div>
                        : null
                    } {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[1]?.Unit?.UnitBathrooms ? textToNumber(compareProperties[1]?.Unit?.UnitBathrooms) : 0}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[2]?.Unit?.UnitBathrooms ? textToNumber(compareProperties[2]?.Unit?.UnitBathrooms) : 0}
                            </p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Half Baths</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[0]?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount ? textToNumber(compareProperties[0]?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount) : 0}
                            </p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[1]?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount ? textToNumber(compareProperties[1]?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount) : 0}
                            </p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {compareProperties[2]?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount ? textToNumber(compareProperties[2]?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount) : 0}
                            </p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Pet Friendly</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {
                                compareProperties[0]?.isPetsAllowed ? 'Yes' : 'No'
                              }</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {
                                compareProperties[1]?.isPetsAllowed ? 'Yes' : 'No'
                              }</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{
                              compareProperties[2]?.isPetsAllowed ? 'Yes' : 'No'
                            }</p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Parking</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {
                                compareProperties[0]?.isParking ? 'Yes' : 'No'
                              }
                            </p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {
                                compareProperties[1]?.isParking ? 'Yes' : 'No'
                              }
                            </p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>
                              {
                                compareProperties[2]?.isParking ? 'Yes' : 'No'
                              }
                            </p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Square Feet</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[0]?.Unit?.UnitSize}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[1]?.Unit?.UnitSize}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[2]?.Unit?.UnitSize}</p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Features</h4>
                      </div>
                    </div>
                    {

                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <ul>
                              {compareProperties[0]?.Property?.Features.map((data: any, key: any) => (
                                <li key={key}>
                                  {data}
                                </li>
                              ))}
                              <ul></ul>
                            </ul>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <ul>
                              {compareProperties[1]?.Property?.Features.map((data: any, key: any) => (
                                <li key={key}>
                                  {data}
                                </li>
                              ))}
                              <ul></ul>
                            </ul>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <ul>
                              {compareProperties[2]?.Property?.Features.map((data: any, key: any) => (
                                <li key={key}>
                                  {data}
                                </li>
                              ))}
                              <ul></ul>
                            </ul>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Starting from</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>${compareProperties[0]?.Rent ? compareProperties[0]?.Rent + (' ($'+compareProperties[0]?.Rent*30 +'per 30 night month)') : 'NA'}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>${compareProperties[1]?.Rent ? compareProperties[1]?.Rent + (' ($'+compareProperties[1]?.Rent*30 +'per 30 night month)') : 'NA'}</p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>${compareProperties[2]?.Rent ? compareProperties[2]?.Rent + (' ($'+compareProperties[2]?.Rent*30 +'per 30 night month)') : 'NA'}</p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                  <div className="row compare-property-row">
                    <div className="col-12 col-md-3">
                      <div className="add-compare-content">
                        <h4>Available</h4>
                      </div>
                    </div>
                    {
                      compareProperties[0] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[0]?.AvailableDate ? 'Available ' + formatDate(compareProperties[0]?.AvailableDate) : 'NA'}</p>
                            <p></p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[1] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[1]?.AvailableDate ? 'Available ' + formatDate(compareProperties[1]?.AvailableDate) : 'NA'}</p>
                            <p></p>
                          </div>
                        </div>
                        : null
                    }
                    {
                      compareProperties[2] ?
                        <div className="col-12 col-md-3">
                          <div className="add-compare-content">
                            <p>{compareProperties[2]?.AvailableDate ? 'Available ' + formatDate(compareProperties[2]?.AvailableDate) : 'NA'}</p>
                            <p></p>
                          </div>
                        </div>
                        :
                        null
                    }
                  </div>
                </div>
              </div>
            </div>
        }

      </div>
      <Footer />
    </>
  );
}