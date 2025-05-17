import { api } from "../api";

const ENDPOINTS = {
  GET_DOCUMENT_LIST: "/api/v1/admin/lease/template",
  CREATE_BUILDING: "/api/v1/admin/building/create",
  BUILDING: "/api/v1/admin/building",
  GET_RECURRING_RATE: "/api/v1/admin/recurring",
  GET_RECURRING_SCHEDULE: '/api/v1/admin/rcs/list',
  GET_DEPARTURE_SCHEDULE: '/api/v1/admin/dcs/list'
};

async function getDocumentList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_DOCUMENT_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.templates || [],
      count: rData?.pagination.total || 0,
    };
  });
}

async function getRecuuringRate() {
    return api.get(ENDPOINTS.GET_RECURRING_RATE).then((res) => res.data);
}

async function getDocumentTemplateDetail(id: any) {
    return api.get(ENDPOINTS.GET_DOCUMENT_LIST + '/' + id).then((res) => res.data);
}

async function getRecurringRateDetail(id: any) {
  return api.get(ENDPOINTS.GET_RECURRING_RATE + '/' + id).then((res) => res.data);
}


async function updateRecuuringRate(id:any, data: any) {
  return api.put(ENDPOINTS.GET_RECURRING_RATE+ '/' + id, data).then((res) => res.data);
}

async function getRecurringScheduleList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_RECURRING_SCHEDULE, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.data || [],
      count: rData?.count || 0,
    };
  });
}

async function getDepartureScheduleList() {
  return api.get(ENDPOINTS.GET_DEPARTURE_SCHEDULE).then((res) => res.data);
}

export {
    getDocumentList,
    getRecuuringRate,
    getDocumentTemplateDetail,
    getRecurringRateDetail,
    updateRecuuringRate,
    getRecurringScheduleList,
    getDepartureScheduleList
};
