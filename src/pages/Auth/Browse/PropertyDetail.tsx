import Button from "react-bootstrap/Button";
import { Link, useLocation, useParams } from "react-router-dom";
import { Footer, Header } from "../..";
import { ROUTE_NAVIGATION_PATH } from "../../../routes/routes";
import { Form } from "react-final-form";
import { composeValidators, required } from "../../../validations";
import { DatePickerControl } from "../../../components/FormElements/DatePicker";
import { useEffect, useRef, useState } from "react";
import AmenitiesModel from "../../../components/Modal/AmenitiesModel";
import { attacheProperty } from "../../../api";
import { formatDate, formatDatePrincing, formatNumber, isArrayHas, textToNumber } from "../../../utils/common";
import placeHolder from "../../../assets/images/placeHolder.png";
import Spinner from "../../../components/Spinner";
import ImageGallery from "./ImageGallery";
import { useAuth } from "../../../hooks/useAuth";
import { SideBar } from "../../../components";
import { ROLE } from "../../../constants";
import { calculatePrice } from "../../../api/admin/ownerInquiry";
import { addDays } from "date-fns";
import InfoTooltip from "../../../components/InfoTooltip";
import MapView from "../../../components/GoogleMap/MapView";
import { CheckboxControlGlobal } from "../../../components/FormElements/CheckboxControl";
import moment from "moment";

const customStyle = {
  overflow: "hidden",
  border: "0",
};

export default function PropertyDetail() {
  const params = useParams();
  const { pathname } = useLocation();
  const [loader, setLoader] = useState(true);
  const [item, setItem] = useState<any>({});
  const [photosToShow, setPhotosToShow] = useState<any>([]);
  const [thumbnailImages, setThumbnailImages] = useState<any>([]);
  const [amenities, setAmenities] = useState<any>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const onSubmit = (values: any) => { };
  const [selectedId, setSelectedId] = useState(null);
  const effectRan = useRef(false);
  const auth = useAuth();
  const [removeProperties, setRemoveAllProperties] = useState(false);
  const [propertyDetail, setPropertyDetail] = useState({});
  const [buttonMessage, setButtonMessage] = useState("Add To Comparison");
  const [calculatedPrice, setCalculatedPrice] = useState<any>([]);
  let [leaseDetail, setLeaseDetail] = useState<any>(
    localStorage.getItem("leaseDetail")
      ? JSON.parse(localStorage.getItem("leaseDetail") as string)
      : null
  );
  const [markers, setMarkers] = useState<any[]>([]);
  const [hasParking, setHaspaking] = useState<any>(false);
  const [petAllowed, setPetAllowed] = useState<any>(false);
  const [arrivalDate, setArrivalDate] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<any>(null);
  const [minDate, setMinDate] = useState<any>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    setRemoveAllProperties(
      loadFromLocalStorage("propertyDetail") &&
        loadFromLocalStorage("propertyDetail").length === 3
        ? true
        : false
    );
  }, [pathname]);

  useEffect(() => {
    if (!effectRan.current) {
      attacheProperty.getPropertyDetail(params.id).then((res: any) => {
        setItem(res.data[0]);
        // setPropertyDetail((prevState) => ({
        //   ...prevState,
        //   propertyId: res.data[0],
        // }));
        setPropertyDetail((prevState) => {
          return res.data[0];
        });
        setMarkers([res.data[0]]);
        if (objectWithKeyValueExists("_id", res.data[0]?._id)) {
          setButtonMessage("Remove From Comparision");
        }
        setMinDate(dateConverter(res.data[0].propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom))
        if (res.data[0]?.Property?.Files.length > 0) {
          res.data[0]?.Property?.Files.forEach((element: any, key: any) => {
            setPhotosToShow((prevItems: any) => [...prevItems, element.Url]);
            if (key <= 5) {
              setThumbnailImages((prevItems: any) => [
                ...prevItems,
                element.Url,
              ]);
            }
          });
        } else {
          setPhotosToShow((prevItems: any) => [...prevItems, placeHolder]);
          setThumbnailImages((prevItems: any) => [...prevItems, placeHolder]);
        }
        setLoader(false);
      });
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  const dateConverter = (date:any) => {
    const utcString = "2025-04-30T18:30:00.000Z";

    // Create Date object from UTC string
    const utcDate = new Date(utcString);

    // Subtract 5 hours 30 minutes (India offset from UTC)
    return  new Date(utcDate.getTime() - (5.5 * 60 * 60 * 1000));
  }



  const clickAccordian = (id: any) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  function getAmenties(amenities: any) {
    setAmenities(amenities);
    setShowAmenities(true);
  }

  function closeAmenities() {
    setAmenities(null);
    setShowAmenities(false);
  }

  const loadFromLocalStorage = (key: any) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  function setLocalstorageProperty() {
    const existingArray = loadFromLocalStorage("propertyDetail");
    if (objectWithKeyValueExists("_id", item?._id)) {
      removeObjectFromLocalStorageArray("_id", item?._id);
    } else {
      if (Array.isArray(existingArray)) {
        // If the existing value is an array, push the new object
        existingArray.push(propertyDetail);
        saveToLocalStorage("propertyDetail", existingArray);
      } else {
        // If the key doesn't exist or the existing value is not an array, create a new array
        const newArray = [propertyDetail];
        saveToLocalStorage("propertyDetail", newArray);
      }
    }
  }

  const saveToLocalStorage = (key: any, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
    setButtonMessage("Added - Click To Remove");
  };

  const objectWithKeyValueExists = (key: any, value: any) => {
    let existingArray = loadFromLocalStorage("propertyDetail");
    return existingArray
      ? existingArray.some((item: any) => item[key] === value)
      : false;
  };

  const removeObjectFromLocalStorageArray = (
    removeKey: any,
    removeValue: any
  ) => {
    let existingArray = loadFromLocalStorage("propertyDetail");

    if (!existingArray) {
      existingArray = [];
    }

    const filteredArray = existingArray.filter(
      (item: any) => item[removeKey] !== removeValue
    );
    saveToLocalStorage("propertyDetail", filteredArray);
  };

  function removeAllProperties() {
    saveToLocalStorage("propertyDetail", []);
    setRemoveAllProperties(false);
  }

  const stripTags = (str: any) => {
    return str.replace(/<[^>]*>/g, '');
  }

  function onChangeOfArrivalDate(startDate: any, endDate: any, isParking: boolean = false, isPet: boolean = false) {

    if (startDate && endDate) {

      let data = {
        unitId: params.id ? parseInt(params.id) : 0,
        startDate: formatDatePrincing(startDate),
        endDate: formatDatePrincing(endDate),
        isParking: isParking,
        isPetsAllowed: isPet
        // isPerDiem: false,
        // petsChargesType: 'OneTime',
        // parkingChargesType: 'OneTime',
        // petsCharges: item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.oneTimePetFees ? item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.oneTimePetFees : 0,
        // parkingCharges: item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees ? item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees : 0,
        // taxAmount: 0,
        // isPropertyInMarylandOrVA: item?.Unit?.Address.State == "DC" ? true : false,
        // departureCleaningFee: 331
      }


      getPricingAmount(data);
    }

  }

  function getPricingAmount(data: any) {
    calculatePrice(data).then((res: any) => {
      setCalculatedPrice(res.data);
    });
  }


  function totalAmount() {
    let amount = calculatedPrice.pricing.reduce((sum: any, item: any) => sum + item.totalAmount, 0);
    return formatNumber(amount);
  }

  return (
    <>
      {auth.user && localStorage.getItem('isDashboard') == '0' ? (
        <SideBar />
      ) : (
        <Header mainClass="with-btn" isNavButton={true} />
      )}

      <main
        className={`main-content ${auth.user && localStorage.getItem('isDashboard') == '0'
          ? "right-container mt0"
          : ""
          }`}
      >
        {!loader ? (
          <>
            <div className="container linktabldetails-container">
              {auth.user && localStorage.getItem('isDashboard') == '0' ? null : (
                <div className="breadcrumb-links">
                  <ul>
                    <li>
                      <Link to={ROUTE_NAVIGATION_PATH.HOME}>
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      {item?.Unit?.Address?.AddressLine1 +
                        "  " +
                        item?.Unit?.Address?.AddressLine2 +
                        "  " +
                        item?.Unit?.Address?.AddressLine3}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="property-detail-module">
              {auth.user && localStorage.getItem('isDashboard') == '0' ? (
                <div className="back-and-button-wrapper">
                  <Link
                    to={ROUTE_NAVIGATION_PATH.OWNER_PROPERTY + "?toProperty=1"}
                    className="back-link"
                  >
                    <span className="back-icon"></span>
                    <span className="back-text">Back</span>
                  </Link>
                  <Link
                    to={ROUTE_NAVIGATION_PATH.EDIT_PROPERTY + "/" + item?._id}
                    className="btn primary"
                  >
                    Edit property
                  </Link>
                </div>
              ) : null}
              <div className="container mt17 owner-property-details-container">
                <div className="property-title">
                  <strong>
                    Available from{" "}
                    {item?.AvailableDate ? formatDate(item.AvailableDate) : "-"}
                  </strong>
                  <h1>
                    {item?.Unit?.Address?.AddressLine1 +
                      "  " +
                      item?.Unit?.Address?.AddressLine2 +
                      "  " +
                      item?.Unit?.Address?.AddressLine3}
                  </h1>
                  <p>
                    {item?.Unit?.Address.City
                      ? item?.Unit?.Address.City +
                      ", " +
                      item?.Unit?.Address.State
                      : ""}
                  </p>
                </div>
                <div className="property-price property-price-off-amount-with-strike">
                  <div className="property_price_with_strike">

                    {
                      item?.propertyOnDiscount && (
                        <div className="card-price-day off-amount-with-strike">
                          <div className="actual-amount">${item?.Rent ? item?.Rent : 0}*</div>
                        </div>
                      )
                    }
                    <div>
                      <div className="property-price-starting">
                        Starting from:
                      </div>
                      <h2>
                        ${item?.propertyOnDiscount && item?.discountedValue ? item?.discountedValue : (item?.Rent ? item?.Rent : 0)}/<span>Night</span>
                      </h2>
                    </div>


                  </div>
                </div>
              </div>
              {photosToShow.length > 0 ? (
                <ImageGallery
                  photoToShow={photosToShow}
                  thumbsToShow={thumbnailImages}
                  propertyOnDiscount={item?.propertyOnDiscount}
                />
              ) : (
                <></>
              )}

              <div className="property-service-module">
                <div className="container property-service-list">
                  <div className="property-service-item">
                    <h3 className="property-service-title">Bedrooms</h3>
                    <div className="property-service-data">
                      <em className="icon-bed"></em>
                      <span>
                        {" "}
                        {item?.Unit?.UnitBedrooms
                          ? textToNumber(item.Unit?.UnitBedrooms) + ' '
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="property-service-item">
                    <h3 className="property-service-title">Bathrooms</h3>
                    <div className="property-service-data">
                      <em className="icon-bath"></em>
                      <span>
                        {item?.Unit?.UnitBathrooms
                          ? textToNumber(item.Unit?.UnitBathrooms)
                          : 0} {item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount ?
                            (textToNumber(item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount) == 0
                              ?
                              null
                              :
                              ' Full ' + textToNumber(item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount) + ' half'
                            )
                            :
                            null
                        }
                      </span>
                    </div>
                  </div>

                  <div className="property-service-item">
                    <h3 className="property-service-title">Area</h3>
                    <div className="property-service-data">
                      <em className="icon-area"></em>
                      <span>{item?.Unit?.UnitSize} sq.ft.</span>
                    </div>
                  </div>

                  <div className="property-service-item">
                    <h3 className="property-service-title">Parking
                      {item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo.parkingDescription ? <InfoTooltip text={item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo.parkingDescription} /> : null}
                    </h3>
                    <div className="property-service-data">
                      {/* {item?.Property?.Features.length == 0 ? (
                        <>
                          <em className="icon-not-parking"></em>
                          <span>No</span>
                        </>
                      ) : (
                        <>
                          {item?.Property?.Features.length > 0 &&
                          isArrayHas(item?.Property?.Features, "Parking") ? (
                            <>
                              <em className="icon-parking"></em>
                              <span>Yes</span>
                            </>
                          ) : (
                            <>
                              <em className="icon-not-parking"></em>
                              <span>No</span>
                            </>
                          )}
                        </>
                      )} */}
                      {
                        item?.isParking ?
                          <>
                            <em className="icon-parking"></em>
                            <span>
                              Yes

                            </span>
                          </>
                          :
                          <>
                            <em className="icon-not-parking"></em>
                            <span>No</span>
                          </>
                      }

                    </div>
                    {
                      item?.isParking && (
                        <div className="additional-info">
                          {
                            item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo.rentIncludesParking ?
                              'Included!'
                              :
                              (
                                item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees ?
                                  'Available Additional $' + item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees + ' per 30 day month.'
                                  : null
                              )

                          }
                        </div>
                      )
                    }

                  </div>

                  <div className="property-service-item">
                    <h3 className="property-service-title tooltip_box">Pets
                      {item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo.petRegulations ? <InfoTooltip text={item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo.petRegulations} /> : null}
                    </h3>
                    <div className="property-service-data">
                      {/* {item?.Unit?.Features.length == 0 ? (
                        <>
                          <em className="icon-not-parking"></em>
                          <span>No</span>
                        </>
                      ) : (
                        <>
                          {item?.Unit?.Features.length == 0 ? (
                            <em className="icon-not-pet-care"></em>
                          ) : (
                            <>
                              {isArrayHas(
                                item?.Unit?.Features,
                                "PetsAllowed"
                              ) ? (
                                <>
                                  <em className="icon-pet-care"></em>
                                  <span>Yes</span>
                                </>
                              ) : (
                                <>
                                  <em className="icon-not-pet-care"></em>
                                  <span>No</span>
                                </>
                              )}
                            </>
                          )}
                        </>
                      )} */}
                      {
                        item?.isPetsAllowed ?
                          <>
                            <em className="icon-pet-care"></em>
                            <span>
                              Yes

                            </span>

                          </>
                          :
                          <>
                            <em className="icon-not-pet-care"></em>
                            <span>No</span>
                          </>

                      }
                    </div>
                    {
                      item?.isPetsAllowed && (
                        <div className="additional-info">
                          One time ${item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo.oneTimePetFees} pet fee
                        </div>
                      )
                    }


                  </div>
                </div>
              </div>
            </div>

            <div className="property-detail-content">
              <div className="container owner-property-detail-container">
                <div className="row w-100 remove-minus-margin-mobile">
                  <div className="col-12 col-md-7 pd0-mobile">
                    <div className="property-summary">
                      <p>{item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.propertyDescription ? stripTags(item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.propertyDescription) : ''}</p>
                    </div>
                    {item?.Property?.YearBuilt ? (
                      <p className="managed-since-info">
                        <strong>
                          Managed Since:{" "}
                          <span className="managed-since-date">
                            {item?.Property?.YearBuilt}
                          </span>
                        </strong>
                      </p>
                    ) : null}

                    <div className="property-detail-card">
                      {item?.Property?.Features.length > 0 ? (
                        <div id="accordion-1">
                          <div className="card property-amenties">
                            <div className="card-header" id="headingOne">
                              <button
                                className={`btn btn-link ${selectedId === 1 ? "" : "collapsed"
                                  }`}
                                onClick={() => clickAccordian(1)}
                              >
                                Amenities
                                <em className="icon-right-arrow"></em>
                              </button>
                            </div>

                            <div
                              id="collapseOne"
                              className={`collapse ${selectedId === 1 ? "show" : ""
                                }`}
                              aria-labelledby="headingOne"
                              data-parent="#accordion"
                            >
                              <div className="card-body">
                                <ul>
                                  {item?.Property?.Features.map(
                                    (data: any, key: any) => (
                                      <li key={key}>
                                        <em className="icons-elements-shared-icons-amenities-air-conditioner-icon"></em>
                                        <span>{data}</span>
                                      </li>
                                    )
                                  )}
                                </ul>
                                <div className="view-more-wrapper">
                                  <a
                                    className="view-more-amenities"
                                    onClick={() =>
                                      getAmenties(item?.Property?.Features)
                                    }
                                  >
                                    View More Amenities
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {
                        item?.location?.coordinates[0] && item?.location?.coordinates[1] ?
                          <div id="accordion-2">
                            <div className="card property-amenties">
                              <div className="card-header" id="headingTwo">
                                <button
                                  className={`btn btn-link ${selectedId === 2 ? "" : "collapsed"
                                    }`}
                                  onClick={() => clickAccordian(2)}
                                >
                                  Neighborhood
                                  <em className="icon-right-arrow"></em>
                                </button>
                              </div>

                              <div
                                id="collapseTwo"
                                className={`collapse ${selectedId === 2 ? "show" : ""
                                  }`}
                                aria-labelledby="headingOne"
                                data-parent="#accordion"
                              >
                                <div className="card-body">
                                  <div className="ifram-data">
                                    <MapView height={"670"} markers={markers} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          :
                          null
                      }

                      <div id="accordion-3">
                        <div className="card property-amenties">
                          <div className="card-header" id="headingTwo">
                            <button
                              className={`btn btn-link ${selectedId === 3 ? "" : "collapsed"
                                }`}
                              onClick={() => clickAccordian(3)}
                            >
                              Transit Mobility
                              <em className="icon-right-arrow"></em>
                            </button>
                          </div>

                          <div
                            id="collapseTwo"
                            className={`collapse ${selectedId === 3 ? "show" : ""
                              }`}
                            aria-labelledby="headingOne"
                            data-parent="#accordion"
                          >
                            <div className="card-body">
                              <div className="ifram-data">
                                <iframe
                                  src="https://mobilityscore.transitscreen.io/api/v1/badges?coordinates=38.9098329,-77.0272740&amp;key=Qm2hXNy84Vv0RXqy&amp;background=light"
                                  width="100%"
                                  height="400"
                                  style={customStyle}
                                ></iframe>{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-5 pd0-mobile">
                    {auth.user && localStorage.getItem('isDashboard') == '0' ? (
                      <div className="property-price-card top-new-property-card">
                        <div className="wrap-all-label-data">
                          <div className="row">
                            <div className="col-md-6">
                              <p className="label-text">Start Date</p>
                              <p className="label-data">
                                {leaseDetail?.leaseFromDate
                                  ? formatDate(leaseDetail.leaseFromDate)
                                  : "NA"}
                              </p>
                            </div>
                            <div className="col-md-6 mt-25">
                              <p className="label-text">End Date</p>
                              <p className="label-data">
                                {leaseDetail?.leaseToDate
                                  ? formatDate(leaseDetail.leaseToDate)
                                  : "NA"}
                              </p>
                            </div>
                            <div className="col-md-6 mt-50 mt-25">
                              <p className="label-text">Extension Allowed</p>
                              <p className="label-data">
                                {leaseDetail?.extensionAllowed
                                  ? leaseDetail?.extensionAllowed
                                  : "NA"}
                              </p>
                            </div>
                            <div className="col-md-6 mt-50 mt-25">
                              <p className="label-text">Total Expected Rent</p>
                              <p className="label-data">
                                {leaseDetail?.totalExpectedRent
                                  ? "$" + leaseDetail?.totalExpectedRent
                                  : "NA"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="property-price-card top-new-property-card">

                          <div className="price-available">
                            <div className="price-left">
                              {/* <h4>Available from</h4>
                                <h5>Aug 02, 2024</h5> */}
                            </div>
                            {calculatedPrice?.pricing && calculatedPrice?.pricing.length > 0 ?
                              <div className="price-right">
                                <h4>Average Rate</h4>
                                <div className="price-format">
                                  <h5 className="tooltip-width">
                                    $ <span className="avgprice">{formatNumber(calculatedPrice.monthlyAveragePrice)}</span>
                                    <span className="seprator"></span>
                                    <span className="day">/Month</span>
                                    <InfoTooltip text={'(Includes all utilities, Internet and TV)'} />
                                  </h5>
                                </div>
                                <p className="per-month-charges">
                                  $
                                  <span className="avgprice-month">{formatNumber(calculatedPrice.monthlyAveragePrice)}</span>{" "}
                                  per 30 nights
                                </p>
                                <p>
                                  (30-day rate, based on average rate using
                                  arrival and departure dates)
                                </p>
                              </div>
                              :
                              null
                            }
                          </div>

                          <div className="price-available">
                            <div className="price-left">
                              <h4>Available from</h4>
                              <h5>
                                {item.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom
                                  ? formatDate(item.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom)
                                  : "NA"}
                              </h5>
                            </div>
                          </div>
                          <div className="price-calender px-30 mt-3 parketing-pet-container price-calenderform">
                            <Form
                              onSubmit={onSubmit}
                              render={({ handleSubmit, values, form }) => (
                                <form onSubmit={handleSubmit}>
                                  <div className="formfield">
                                    <DatePickerControl
                                      label="CHECK IN"
                                      name="startDate"
                                      placeholder="MM-DD-YY"
                                      minDate={
                                        item.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableFrom
                                          ? minDate
                                          : addDays(new Date(), 7)
                                      }
                                      onChange={(value: Date) => {
                                        if (!value) return;
                                        const endDate = addDays(value, 30);
                                        form.change("endDate", endDate);
                                        onChangeOfArrivalDate(value, endDate, hasParking, petAllowed);
                                        setArrivalDate(value);
                                        setDepartureDate(endDate);
                                      }}
                                    />
                                  </div>

                                  <div className="formfield">
                                    <DatePickerControl
                                      label="CHECK OUT"
                                      name="endDate"
                                      minDate={addDays(values.startDate, 30)}
                                      onChange={(newValue: Date) => {

                                        onChangeOfArrivalDate(values.startDate, newValue, hasParking, petAllowed);
                                        setArrivalDate(values.startDate);
                                        setDepartureDate(newValue)
                                      }}
                                      placeholder="MM-DD-YY"
                                    />
                                  </div>
                                  <div className="checkbox_outer">
                                    {
                                      item?.isParking && (
                                        // <div className="formfield">
                                        <CheckboxControlGlobal
                                          name="isParking"
                                          label="Has Parking"
                                          onChange={(e: any) => {
                                            setHaspaking(e.target.checked);
                                            onChangeOfArrivalDate(arrivalDate, departureDate, e.target.checked, petAllowed)
                                          }}
                                        />
                                        // </div>
                                      )
                                    }
                                    {item?.isPetsAllowed && (
                                      <div className="formfield">
                                        <CheckboxControlGlobal
                                          name="isPetsAllowed"
                                          label="Pet Allowed"
                                          onChange={(e: any) => {
                                            setPetAllowed(e.target.checked);
                                            onChangeOfArrivalDate(arrivalDate, departureDate, hasParking, e.target.checked)
                                          }}
                                        />
                                      </div>
                                    )
                                    }
                                  </div>


                                  <div className="price-data-list price-data-list-updated _detaildata">
                                    {calculatedPrice?.pricing &&
                                      calculatedPrice?.pricing.map((data: any, key: any) => (
                                        <div className="">
                                          <ul className={`final-prize ${key === 0 ? "" : "border-0"}`}>
                                            <li>{data.month}, {data.year}  <br /><p className="cal-prorate-info">({data.totalDays} night{data.totalDays > 1 ? '(s)' : ''} * ${data.priceForEachDay.toFixed()} per night)</p> </li>
                                            <li>${formatNumber(data.priceForEachMonth.toFixed(2))}</li>
                                          </ul>
                                          {
                                            data.serviceFee > 0 ?

                                              <ul className="bdr">
                                                <li> Services Fee </li>
                                                <li>(+) ${formatNumber(data.serviceFee)}</li>
                                              </ul>
                                              :
                                              null
                                          }

                                          {
                                            data.petsCharges > 0 ?

                                              <ul className="bdr">
                                                <li> One Time Pet Fee </li>
                                                <li>(+) ${formatNumber(data.petsCharges)}</li>
                                              </ul>
                                              :
                                              null
                                          }

                                          {
                                            data.parkingCharges > 0 ?

                                              <ul className="bdr">
                                                <li> Parking Fee
                                                  <br /><p className="cal-prorate-info">({data.totalDays} night(s) * ${formatNumber(data.dailyParkingFee)} per night)</p>
                                                </li>
                                                <li>(+) ${formatNumber(data.parkingCharges)}</li>
                                              </ul>
                                              :
                                              null
                                          }

                                          {
                                            data.taxes > 0 ?
                                              <ul className="bdr">
                                                <li>Tax
                                                  {
                                                    key === 0
                                                      ?
                                                      <InfoTooltip text={'(Not applicable for properties in Virginia and Maryland. Not applicable if your organization is tax-exempt.)'} />
                                                      :
                                                      null
                                                  }
                                                </li>
                                                <li>(+) ${formatNumber(data.taxes)}</li>
                                              </ul>
                                              :
                                              null
                                          }
                                          {
                                            data.departureCleaningFee > 0 ?
                                              <ul className="bdr">
                                                <li>Departure Cleaning</li>
                                                <li>(+) ${formatNumber(data.departureCleaningFee)}</li>
                                              </ul>
                                              :
                                              null
                                          }
                                        </div>
                                      ))}
                                    {calculatedPrice?.pricing &&
                                      calculatedPrice?.pricing.length > 0 ?
                                      <ul className="total-amount-block">
                                        <li className="total-amount-text">
                                          Total Amount
                                        </li>
                                        <li className="total-amount-count">${calculatedPrice.pricing &&
                                          calculatedPrice.pricing.length > 0 ? totalAmount() : 0}</li>
                                      </ul>
                                      :
                                      null
                                    }
                                  </div>

                                  <div className="price-actions">
                                    {
                                      item.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.minimumReservationTerm && item.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.minimumReservationTerm > 0 && (
                                        <p className="">
                                          This property has a minimum reservation term of {item.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.minimumReservationTerm} nights.
                                        </p>
                                      )
                                    }


                                    <Link
                                      to={ROUTE_NAVIGATION_PATH.RENTAL_INQUIRY}
                                      className="btn primary"
                                      type="button"
                                    >
                                      Submit Rental Inquiry for this Property
                                    </Link>
                                  </div>
                                </form>
                              )}
                            />
                          </div>


                          <div className="price-actions detail-price-border-radius">
                            <button
                              className="btn primary-outline  btn-long-txt"
                              data-toggle="modal"
                              data-target="#applicationLinksModal"
                            >
                              Click here for application form
                            </button>
                          </div>
                        </div>
                        <div className="property-compare-card">
                          <div className="price-actions">
                            <div id="compare">
                              {removeProperties ? (
                                <Button className="btn primary comparison-add">
                                  {buttonMessage}
                                </Button>
                              ) : (
                                <Button
                                  className="btn primary comparison-add"
                                  onClick={setLocalstorageProperty}
                                >
                                  {buttonMessage}
                                </Button>
                              )}

                              <Link
                                to={ROUTE_NAVIGATION_PATH.PROPERTY_COMPARE}
                                className="btn primary-outline"
                                title="Compare Properties"
                              >
                                View Comparison
                              </Link>
                            </div>
                            {removeProperties ? (
                              <>
                                <p>
                                  You have the maximum three properties
                                  selected. Click "View Comparison" and remove
                                  one or
                                </p>
                                <Button
                                  className="btn primary comparison-add"
                                  onClick={removeAllProperties}
                                >
                                  Remove All Comparision
                                </Button>
                                <p>to add more</p>
                              </>
                            ) : (
                              <div id="comparison-notice">
                                <p>
                                  Add up to three properties to compare then
                                  click "View Comparison"!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </main>
      <Footer />

      <AmenitiesModel
        detail={amenities}
        show={showAmenities}
        handleClose={() => closeAmenities()}
      />
    </>
  );
}
