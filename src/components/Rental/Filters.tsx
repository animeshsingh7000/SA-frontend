import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Range } from "react-range";
import { Form } from "react-final-form";
import { DEFAULT_OFFSET, STUDIO } from "../../constants";
import { DatePickerControl } from "../FormElements/DatePicker";
import close from "../../assets/images/close-icon.svg";
import downArrow from "../../assets/images/right-arrow.svg";
import { configuration } from "../../api";
import { RentalPropertyContext } from "../../contexts/RentalPropertyProvider";
import { useSearchParams } from "react-router-dom";

type ViewType = 'list' | "map";

export const ViewToggle = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewType = searchParams.get("view");
  const switchView = (view: ViewType) => {
    searchParams.set("view", view);
    setSearchParams(searchParams);
  };

  return (
    <div className="card-control-tabs">
      <a
        onClick={() => switchView('list')}
        className={!viewType || viewType === 'list' ? "active" : ""}
      >
        <em className="icon-bullet"></em>
      </a>
      <a onClick={() => switchView('map')} className={viewType === 'map' ? "active" : ""}>
        <em className="icon-locations"></em>
      </a>
    </div>
  );
};

export default function Filters({
  isRelativeFilter = true,
  applyAllFilters,
}: {
  isRelativeFilter?: boolean;
  applyAllFilters: (values: any) => void;
}) {
  const [initData, setInitData] = useState<any>({
    parking: "",
    pets: "",
    bedroom: [],
    bedroomTitle: [],
    budgetMin: "",
    budgetMax: "",
    amenities: [],
    neighbourhoodsNames: []
  });
  const [values, setValues] = useState<number[]>(
    initData.budgetMin[0]
      ? [initData.budgetMin[0], initData.budgetMax[0]]
      : [2000, 15000]
  );
  const [parkingValue, setParkingValue] = useState<any>("");
  const [bedroomValue, setBedroomValue] = useState<any>([]);
  const [showAmenities, setShowAmenities] = useState(false);
  const [amenitiesValues, setAmenitiesValues] = useState<any>([]);
  const [amenitiesNames, setamenitiesNames] = useState<any>([]);
  const [amenitiesList, setAmenitiesList] = useState<any>([]);
  const [isBudgetAppiled, setIsBudgetApplied] = useState<any>(false);
  const [studio, setStudio] = useState<any>(STUDIO);
  const [isFilter, setIsFilter] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showBedrooms, setShowBedrooms] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [petAllowed, setpetAllowed] = useState<any>("");
  const [showNeighbourhoods, setShowNeighbourhoods] = useState(false);
  const [neighbourhoodsValues, setneighbourhoodsValues] = useState<any>([]);
  const [neighbourhoodsNames, setneighbourhoodsNames] = useState<any>([]);
  const [filterNeighbourhood, setFilterNeighbourhood] = useState((localStorage.getItem("neighbourhood")
        ? JSON.parse(localStorage.getItem("neighbourhood") as string)
    : []));

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
  }, []);

  const onSubmit = (values: any) => {};

  function removeFilterOnSearch(e: any, value: any) {
    if (e == "budgetMin" || e == "budgetMax") {
      setIsBudgetApplied(false);
      setValues([
        e == "budgetMin" ? 2000 : values[0],
        e == "budgetMax" ? 15000 : values[1],
      ]);
      setInitData((prevState: any) => ({
        ...prevState,
        [e]: [],
      }));
    } else if (e == 'amenitiesNames') {
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

  function resetFilter() {
    setInitData({
      parking: "",
      pets: "",
      bedroom: [],
      bedroomTitle: [],
      budgetMin: "",
      budgetMax: "",
      amenities: [],
      neighbourhoodsNames: []
    })
    setParkingValue("");
    setpetAllowed("");
    setValues([2000, 15000]);
    setBedroomValue([]);
    setShowAmenities(false);
    setAmenitiesValues([]);
    setamenitiesNames([]);
    setAmenitiesList([]);
    setIsBudgetApplied(false);
    setStudio(STUDIO);
    // setIsFilter(false);
    setShowBudget(false);
    setShowBedrooms(false);
    setShowNeighbourhoods(false);
    setneighbourhoodsValues([]);
    setneighbourhoodsNames([]);
  }

  function applyParking(value: any) {
    if (parkingValue) {
      setInitData((prevState: any) => ({
        ...prevState,
        parking: "",
      }));
      setParkingValue("");
    } else {
      setInitData((prevState: any) => ({
        ...prevState,
        parking: value,
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

  const onBrowse = () => {
    setPageNo(1);
    let queryParams: any = {
      page: pageNo,
      count: DEFAULT_OFFSET,
    };

    if (parkingValue ) {
      queryParams.isParking = true
    } 


    if (petAllowed) {
      queryParams.isPetAllowed = true;
    }

    if (isBudgetAppiled) {
      queryParams["budgetRange"] = [values[0], values[1]];
    }
    // if (bedroomValue) {
    //   queryParams['bedrooms'] = [bedroomValue];
    // }

    if (bedroomValue.length > 0) {
      if (
        queryParams.bedrooms !== undefined &&
        queryParams.bedrooms.length > 0
      ) {
        bedroomValue.forEach((element: any) => {
          queryParams.bedrooms.push(element);
        });
      } else {
        bedroomValue.forEach((element: any) => {
          if (queryParams.bedrooms == undefined) {
            queryParams["bedrooms"] = [element];
          } else {
            queryParams.bedrooms.push(element);
          }
        });
      }
    } else {
      queryParams["bedrooms"] = [];
    }

    if (amenitiesValues.length > 0) {
      if (
        queryParams.amenities !== undefined &&
        queryParams.amenities.length > 0
      ) {
        amenitiesValues.forEach((element: any) => {
          queryParams.amenities.push(element);
        });
      } else {
        amenitiesValues.forEach((element: any) => {
          if (queryParams.amenities == undefined) {
            queryParams["amenities"] = [element];
          } else {
            queryParams.amenities.push(element);
          }
        });
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

    applyAllFilters(queryParams);

    // attacheProperty.browseProperty(queryParams).then((res: any) => {
    //   setTotalProperty(res.totalProperty);
    //   setCurrentItems(res.data);
    //   setLoader(false);
    // });
  };

  const filterApply = () => {
    setIsFilter(!isFilter);
  };

  const amenitiesFilterApply = () => {
    setShowAmenities(!showAmenities);
    setShowBedrooms(false);
    setShowBudget(false);
  };

  const bedRoomFilterApply = () => {
    setShowBedrooms(!showBedrooms);
    setShowAmenities(false);
    setShowBudget(false);
  };

  const budgetFilterApply = () => {
    setShowBudget(!showBudget);
    setShowAmenities(false);
    setShowBedrooms(false);
  };

  const neighbourhoodFilterApply = () => {
    setShowNeighbourhoods(!showNeighbourhoods);
    setShowAmenities(false);
    setShowBedrooms(false);
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

  function applyBedroom() {
    let data: any = studio.filter((item: any) => item.selected === true);
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
              bedroom: prevData.bedroom.filter(
                (value: any) => value !== studio[i].value
              ),
              bedroomTitle: prevData.bedroomTitle.filter(
                (value: any) => value !== studio[i].show
              ),
            }));
          }
        }
        setBedroomValue((prevItems: any) => [...prevItems, element.value]);
        setInitData((prevState: any) => ({
          ...prevState,
          bedroom: [...prevState.bedroom, element.value],
          bedroomTitle: [...prevState.bedroomTitle, element.show],
        }));
      });
    } else {
      setInitData((prevState: any) => ({
        ...prevState,
        bedroom: [],
        bedroomTitle: [],
      }));
      setBedroomValue([]);
    }

    setShowBedrooms(false);
  }

  function setBedRoomSelection(id: any) {
    const newData = [...studio];
    if (newData[id].selected) {
      newData[id].selected = false;
    } else {
      newData.forEach((el: any) => {
        // el.selected = false;
        if (el.id == id) {
          el.selected = true;
        }
      });
    }

    setStudio(newData);
  }

  function applyBudget() {
    setIsBudgetApplied(true);
    setInitData((prevState: any) => ({
      ...prevState,
      budgetMin: "" + values[0] + "",
      budgetMax: "" + values[1] + "",
    }));
    setShowBudget(false);
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

  return (
    <div className="filter-plugin-container">
      <div className="main-filter">
        <a
          className={`filter-btn  d-md-flex ${isFilter ? "active" : ""}`}
          onClick={filterApply}
        >
          <span className="pr-3">Filters</span>
        </a>
        <div className="filter-select">
          {!Object.values(initData).some((value) => {
            if (typeof value === "string") {
              return value.trim() !== "";
            } else if (Array.isArray(value)) {
              return value.length > 0;
            } else {
              return false;
            }
          }) ? (
            <>
              <input
                type="text"
                placeholder="Too many results? - Click on the filter button to sort and prioritize..."
                readOnly
              />
            </>
          ) : (
            <ul className="chips-wrapper">
              {Object.entries(initData).map(([key, value]) => (
                <React.Fragment key={key}>
                  {key != "bedroom" ? (
                    <>
                      {Array.isArray(value) && value.length > 0 ? (
                        <>
                          {value.map((item, index) => (
                            <>
                              <li key={index}>
                                {item}
                                <span>
                                  <img
                                    src={close}
                                    alt="close-1"
                                    onClick={() =>
                                      removeFilterOnSearch(key, item)
                                    }
                                  />
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
                                <img
                                  src={close}
                                  alt="close"
                                  onClick={() =>
                                    removeFilterOnSearch(key, value)
                                  }
                                />
                              </span>
                            </li>
                          </>
                        )
                      )}
                    </>
                  ) : null}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>
        <button className="btn primary" id="searchBrowse" onClick={onBrowse}>
          Search
        </button>
      </div>
      <ViewToggle />
      <section
        className={`main-filter-option  ${
          isFilter ? "main-filter-active" : ""
        } ${isRelativeFilter && "_admin-active"}`}
      >
        <div className="container">
          <div
            className="filter-option-item"
            onClick={() => applyParking("With Parking")}
          >
            <div
              className={`filter-option-btn ${parkingValue ? "active" : ""}`}
            >
              <label className="custom-filter-check">
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
          <div className="filter-option-item">
            <div
              className={`filter-option-btn ${
                showBedrooms || bedroomValue.length > 0 ? "active" : ""
              }`}
              onClick={bedRoomFilterApply}
            >
              <label className="custom-filter-check">
                <div>Bedroom</div>
              </label>
            </div>
            <div
              className={`select-dropdown bedrooms-filter  ${
                showBedrooms ? "" : "d-none"
              }`}
            >
              <div className="popup-content">
                <ul>
                  {/* <li className="selected-item">Studio</li> */}
                  {studio.map((data: any, key: any) => (
                    <li
                      key={data.title}
                      className={`${data.selected ? "selected-item" : ""}`}
                      onClick={() => setBedRoomSelection(key)}
                    >
                      {data.title}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="popup-footer">
                <button
                  className="btn link secondary bedroom-filter-footer"
                  onClick={bedRoomFilterApply}
                >
                  Cancel
                </button>
                <button
                  className="btn link bedroom-filter-footer bedroom-filter-apply primary"
                  onClick={applyBedroom}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          <div className="filter-option-item">
            <div
              className={`filter-option-btn ${
                showBudget || isBudgetAppiled ? "active" : ""
              }`}
              onClick={budgetFilterApply}
            >
              <label className="custom-filter-check">
                <div>Budget</div>
              </label>
            </div>
            <div
              className={`select-dropdown budget ${showBudget ? "" : "d-none"}`}
            >
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
                          height: "4px",
                          background: "#ccc",
                          position: "relative",
                        }}
                      >
                        {children}
                        <div
                          style={{
                            position: "absolute",
                            background: "#3ca160",
                            height: "100%",
                            left: `${
                              ((values[0] - 2000) / (15000 - 2000)) * 100
                            }%`,
                            width: `${
                              ((values[1] - values[0]) / (15000 - 2000)) * 100
                            }%`,
                          }}
                        />
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: "14px",
                          width: "14px",
                          backgroundColor: "#fff",
                          borderRadius: "50%",
                          border: "1px solid black", // Add border style
                          zIndex: 2,
                        }}
                      />
                    )}
                  />
                </div>
                <div className="popup-range-input">
                  <div className="popup-max">
                    <label>Min Price</label>${values[0]}
                  </div>
                  <div className="popup-min">
                    <label>Max Price</label>${values[1]}
                  </div>
                </div>
              </div>
              <div className="popup-footer">
                <button
                  className="btn link secondary bedroom-filter-footer"
                  onClick={budgetFilterApply}
                >
                  Cancel
                </button>
                <button
                  className="btn link bedroom-filter-footer bedroom-filter-apply primary"
                  onClick={applyBudget}
                >
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
                <div>
                  {amenitiesValues.length == 0
                    ? "Amenities"
                    : amenitiesValues.length}{" "}
                </div>
                <span className="arrow-icon">
                  <img src={downArrow} alt="" />
                </span>
              </label>
            </div>
            <div className={`select-dropdown ${showAmenities ? "" : "d-none"}`}>
              <ul>
                {/* {amenitiesList.map((ame: any, key: any) => (
                  <li key={key} className={`${key == 0 ? "selected" : ""}`}>
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

          <div className="filter-option-item" onClick={resetFilter}>
              <div className="">
                <label className="custom-filter-check">
                  <div>Reset</div>
                </label>
              </div>
          </div>
        </div>
      </section>
    </div>
  );
}
