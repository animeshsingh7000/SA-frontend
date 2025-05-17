import { Link, useSearchParams } from "react-router-dom";
import { formatDate, formatDatePrincing, formatNumber, textToNumber } from "../../utils/common";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import { useEffect, useMemo, useRef, useState } from "react";
import placeHolder from "../../assets/images/placeHolder.png";
import { differenceInCalendarDays } from "date-fns";
import { markFav, unMarkFav, updateFav } from "../../api/rental/rentalInquiry";
import { toast } from "react-toastify";
import AddNotesToNotInterestProperty from "./AddNotesToNotInterestProperty";
import { useMessageModal } from "../../hooks/useMessage";
import PropertyNotes from "./PropertyNotes";
import { TABS_KEYS } from "../../constants";
import { calculatePrice } from "../../api/admin/ownerInquiry";
import InfoTooltip from "../InfoTooltip";

const compareRent = (rent: number, maxMonthlyBudget: string) => {
  const minRate = maxMonthlyBudget ? maxMonthlyBudget.split("-")[0].replace("$", "") : 0;
  const maxRate = maxMonthlyBudget ? maxMonthlyBudget.split("-")[1]?.replace("$", "") : 0;

  return +minRate > rent || +maxRate < rent;
};

export function PropertyCard({
  property,
  inquiryData,
  resetProperty,
  callbackUndoProperty,
}: {
  property: any;
  inquiryData: any;
  resetProperty: (page: number) => void;
  callbackUndoProperty: (id: string) => void;
}) {
  const [image, setImage] = useState(property.Property.Files?.[0]?.Url);
  const [fav, setFav] = useState<string | null>(null);
  const [isFav, setIsFav] = useState<boolean>(false);
  const [showAddFeedbackPopup, setShowAddFeedbackPopup] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const { showMessage } = useMessageModal();
  const [calculatedPrice, setCalculatedPrice] = useState<any>([]);
  const [propId, setPropId] = useState<any>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const totalRent = useMemo(() => {
    const daysToStay = differenceInCalendarDays(
      new Date(inquiryData.estimatedDepartureDate),
      new Date(inquiryData.estimatedArrivalDate)
    );
    return property.Rent * daysToStay;
  }, [property.Rent, inquiryData]);

  const redLabels = useMemo(() => {
    const labels = {
      availableDate:
        differenceInCalendarDays(
          inquiryData.estimatedArrivalDate,
          property.AvailableDate
        ) !== 0,
      rent: inquiryData.maxMonthlyBudget ? compareRent(property.Rent, inquiryData.maxMonthlyBudget) : 0,
      neighborhood: false,
      minimumRent: false,
      availableUntil: false,
    };
    return labels;
  }, [property, inquiryData]);

  const handleMarkFav = (isFav: boolean, note?: string) => {
    const fun = markFav;
    // toggleLoader();
    setFav(isFav ? "fav" : "unfav");
    fun(property._id, { isFavorite: isFav, note: note ? note : undefined })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || error.message);
      })
      .finally(() => {
        // toggleLoader();
        setShowAddFeedbackPopup(false);
        // if (!isFav) {
        resetProperty(1);
        // }
      });
  };

  const handleClickOutside = (event:any) => {
    // If the click is outside the div, hide the div
    if (divRef.current && !divRef.current.contains(event.target)) {
      setPropId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFeedbackPopup = (isFav: boolean) => {
    setIsFav(isFav);
    setShowAddFeedbackPopup(true);
  };

  const handleDeleteFav = () => {
    showMessage({
      heading: "Remove from list?",
      body: (
        <p>
          Are you sure, you want to remove this property from {type === TABS_KEYS.favorites ? 'favorites ' : 'not interested '}
          list?
        </p>
      ),
      type: "delete",
      buttonMain: "Remove",
      callback: () => {
        unMarkFav(property._id)
          .then((res) => {
            toast.success(res.data.message);
            callbackUndoProperty(property._id);
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || error.message);
          });
      },
    });
  };

  useEffect(() => {
    if (property.isFavorite !== undefined) {
      setFav(property.isFavorite ? 'fav' : 'unfav');
    }
  }, [property.isFavorite])

  useEffect(() => {

  }, [])

  function onChangeOfArrivalDate(startDate: any, endDate: any) {
    let data = {
      unitId: property?.Unit?.Id ? parseInt(property?.Unit?.Id) : 0,
      startDate: (startDate),
      endDate: (endDate),
      isPerDiem: false,
      petsChargesType: 'OneTime',
      parkingChargesType: 'OneTime',
      petsCharges: property?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.oneTimePetFees ?  property?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.oneTimePetFees : 0,
      parkingCharges: property?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees ?  property?.propertyInfo?.attacheRentalProperty?.propertyDetailInfo?.dailyParkingFees : 0,
      taxAmount: 0,
      isPropertyInMarylandOrVA: property?.Unit?.Address.State == "DC" ? true : false,
      departureCleaningFee: 331
    }

    getPricingAmount(data);
  }

  function getPricingAmount(data: any) {
    calculatePrice(data).then((res: any) => {
      setCalculatedPrice(res.data);
      setPropId(propId ? null : data.unitId);
    });

  }

  function totalAmount() {
    let amount = calculatedPrice.pricing.reduce((sum: any, item: any) => sum + item.totalAmount, 0);
    return formatNumber(amount);
  }

  function breakDownPrice(propertyId: any) {
    onChangeOfArrivalDate(inquiryData?.estimatedArrivalDate, inquiryData?.estimatedDepartureDate)
  }

  return (
    <>
      <div className="matching-property-card pd-bm-10 matching-property-detials-action dislike-64894">
        <Link
          to={`/${property.Property.Address.State.toString().toLowerCase()}/${property.neighborhoodSlug}/${(property.isFurnished ? 'furnished' : 'unfurnished')}/${property.Unit.Id}`}
          title={property.Property.StructureDescription}
        >
          <div className="matching-property-image-box">
            <img
              src={property?.Property?.Files[0]?.Url ? property?.Property?.Files[0]?.Url : placeHolder}
              onError={(e: any) => {
                e.target.src = placeHolder;
              }}
              alt="property"
            />
          </div>
        </Link>

        <div className="matching-property-detials">
          <div className="property-detials-action-btn">
            <span
              className="action-icon note add-notes notes-64894  active "
              onClick={() => setShowNotes(true)}
            ></span>
            {!type ? (
              <>
                <span
                  className={`action-icon like user-action ${property.isFavorite ? "active" : ""
                    }`}
                  onClick={() => handleFeedbackPopup(true)}
                ></span>
                <span
                  className={`action-icon dislike user-action ${!property.isFavorite ? "active" : ""
                    }`}
                  onClick={() => handleFeedbackPopup(false)}
                ></span>
              </>
            ) : (
              <span
                className="action-icon delete delete-action"
                onClick={handleDeleteFav}
              ></span>
            )}
          </div>

          <p className="matching-property-card-title">
            <Link
              className="matching-property-card-title"
              to={`/${property.Property.Address.State.toString().toLowerCase()}/${property.neighborhoodSlug}/${(property.isFurnished ? 'furnished' : 'unfurnished')}/${property.Unit.Id}`}
              title={property.Property.StructureDescription}
            >
              {property.Property.Name}
            </Link>
          </p>

          <div className="total-rent-with-dropdown">
            <div className="total-rent-text">Total Rent </div>

            {
              propId == property.Unit.Id ? (
                <div ref={divRef} className="dropdown total-rent-info-dropdown">
                  <div
                    className="dropdown-menu"
                    aria-labelledby="price-breaking-window-1101"
                  >
                    <div className="dropdown-wrapper">
                      {
                        calculatedPrice ?

                          <>
                            {calculatedPrice.pricing &&
                              calculatedPrice.pricing.map((data: any, key: any) => (
                                <div className="property-detail-row">
                                  <ul className={`final-prize ${key === 0 ? "" : "border-0"}`}>
                                  <span className="property-detail-type">
                                    <span>{data.month}, {data.year}  </span>  
                                    <span className="days-left">({data.totalDays} night{data.totalDays > 1 ? '(s)' : ''} * ${data.priceForEachDay.toFixed()} per night)</span> 
                                    </span>
                                    <strong className="property-detail-amount">
                                    ${data.totalAmount ? formatNumber(data.priceForEachMonth.toFixed(2)) :'NA'}
                                    </strong>
                                  </ul>
                                  {
                                    data.serviceFee > 0 ?

                                      <ul className="bdr">
                                         <span className="property-detail-type"> Services Fee </span>
                                         <strong className="property-detail-amount">
                                         (+) ${formatNumber(data.serviceFee)}</strong>
                                      </ul>
                                      :
                                      null
                                  }

                                  {
                                    data.petsCharges > 0 ?

                                      <ul className="bdr">
                                        <span className="property-detail-type"> Pet Charge </span>
                                        <strong className="property-detail-amount">
                                          (+) ${formatNumber(data.petsCharges)}</strong>
                                      </ul>
                                      :
                                      null
                                  }

                                  {
                                    data.parkingCharges > 0 ?

                                      <ul className="bdr">
                                         <span className="property-detail-type"> Parking Fee </span>
                                         <strong className="property-detail-amount">
                                          (+) ${formatNumber(data.parkingCharges)}
                                          </strong>
                                      </ul>
                                      :
                                      null
                                  }

                                  {
                                    data.taxes > 0 ?
                                      <ul className="bdr">
                                         <span className="property-detail-type">Tax
                                          {
                                            key === 0
                                              ?
                                              <InfoTooltip text={'(Not applicable for properties in Virginia and Maryland. Not applicable if your organization is tax-exempt.)'} />
                                              :
                                              null
                                          }
                                        </span>
                                        <strong className="property-detail-amount">
                                          (+) ${formatNumber(data.taxes)}
                                          </strong>
                                      </ul>
                                      :
                                      null
                                  }
                                  {
                                    data.departureCleaningFee > 0 ?
                                      <ul className="bdr">
                                        <span className="property-detail-type">
                                          Departure Cleaning</span>
                                          <strong className="property-detail-amount">
                                          (+) ${formatNumber(data.departureCleaningFee)}
                                          </strong>
                                      </ul>
                                      :
                                      null
                                  }
                                </div>
                              ))}
                            {calculatedPrice.pricing &&
                              calculatedPrice.pricing.length > 0 ?
                              <ul className="total-amount-block">
                                <strong className="property-detail-amount">
                                  Total Amount
                                </strong>
                                <strong className="property-detail-amount">
                                  ${calculatedPrice.pricing &&
                                  calculatedPrice.pricing.length > 0 ? totalAmount() : 0}</strong>
                              </ul>
                              :
                              null
                            }
                          </> :

                          null
                      }


                    </div>{" "}
                  </div>
                </div>

              )
              :null
            }


            <div className="total-rent-amount">${property.totalRent ? property.totalRent.toFixed(2) : '0'}</div>
            <div
              className="total-rent-more-info"
              // type="button"
              id="price-breaking-window-1101"
              onClick={() => breakDownPrice(property._id)}
            >
            </div>
          </div>

          <div className="icon-wrapper-box">
            <div className="icon-wrapper-inner-box">
              <span className="bed-icon"></span>
              <span className="show-number-count grey-text">
                {textToNumber(property.Unit.UnitBedrooms)}
              </span>
            </div>
            <div className="icon-wrapper-inner-box">
              <span className="bath-icon"></span>
              <span className="show-number-count grey-text">
                {textToNumber(property.Unit.UnitBathrooms)}
              </span>
            </div>
            <div className="icon-wrapper-inner-box">
              <span
                className={`${property?.propertyInfo.attacheRentalProperty?.propertyDetailInfo.isPetsAllowed === "Yes"
                  ? "pet-care-icon"
                  : "no-pets"
                  }`}
              ></span>
            </div>

            <div className="icon-wrapper-inner-box">
              <span
                className={`${property?.propertyInfo.attacheRentalProperty?.propertyDetailInfo.isParking === "Yes"
                  ? "parking-icon"
                  : "no-park"
                  }`}
              ></span>
            </div>
          </div>
          <div className="grey-box-details-wrapper">
            <div className="grey-box-details">
              <span>Earliest Available Date</span>

              <p
                className={`available-text ${redLabels.availableDate && "red-text"
                  }`}
              >
                {formatDate(property.AvailableDate)}
              </p>
            </div>
            <div className="grey-box-details">
              <span className="10">Price</span>
              <p
                className={`off-amount-with-strike ${redLabels.rent ? "red-text" : "grey-text"
                  }`}
              >
                ${property.Rent ? property.Rent : '0'}/Night*
              </p>
            </div>
            <div className="grey-box-details">
              <span>Neighborhood</span>
              <p
                className={`${redLabels.neighborhood ? "red-text" : "grey-text"
                  }`}
              >
                {property?.propertyInfo?.attacheRentalProperty?.propertyDetails?.neighborhood || '-'}
              </p>
            </div>
            <div className="grey-box-details">
              <span>Minimum Stay</span>
              <p
              >
                {property?.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.minimumReservationTerm ? property?.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.minimumReservationTerm + ' Nights' : 'N/A'} 
              </p>
            </div>
            <div className="grey-box-details">
              <span>Available Through</span>
              <p
                className={`${redLabels.availableUntil ? "red-text" : "grey-text"
                  }`}
              >
                {property?.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableUntil
                  ? formatDate(property?.propertyInfo?.attacheRentalProperty?.marketingAndAdministration?.propertyAvailableUntil)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {showAddFeedbackPopup && (
        <AddNotesToNotInterestProperty
          show={showAddFeedbackPopup}
          isFav={isFav}
          handleSubmit={(note) => handleMarkFav(isFav, note)}
          handleClose={() => setShowAddFeedbackPopup(false)}
        />
      )}
      {showNotes ? (
        <PropertyNotes
          show={showNotes}
          propertyId={property._id}
          handleClose={() => setShowNotes(false)}
        />
      ) : null}
    </>
  );
}
