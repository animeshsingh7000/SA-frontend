import { api } from "../api";

const ENDPOINTS = {
  GET_PROPERTIES: "/api/v1/property/list",
  ADD_PROPERTY: "/api/v1/property/add",
  UPDATE_PROPERTY: "/api/v1/property/update",
  GET_PROPERTY_BY_ID: "/api/v1/property",
  GET_PROPERTIES_BY_RENTAL_ID: "/api/v1/listing/list/rental",
  GET_MY_FAV: "/api/v1/favorites/properties",
};

async function getProperties(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_PROPERTIES, { params: data }).then((res) => {
    const rData = res.data;
    return {
      data: rData.data,
      totalProperties: rData.count,
    };
  });
}

async function getOwnerProperties(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_PROPERTIES+'/owner', { params: data }).then((res) => {
    const rData = res.data;
    return {
      data: rData.data,
      totalProperties: rData.count,
    };
  });
}

async function addProperty(data: any) {
  return api.post(ENDPOINTS.ADD_PROPERTY, data).then((res) => res.data);
}

async function updateProperty(data: any) {
  return api.put(ENDPOINTS.UPDATE_PROPERTY, data).then((res) => res.data);
}

async function getPropertyById(id: any) {
  return api
    .get(ENDPOINTS.GET_PROPERTY_BY_ID + "/" + id)
    .then((res) => res.data);
}

async function getPropertiesByInq(data: Record<string, any>) {
  return api
    .get(ENDPOINTS.GET_PROPERTIES_BY_RENTAL_ID, { params: data })
    .then((res) => res.data);
}

async function getMatchingPropertiesByInq(data: Record<string, any>) {
  return api
    .get(ENDPOINTS.GET_PROPERTIES_BY_RENTAL_ID, { params: data })
    .then((res) => res.data);
}

async function getMyFavOrDislikeProperties(isFavorite: boolean) {
  return api
    .get(ENDPOINTS.GET_MY_FAV, { params: { isFavorite } })
    .then((res) => res.data);
}

export {
  getProperties,
  addProperty,
  updateProperty,
  getPropertyById,
  getPropertiesByInq,
  getMyFavOrDislikeProperties,
  getOwnerProperties,
  getMatchingPropertiesByInq
};
