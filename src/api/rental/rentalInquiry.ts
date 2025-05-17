import { api } from "../api";

const ENDPOINTS = {
  RENTAL_INQUIRY: "/api/v1/rental/inquiry",
  GET_PROPERTY_LIST: "/api/v1/listing/mapped-list",
  GET_OWNER_PROPERTY_LIST: "/api/v1/listing/mapped-list-owner",
  GET_LEASE: "/api/v1/rental/leases",
  FAV: "/api/v1/favorites/property",
  NOTES: "/api/v1/property-notes/list",
  SUBMIT_NOTES: "/api/v1/property-notes/submit",
  INVOICE_DETAIL: "/api/v1/rental/invoice"
};

async function getPropertyList() {
  return api.get(ENDPOINTS.GET_PROPERTY_LIST).then((res) => res.data);
}

async function getOwnerPropertyList() {
  return api.get(ENDPOINTS.GET_OWNER_PROPERTY_LIST).then((res) => res.data);
}

async function submitRentalInquiry(data: any) {
  return api.post(ENDPOINTS.RENTAL_INQUIRY, data).then((res) => res.data);
}
async function addRentalInquiry(data: any) {
  return api
    .post(`${ENDPOINTS.RENTAL_INQUIRY}/add`, data)
    .then((res) => res.data);
}
async function editRentalInq({ _id, ...data }: any) {
  return api
    .put(`${ENDPOINTS.RENTAL_INQUIRY}/${_id}`, data)
    .then((res) => res.data);
}

async function getRentalInquiryById(id: string) {
  return api.get(`${ENDPOINTS.RENTAL_INQUIRY}/${id}`).then((res) => res.data);
}

async function getRentalInquiryForLoggedInuser() {
  return api.get(ENDPOINTS.RENTAL_INQUIRY+'/details').then((res) => res.data);
}

async function updateStatus(data: any) {
  return api.put(ENDPOINTS.RENTAL_INQUIRY, data);
}

async function getRentalLeases(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_LEASE, { params: data }).then((res) => {
    const rData = res.data;
    return {
      data: rData.data.leases,
      totalLeases: rData.data.count,
    };
  });
}

async function getRentalLeaseDetail(id:any) {
  return api.get(ENDPOINTS.GET_LEASE+'/'+id).then((res) => res.data);
}

async function getRentalInvoiceDetail(id:any) {
  return api.get(ENDPOINTS.INVOICE_DETAIL+'/'+id+'/summary').then((res) => res.data);
}

async function getItemizedInvoiceDetail(id:any) {
  return api.get(ENDPOINTS.INVOICE_DETAIL+'/'+id+'/itemized').then((res) => res.data);
}

async function markFav(
  id: string,
  data: { isFavorite: boolean; note?: string }
) {
  return api.post(`${ENDPOINTS.FAV}/${id}`, data);
}

async function unMarkFav(id: string) {
  return api.delete(`${ENDPOINTS.FAV}/${id}`);
}

async function updateFav(
  id: string,
  data: { isFavorite: boolean; note?: string }
) {
  return api.put(`${ENDPOINTS.FAV}/${id}`, data);
}

async function getNotesForProperty(propertyId:any) {
  return api.get(ENDPOINTS.NOTES+'?propId='+propertyId).then((res) => res.data);
}
async function submitNotes(data: {
  notes: string[];
  propertyId: string;
}) {
  return api.post(ENDPOINTS.SUBMIT_NOTES, data).then((res) => res.data);
}

async function invoicePay(data:any) {
  return api.post(`${ENDPOINTS.INVOICE_DETAIL}/pay`, data).then((res) => res.data);
}

async function sendInvoiceEmail(id:any, data:any) {
  return api.post(`${ENDPOINTS.INVOICE_DETAIL}/${id}/summary/email`, data).then((res) => res.data);
}

export {
  getPropertyList,
  updateStatus,
  submitRentalInquiry,
  getRentalInquiryById,
  getRentalLeases,
  getRentalInquiryForLoggedInuser,
  addRentalInquiry,
  editRentalInq,
  markFav,
  unMarkFav,
  updateFav,
  getNotesForProperty,
  submitNotes,
  getOwnerPropertyList,
  getRentalLeaseDetail,
  getRentalInvoiceDetail,
  getItemizedInvoiceDetail,
  invoicePay,
  sendInvoiceEmail
};
