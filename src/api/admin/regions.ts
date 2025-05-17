import { api } from "../api";

const ENDPOINTS = {
  GET_REGION_LIST: "/api/v1/admin/region/list",
  CREATE_REGION: "/api/v1/admin/region/create",
  REGION: "/api/v1/admin/region",
  COMMON: '/api/v1/common'
};

async function getRegionList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_REGION_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.regions || [],
      count: rData?.totalCount || 0,
    };
  });
}

async function getRegionDetail(id: any) {
  return api.get(ENDPOINTS.REGION + '/' + id + '/details').then((res) => res.data);;
}


async function updateRegion(id:any, data: any) {
  return api.patch(ENDPOINTS.REGION+ '/' + id + '/update', data).then((res) => res.data);;
}

async function deleteRegion(id:any) {
  return api.delete(ENDPOINTS.REGION+ '/' + id + '/delete').then((res) => res.data);;
}

async function getRegions() {
  return api.get(ENDPOINTS.COMMON+'/neighbourhoods').then((res) => res.data);
}

async function createRegion(data: any) {
  return api.post(ENDPOINTS.CREATE_REGION, data).then((res) => res.data);
}
  

export {
    getRegionList,
    getRegionDetail,
    updateRegion,
    deleteRegion,
    getRegions,
    createRegion
};
