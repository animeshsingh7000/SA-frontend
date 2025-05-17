import { api } from "../api";

const ENDPOINTS = {
  GET_OWNER_INQUIRES: "/api/v1/owner/inquiries",
  UPDATE_INQUIRY_STATUS: "/api/v1/owner/inquiry-status-update",
  UPDATE_PROPERTY: "/api/v1/property/admin-update",
  PRICE_CALCULATOR: "/api/v1/dynamic-pricing/property-price",
  GET_DYNAMIC_PRICING: "/api/v1/dynamic-pricing/list",
  UPDATE_DYNAMIC_PRICING: "/api/v1/dynamic-pricing/update",
  GET_FEATURETTE_LISTING: "/api/v1/featurette/list",
  ADD_FEATURETTE: "/api/v1/featurette/add",
  FEATURETTE: "api/v1/featurette",
  FEATURE_LISTING: "api/v1/listing/feature-list",
  GET_ONWER_INQUIRY_DETAILS: "api/v1/owner/inquiry"
};

async function getInquires(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_OWNER_INQUIRES, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.ownerInquires || [],
      count: rData?.count || 0,
    };
  });
}

async function getInquiryDetail(id: any) {
  return api.get(ENDPOINTS.GET_ONWER_INQUIRY_DETAILS + '/' + id) .then((res) => res.data);
}

async function updateStatus(data: any) {
  return api.post(ENDPOINTS.UPDATE_INQUIRY_STATUS, data);
}

async function updateOwnerProperty(data: any) {
  return api.put(ENDPOINTS.UPDATE_PROPERTY, data);
}

async function calculatePrice(data: any) {
  return api.post(ENDPOINTS.PRICE_CALCULATOR, data).then((res) => res.data);;
}

async function getDynamicPricingList(securityKey?:any) {
  let url = securityKey ? ENDPOINTS.GET_DYNAMIC_PRICING+'?secretKey='+ securityKey : ENDPOINTS.GET_DYNAMIC_PRICING;
  return api
    .get(url)
    .then((res) => res.data);
}

async function updateDynamicPricing(data:any) {
  return api.patch(ENDPOINTS.UPDATE_DYNAMIC_PRICING, data).then((res) => res.data);
}

async function getFeaturetteListing(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_FEATURETTE_LISTING, { params: data }).then((res) => {
    const rData = res?.data;
    return {
      data: rData?.data || [],
      count: rData?.count || 0,
    };
  });
}

async function addFeaturette(data: any) {
  return api.post(ENDPOINTS.ADD_FEATURETTE, data).then((res) => res.data);
}


async function deleteFeaturette(id: string) {
  return api.delete(`${ENDPOINTS.FEATURETTE}/${id}/delete`);
}


async function getFeaturetteDetails(id: string) {
  return api.get(`${ENDPOINTS.FEATURETTE}/${id}/details`);
}

async function updateFeaturette(data: any) {
  return api.patch(`${ENDPOINTS.FEATURETTE}/${data.id}/update`, data).then((res) => res.data);
}

async function getFeatureListing() {
  return api.get(ENDPOINTS.FEATURE_LISTING);
}

async function updateFeatureList(data: any) {
  return api.patch(`${ENDPOINTS.FEATURE_LISTING}/${data.id}`, data).then((res) => res.data);
}

async function deleteFeature(id: string) {
  return api.delete(`${ENDPOINTS.FEATURE_LISTING}/${id}/delete`);
}

async function updateOwnerInquiry(id:any, data: any) {
  return api.patch(`${ENDPOINTS.GET_ONWER_INQUIRY_DETAILS}/${id}/update`, data).then((res) => res.data);
}

export {
  getInquires,
  updateStatus,
  updateOwnerProperty,
  calculatePrice,
  getDynamicPricingList,
  updateDynamicPricing,
  getFeaturetteListing,
  addFeaturette,
  deleteFeaturette,
  getFeaturetteDetails,
  updateFeaturette,
  getFeatureListing,
  updateFeatureList,
  deleteFeature,
  getInquiryDetail,
  updateOwnerInquiry
};
