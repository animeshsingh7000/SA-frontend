import { useContext, useEffect, useState } from "react";
import {
  getMyFavOrDislikeProperties,
  getPropertiesByInq,
} from "../../api/property";
import { PropertyCard } from "./PropertyCard";
import Spinner from "../Spinner";
import NoData from "../NoData";
import Filters from "./Filters";
import PropertyMapView from "./PropertyMapView";
import { RentalPropertyContext } from "../../contexts/RentalPropertyProvider";
import { useSearchParams } from "react-router-dom";
import { TABS_KEYS } from "../../constants";

export default function PropertyList({
  inqId,
  isGuestDashboard,
  inquiryData,
}: {
  inqId: string;
  inquiryData: any;
  isGuestDashboard?: boolean;
}) {
  const [loader, setLoader] = useState(true);
  const [properties, setProperties] = useState([]);
  const [allFilters, setAllFilters] = useState({});
  const [page, setPage] = useState();
  const [isFilterAppilied, setIsFilterAppilied] = useState(false);
  const [refreshProperty, setRefreshProperty] = useState(false);
  const [allProperties, setAllProperties] = useState(properties);

  const rentalProperty = useContext(RentalPropertyContext);
  const [searchParams] = useSearchParams();

  const viewType = searchParams.get("view");
  const type = searchParams.get("type");

  const getAllProperty = (page = 1) => {
    // if (allProperties.length) {
    //   setProperties(allProperties);
    //   setAllProperties([]);
    // } else {
    setLoader(true);
    getPropertiesByInq({
      rentalInquiryId: inqId,
      page,
      count: 100,
      ...allFilters,
    }).then(
      (res) => {
        setLoader(false);
        setProperties(res.data.listing);
      },
      (error) => {
        setLoader(false);
      }
    );
    // }
  };

  const getFavDislikeProperty = (isFav: boolean) => {
    setLoader(true);
    setAllProperties(properties);
    getMyFavOrDislikeProperties(isFav).then(
      (res) => {
        setLoader(false);
        setProperties(
          res.data.map(({ propertyId, ...rest }: any) => ({
            ...rest,
            ...propertyId,
          }))
        );
      },
      (error) => {
        setLoader(false);
      }
    );
  };

  const callbackUndoProperty = (id: string) => {
    const index = properties.findIndex((item: any) => item._id === id);
    properties.splice(index, 1);
    setProperties([...properties]);
  };

  useEffect(() => {
    if (inqId && !type) {
      getAllProperty();
    } else if (type === TABS_KEYS.favorites) {
      getFavDislikeProperty(true);
    } else if (type === TABS_KEYS.dislike) {
      getFavDislikeProperty(false);
    }
  }, [inqId, allFilters, type]);

  const applyFilter = (values: any) => {
    setAllFilters(values);
    setIsFilterAppilied(true);
  };

  function toggleLoader() {
    setLoader(!loader);
  }

  return (
    <>
      {!isGuestDashboard &&
        (properties.length !== 0 || isFilterAppilied) &&
        !type && viewType !== "map" && (
          <div className="rental-dashboard-filter">
            <Filters applyAllFilters={applyFilter} />
          </div>
        )}

      <div className="matching-property-card-list mt-3 guest-matching-card manage-card-box-spacing">
        {viewType === "map" ? (
          <PropertyMapView properties={properties} inquiryData={inquiryData} />
        ) : (
          properties.map((property) => (
            <PropertyCard
              property={property}
              inquiryData={inquiryData}
              resetProperty={getAllProperty}
              callbackUndoProperty={callbackUndoProperty}
            />
          ))
        )}
      </div>
      {loader && <Spinner />}
      {properties.length == 0 && !loader ? <NoData /> : <></>}
    </>
  );
}
