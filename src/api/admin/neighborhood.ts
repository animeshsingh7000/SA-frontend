import { api } from "../api";

const ENDPOINTS = {
  GET_NEIGHBOURHOOD_LIST: "/api/v1/admin/neighbourhood/list",
  CREATE_NEIGHBOURHOOD: "/api/v1/admin/neighbourhood/create",
  NEIGHBOURHOOD: "/api/v1/admin/neighbourhood",
  COMMON: '/api/v1/common'
};

async function getNeighbourhoodList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_NEIGHBOURHOOD_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.neighbourhoods || [],
      count: rData?.totalCount || 0,
    };
  });
}

async function getNeighbourhoodDetail(id: any) {
  return api.get(ENDPOINTS.NEIGHBOURHOOD + '/' + id + '/details').then((res) => res.data);;
}


async function updateNeighbourhood(id:any, data: any) {
  return api.patch(ENDPOINTS.NEIGHBOURHOOD+ '/' + id + '/update', data).then((res) => res.data);;
}

async function deleteNeighbourhood(id:any) {
  return api.delete(ENDPOINTS.NEIGHBOURHOOD+ '/' + id + '/delete').then((res) => res.data);
}


async function getQuadrants() {
  return api.get(ENDPOINTS.COMMON+'/quadrants').then((res) => res.data);
}

async function getNeighbourhood() {
  return api.get(ENDPOINTS.COMMON+'/neighbourhoods').then((res) => res.data);
}

async function createNeighbourhood(data: any) {
  return api.post(ENDPOINTS.CREATE_NEIGHBOURHOOD, data).then((res) => res.data);
}

export {
    getNeighbourhoodList,
    getNeighbourhoodDetail,
    updateNeighbourhood,
    deleteNeighbourhood,
    getQuadrants,
    getNeighbourhood,
    createNeighbourhood
};
