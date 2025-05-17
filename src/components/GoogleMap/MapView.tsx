import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  MarkerClusterer,
  InfoWindow,
} from "@react-google-maps/api";
import customMarkerIcon from "../../assets/images/marker.png";
import placeHolder from "../../assets/images/placeHolder.png";
import { MAP_API_KEY } from "../../constants";
import { isArrayHas, textToNumber } from "../../utils/common";
import { Link } from "react-router-dom";

export default function MapView({
  height,
  markers,
}: {
  height?: any;
  markers: any;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAP_API_KEY,
  });
  const mapContainerStyle = {
    width: "100%",
    height: height ? height + "px" : "462px",
  };

  const defaultCenter = {
    lat: 42.28458,
    lng: -71.08991,
  };

  const defaultZoom = 9;
  const [map, setMap] = useState(null);
  const [selectedPlaces, setSelectedPlaces] = useState<any[]>([]);

  const handleMarkerClick = (marker: any) => {
    setSelectedPlaces([...selectedPlaces, marker]);
  };

  const handleCloseClick = (marker: any) => {
    setSelectedPlaces(selectedPlaces.filter((place) => place.id !== marker.id));
  };

  return isLoaded ? (
    <>
      {/* {markers.length > 0 ? ( */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={defaultZoom}

      >
        {markers.map((marker: any, key: any) => (
          <Marker
            key={marker._id}
            position={{ lat: marker?.location?.coordinates[0] ? marker?.location?.coordinates[0] : 0, lng: marker?.location?.coordinates[1] ? marker?.location?.coordinates[1] : 0 }}
            onClick={() => handleMarkerClick(marker)}
            icon={{
              url: customMarkerIcon,
              scaledSize: new window.google.maps.Size(40, 40), // Adjust the size of the icon if necessary
            }}
          />
        ))}
        {selectedPlaces.map((place) => (
          <InfoWindow
            key={place.id}
            position={{ lat: place.location.coordinates[0], lng: place.location.coordinates[1] }}
            onCloseClick={() => handleCloseClick(place)}
          >
            <div className="map-cards">
              <Link to={'/' + (place.Property.Address.State).toString().toLowerCase() + '/' + place.neighborhoodSlug + '/' + (place.isFurnished ? 'furnished' : 'unfurnished') + '/' + place?.Unit?.Id}>
                <>
                  {
                    place?.propertyOnDiscount && (
                      <div className="sale-container">
                        <div className="sale-image">
                          <div className="sale-txt">SALE</div>
                        </div>
                      </div>
                    )
                  }
                  <div className="cards">
                    <div className="card-image">
                      <img src={place?.Property?.Files[0] ? place?.Property?.Files[0].Url : placeHolder}
                        onError={(e: any) => {
                          e.target.src = placeHolder;
                        }}
                        alt="property" />
                    </div>
                    <div className="card-price">
                      <div className="card-price-from">Starting from</div>
                      <div className="d-flex align-items-end">
                        <div className="card-price-sign">${place?.propertyOnDiscount && place?.discountedValue ? place?.discountedValue : (place?.Rent ? place?.Rent : 0)}/</div>
                        <div className="card-price-day">Night</div>
                        {
                          place?.propertyOnDiscount && (
                            <div className="card-price-day off-amount-with-strike">
                              <div className="actual-amount">${place?.Rent ? place?.Rent : 0}*</div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                    <div className="card-content  mapcard-content-home ">
                      <div className="card-title card-neighbourhood">
                        {place.Unit.Address.City}
                      </div>
                      <div className="card-title">{place.Unit.Address.AddressLine1}</div>

                      <div className="card-footer">
                        <div className="card-footer-item col-12 justify-content-between">
                          <div className="d-flex">
                            <div className="d-flex align-items-center">
                              <em className="icon-bed"></em>{textToNumber(place.Unit.UnitBedrooms)}
                            </div>
                          </div>
                          <div className="d-flex">
                            <div className="d-flex align-items-center ml-2">
                              <em className="icon-bath"></em>{textToNumber(place.Unit.UnitBathrooms)}
                            </div>
                          </div>

                          <div className="d-flex">
                            <div className="d-flex align-items-center ml-2">
                              {
                                place.Property.Features.length == 0
                                  ?
                                  <em className="icon-not-parking"></em>
                                  :
                                  (
                                    <>
                                      {
                                        isArrayHas(place.Unit.Features, "Parking")
                                          ?

                                          <em className="icon-parking"></em>
                                          :
                                          <em className="icon-not-parking"></em>
                                      }
                                    </>
                                  )
                              }
                            </div>
                          </div>

                          {/* <div className="d-flex">
                          <div className="d-flex align-items-center ml-2">
                            <em className="icon-pet-care"></em>
                          </div>
                        </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </Link>


            </div>
          </InfoWindow>
        ))}
        <></>
      </GoogleMap>
      {/* ) : (
        <></>
      )} */}
    </>
  ) : (
    <></>
  );
}
