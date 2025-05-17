import Button from "react-bootstrap/Button";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import { Footer } from ".."; 
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useEffect, useRef, useState } from "react";
import AmenitiesModel from "../../components/Modal/AmenitiesModel";
import { attacheProperty } from "../../api";
import { formatDate, textToNumber } from "../../utils/common";
import placeHolder from "../../assets/images/placeHolder.png";
import Spinner from "../../components/Spinner";
import ImageGallery from "../Auth/Browse/ImageGallery";
import { useAuth } from "../../hooks/useAuth";
import { SideBar } from "../../components";
import { ROLE } from "../../constants";
import InfoTooltip from "../../components/InfoTooltip";
import MapView from "../../components/GoogleMap/MapView";
import { getOwnerLeasesDetail } from "../../api/owner";

const customStyle = {
  overflow: "hidden",
  border: "0",
};

export default function OwnerLeaseDetail() {
  const params = useParams();
  const { pathname } = useLocation();
  const [loader, setLoader] = useState(true);
  const [item, setItem] = useState<any>({});
  const [leaseDetails, setLeaseDetails] = useState<any>({});
  const [photosToShow, setPhotosToShow] = useState<any>([]);
  const [thumbnailImages, setThumbnailImages] = useState<any>([]);
  const [amenities, setAmenities] = useState<any>(null);
  const [showAmenities, setShowAmenities] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const effectRan = useRef(false);
  const auth = useAuth();
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const leaseId = searchParams.get("leaseId");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!effectRan.current) {
        attacheProperty.getPropertyDetail(params.id).then((res: any) => {
          setItem(res.data[0]);
          // setPropertyDetail((prevState) => ({
          //   ...prevState,
          //   propertyId: res.data[0],
          // }));
          setMarkers([res.data[0]]);
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
        
        getOwnerLeasesDetail(leaseId).then((res: any) => {
            let leaseData = res?.data?.leaseDetails;
            leaseData.totalExpectedRent = res?.data?.totalExpectedRent;
            setLeaseDetails(leaseData)
        });
      }
    return () => {
      effectRan.current = true;
    };
  }, []);



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

  const stripTags = (str: any) => {
    return str.replace(/<[^>]*>/g, '');
  }


  return (
    <>
        <SideBar />

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
                    </div>
                ) : null}
                <div className="container mt17 owner-property-details-container">
                    <div className="property-title">
                    <strong>
                        Available from{" "}
                        {item?.AvailableDate ? formatDate(item?.AvailableDate) : "-"}
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
                            : 0} { item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.halfBathroomCount ?
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
                                'Available Additional $'+ item?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees +'per 30 day month.' 
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
                            item?.isPetsAllowed  &&  (
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
                        
                        <div className="property-price-card top-new-property-card">
                            <div className="wrap-all-label-data">
                            <div className="row">
                                <div className="col-md-6">
                                <p className="label-text">Start Date</p>
                                <p className="label-data">
                                    {leaseDetails?.leaseStartDate
                                    ? formatDate(leaseDetails.leaseStartDate)
                                    : "NA"}
                                </p>
                                </div>
                                <div className="col-md-6 mt-25">
                                <p className="label-text">End Date</p>
                                <p className="label-data">
                                    {leaseDetails?.leaseEndDate
                                    ? formatDate(leaseDetails.leaseEndDate)
                                    : "NA"}
                                </p>
                                </div>
                                <div className="col-md-6 mt-50 mt-25">
                                <p className="label-text">Extension Allowed</p>
                                <p className="label-data">
                                    {leaseDetails?.extensionAllowed
                                    ? leaseDetails?.extensionAllowed
                                    : "No"}
                                </p>
                                </div>
                                <div className="col-md-6 mt-50 mt-25">
                                <p className="label-text">Total Expected Rent</p>
                                <p className="label-data">
                                    {leaseDetails?.totalExpectedRent
                                    ? "$" + leaseDetails?.totalExpectedRent.toFixed(2)
                                    : "NA"}
                                </p>
                                </div>
                            </div>
                            </div>
                        </div>
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
