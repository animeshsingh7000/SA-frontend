import { api } from "../api";

const ENDPOINTS = {
  GET_FEATURETTE: "/api/v1/featurette/list",
  GET_FEATURE_LIST: "/api/v1/listing/feature-list",
  GET_BROWSE_PROPERTY: "/api/v1/listing/list",
  GET_PROPERTY_DETAIL: "/api/v1/listing",
  GET_MAP_LIST: "/api/v1/listing/map-list"
}

async function getFeaturette() {
  return api
    .get(ENDPOINTS.GET_FEATURETTE)
    .then((res) => res.data);
}

async function getFeatureList() {
  return api
    .get(ENDPOINTS.GET_FEATURE_LIST)
    .then((res) => res.data);
}

async function browseProperty(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_BROWSE_PROPERTY, { params: data }).then((res) => {
    const rData = res.data;
    return {
      data: rData.data.listing,
      totalProperty: rData.data.count,
    };
  });
}

async function getPropertyDetail (id:any) {
  return api
    .get(ENDPOINTS.GET_PROPERTY_DETAIL + '/' +id)
    .then((res) => res.data);
}

async function mapView(data?: Record<string, any>) {
  if(data) {
    return api.get(ENDPOINTS.GET_MAP_LIST, { params: data })
    .then((res) => {
      const rData = res.data;
      return {
        data: rData.data.listing,
        totalProperty: rData.data.count,
      };
    });
  } else {
    return api.get(ENDPOINTS.GET_MAP_LIST)
    .then((res) => {
      const rData = res.data;
      return {
        data: rData.data.listing,
        totalProperty: rData.data.count,
      };
    });
  }
}


export {
    getFeaturette,
    getFeatureList,
    browseProperty,
    getPropertyDetail,
    mapView
};
