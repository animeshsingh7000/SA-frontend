import { api } from "../api";

const ENDPOINTS = {
  GET_BUILDING_LIST: "/api/v1/admin/building/list",
  CREATE_BUILDING: "/api/v1/admin/building/create",
  BUILDING: "/api/v1/admin/building",
};

async function getBuildingList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_BUILDING_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.buildings || [],
      count: rData?.totalCount || 0,
    };
  });
}

async function getBuildingDetail(id: any) {
  return api.get(ENDPOINTS.BUILDING + '/' + id + '/details').then((res) => res.data);
}


async function updateBuilding(id:any, data: any) {
  return api.patch(ENDPOINTS.BUILDING+ '/' + id + '/update', data).then((res) => res.data);
}

async function deleteBuilding(id:any) {
  return api.delete(ENDPOINTS.BUILDING+ '/' + id + '/delete').then((res) => res.data);
}


async function createBuilding(data: any) {
  return api.post(ENDPOINTS.CREATE_BUILDING, data).then((res) => res.data);
}

export {
    getBuildingList,
    getBuildingDetail,
    updateBuilding,
    deleteBuilding,
    createBuilding
};
