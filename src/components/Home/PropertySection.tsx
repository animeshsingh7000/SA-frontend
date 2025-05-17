
import { useEffect, useRef, useState } from "react";
import { NoData } from "..";
import { attacheProperty } from "../../api";
import { formatDate, isArrayHas, textToNumber } from "../../utils/common";
import Loading from "../Loader";
import Slider from 'react-slick';
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import placeHolder from "../../assets/images/placeHolder.png";

export default function PropertySection() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [items, setItems] = useState([]);
  const effectRan = useRef(false);

  const settings = {
    dots: false, // Hide the default dots navigation
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Number of slides to show at once
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // Breakpoint for mobile view
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Custom arrow component for previous slide
  const CustomPrevArrow = (props: any) => {
    const isDisabled = props.currentSlide === 0;
    return (
      <button
        {...props}
        className={`${props.className} ${isDisabled ? 'slick-disabled' : ''}`}
        disabled={isDisabled}
      >
        Previous
      </button>
    );
  };

  // Custom arrow component for next slide
  const CustomNextArrow = (props: any) => {
    const isDisabled = props.currentSlide === props.slideCount - 1;
    return (
      <button
        {...props}
        className={`${props.className} ${isDisabled ? 'slick-disabled' : ''}`}
        disabled={isDisabled}
      >
        Next
      </button>
    );
  };

  useEffect(() => {
    if (!effectRan.current) {
      attacheProperty
        .getFeatureList()
        .then((res: any) => {
          setItems(res.data);
          setLoader(false);
        });
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  function navigateToDetail(data:any) {
    navigate('/'+ (data.Unit.Address.State).toString().toLowerCase() + '/' + data.neighborhoodSlug + '/' + (data.isFurnished ? 'furnished' : 'unfurnished') + '/' + data.Unit.Id)
  }

  return (
    <>
      <section className="home-stay container">
        <h2>
          <span>Joy</span>
          <div className="subtitle">In Every Stay</div>
        </h2>
        <p>
          Attache's mission is to provide Joy in Every Stay.
          <br />
          We do this by providing Choice, Connection and Comfort for travelers
          in need of a furnished place for 30-days or longer.
        </p>
        {
          loader ?
            <Loading />
            :
            <>
              {!items.length ?
                <NoData />
                :
                <div className="slide-carousel">
                  <Slider {...settings} prevArrow={<CustomPrevArrow />} nextArrow={<CustomNextArrow />}>
                    {(items).map((data: any, key) => (
                      <div className="items-grid"
                        title={data?.Unit?.Address?.AddressLine1+(data?.Unit?.Address?.AddressLine2 || data?.Unit?.Address?.AddressLine3 ? " " : ", ")+(data?.Unit?.Address?.AddressLine2 ? data?.Unit?.Address?.AddressLine2+(data?.Unit?.Address?.AddressLine3 ? " " : ", "): "")+(data?.Unit?.Address?.AddressLine3 ? data?.Unit?.Address?.AddressLine3+", ": "")+ data.Unit.Address.City+ ", " + data?.Unit?.Address?.State+" "+data?.Unit?.Address?.PostalCode}
                        key={key}
                        onClick={() => navigateToDetail(data)}
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
                       
                        <div className="cards">
                          <div className="card-image">
                          <img src={data?.Property?.Files[0]?.Url ? data?.Property?.Files[0]?.Url : placeHolder}
                              onError={(e: any) => {
                                  e.target.src = placeHolder;
                              }}
                            alt="property" />
                          </div>
                          <div className="card-price">
                            <div className="card-price-from">Starting from</div>
                            <div className="d-flex align-items-end">
                              <div className="card-price-sign">${data?.propertyOnDiscount ? data?.discountedValue : data?.Rent}/</div>
                              <div className="card-price-day">Night</div>
                              {
                                data?.propertyOnDiscount && (
                                <div className="card-price-day off-amount-with-strike">
                                    <div className="actual-amount">${data?.Rent}*</div>
                                </div>
                                )
                              }
                            </div>
                          </div>
                          <div className="card-content  mapcard-content-home ">
                            <div className="card-subtitle">
                              Available from {data?.AvailableDate ? formatDate(data.AvailableDate) : 'NA'}
                            </div>
                            <div className="card-title card-neighbourhood">
                              {data?.neighborhood}
                            </div>
                            <div className="card-title">
                              { data?.Unit?.Address?.AddressLine1 + data?.Unit?.Address?.AddressLine2 + data?.Unit?.Address?.AddressLine3 }
                            </div>

                            <div className="card-footer">
                              <div className="card-footer-item col-12 justify-content-between">
                                <div className="d-flex">
                                  <div className="d-flex align-items-center">
                                    <em className="icon-bed"></em>
                                    { data?.Unit?.UnitBedrooms ? (  data?.Unit?.UnitBedrooms === "Studio" ? "Studio": textToNumber(data?.Unit?.UnitBedrooms)) : 0}
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div className="d-flex align-items-center ml-2">
                                    <em className="icon-bath"></em>
                                    { data?.Unit?.UnitBedrooms ? (  data?.Unit?.UnitBedrooms === "Studio" ? "Studio": textToNumber(data?.Unit?.UnitBedrooms)) : 0}
                                  </div>
                                </div>

                                <div className="d-flex">
                                  <div className="d-flex align-items-center ml-2">
                                    {/* {
                                      data?.Property?.Features.length == 0
                                        ?
                                        <em className="icon-not-parking"></em>
                                        :
                                        (
                                          <>
                                            {
                                              isArrayHas(data?.Property?.Features, "Parking")
                                                ?

                                                <em className="icon-parking"></em>
                                                :
                                                <em className="icon-not-parking"></em>
                                            }
                                          </>
                                        )
                                    } */}

                                    {
                                      data.isParking  ? 
                                      <em className="icon-parking"></em> 
                                      : 
                                      <em className="icon-not-parking"></em>
                                    }
                                  </div>
                                </div>

                                <div className="d-flex">
                                  <div className="d-flex align-items-center ml-2">
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
                                      data.isPetsAllowed  ? 
                                      <em className="icon-pet-care"></em> 
                                      : 
                                      <em className="icon-not-pet-care"></em>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
              }
            </>
        }
        <div className="home-view-btn">
          <Link to={ROUTE_NAVIGATION_PATH.BROWSE} className="btn btn-link">
            View More
          </Link>
        </div>
      </section>
    </>
  );
}
