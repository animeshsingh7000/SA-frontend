import { api } from "../api";

const ENDPOINTS = {
  GET_AMENITIES: "/api/v1/configuration/amenities",
  GET_UNIT_ANEMITIES: "/api/v1/configuration/unit-amenities",
  GET_PROPERTY_ANEMITIES: "/api/v1/configuration/property-amenities",
  GET_SHARED_ANEMITIES: "/api/v1/configuration/shared-amenities",
  GET_SHARED_ANEMITIES_V2: "/api/v1/configuration/shared-amenities-v2",
  GET_STATE_CODES: "/api/v1/configuration/states-code",
}

async function getAmenities() {
  return api
    .get(ENDPOINTS.GET_AMENITIES)
    .then((res) => res.data);
}

async function getUnitAmenities() {
  return api
    .get(ENDPOINTS.GET_UNIT_ANEMITIES)
    .then((res) => res.data);
}

async function getPropertyAmenities() {
  return api
    .get(ENDPOINTS.GET_PROPERTY_ANEMITIES)
    .then((res) => res.data);
}

async function getSharedAmenities() {
  return api
    .get(ENDPOINTS.GET_SHARED_ANEMITIES)
    .then((res) => res.data);
}

async function getSharedAmenitiesV2() {
  return api
    .get(ENDPOINTS.GET_SHARED_ANEMITIES_V2)
    .then((res) => res.data);
}

async function getStateCodes() {
  return api
    .get(ENDPOINTS.GET_STATE_CODES)
    .then((res) => res.data);
}

export {
    getAmenities,
    getUnitAmenities,
    getPropertyAmenities,
    getSharedAmenities,
    getSharedAmenitiesV2,
    getStateCodes
};
