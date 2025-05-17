import { api } from "../api";

const ENDPOINTS = {
  GET_RENTAL_INQUIRES: "/api/v1/admin/rental-enquiry/list",
  RENTAL_INQUIRY_DETAIL: "/api/v1/admin/rental-enquiry"

};

async function getRentalInquires(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_RENTAL_INQUIRES, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.rentalInquires || [],
      count: rData?.count || 0,
    };
  });
}

async function getRentalInquiryDetail(id: any) {
  return api.get(ENDPOINTS.RENTAL_INQUIRY_DETAIL + '/' + id + '/details') .then((res) => res.data);
}

async function updateRentalInquiry(id:any, data: any) {
  return api.patch(`${ENDPOINTS.RENTAL_INQUIRY_DETAIL}/${id}/update`, data).then((res) => res.data);
}

async function deleteRentalInquiry(id:any) {
  return api.delete(ENDPOINTS.RENTAL_INQUIRY_DETAIL+ '/' + id + '/delete').then((res) => res.data);
}

async function getRentalInquiryGuestHistory(id:any, data: Record<string, any>) {
  return api.get(ENDPOINTS.RENTAL_INQUIRY_DETAIL+'/'+id+ '/guest-history', { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.history || [],
      count: rData?.count || 0,
    };
  });
}

async function getRentalInquirySuggestedProperties(id:any, data: Record<string, any>) {
  return api.get(ENDPOINTS.RENTAL_INQUIRY_DETAIL+'/'+id+ '/suggested-Properties', { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.properties || [],
      count: rData?.count || 0,
    };
  });
}

async function updateSuggestedPropStatus(data: any) {
  return api.patch(`${ENDPOINTS.RENTAL_INQUIRY_DETAIL}/suggested-property/status`, data).then((res) => res.data);
}


export {
  getRentalInquires,
  getRentalInquiryDetail,
  updateRentalInquiry,
  deleteRentalInquiry,
  getRentalInquiryGuestHistory,
  getRentalInquirySuggestedProperties,
  updateSuggestedPropStatus
};
