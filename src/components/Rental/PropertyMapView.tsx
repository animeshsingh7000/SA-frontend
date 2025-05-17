import { useState } from "react";
import MapView from "../GoogleMap/MapView";
import { Link } from "react-router-dom";
import { ROUTE_NAVIGATION_PATH } from "../../routes/routes";
import placeHolder from "../../assets/images/placeHolder.png";
import { formatDate } from "../../utils/common";
import { ViewToggle } from "./Filters";

const PropertyItem = ({ property }: { property: any }) => {
  const [image, setImage] = useState(property.Property.Files?.[0]?.Url);
  return (
    <div
      className="search-data-item"
      data-search={property.Property.Name}
      data-search-owner="Columbia Heights"
    >
      <div className="search-data-image">
        <Link
          to={`/${property.Property.Address.State.toString().toLowerCase()}/${property.neighborhoodSlug}/${(property.isFurnished ? 'furnished' : 'unfurnished')}/${property.Unit.Id}?arrival=12/22/2023&amp;departure=02/01/2024`}
          title={property.Property.Name}
        >
          <img src={image} onError={() => setImage(placeHolder)} />
        </Link>
      </div>
      <div className="search-data-content">
        <div className="search-data-left">
          <h4>{property.Property.Name}</h4>
          <p>Columbia Heights</p>
          <h5>Available {formatDate(property.AvailableDate)} </h5>
        </div>
        <div className="search-data-right">
          ${property?.Rent}
          <span>night</span>
        </div>
      </div>
    </div>
  );
};

export default function PropertyMapView({
  properties,
  inquiryData,
}: {
  properties: any;
  inquiryData: any;
}) {

  const [markers, setMarkers] = useState<any[]>([]);

  return (
    <div className="search-map-module map-matching-properties">
      <div className="search-map-list">
        <form autoComplete="off" data-hs-cf-bound="true">
          <em className="icon-search"></em>
          <div className="search-map-form">
            <input type="text" placeholder="Search" id="search-map-box" />
          </div>
          <button>
            <em className="icon-close search-map-clear"></em>
          </button>
        </form>
        <div className="search-map-data containerItems">
          {properties.map((property: any) => (
            <PropertyItem property={property} />
          ))}
        </div>
      </div>
      <MapView height={"670"} markers={markers} />
      <ViewToggle />
    </div>
  );
}
