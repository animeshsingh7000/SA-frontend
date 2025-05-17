import { api } from "../api";

const ENDPOINTS = {
  GET_BLOCKDATES_LIST: "/api/v1/admin/block-dates/list",
  CREATE_BLOCK_DATE: "/api/v1/admin/block-dates/create",
  BLOCK_DATE: "/api/v1/admin/block-dates",
};

async function getBlockDateList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_BLOCKDATES_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.blockdates || [],
      count: rData?.count || 0,
    };
  });
}

async function getBlockDateDetail(id: any) {
  return api.get(ENDPOINTS.BLOCK_DATE + '/' + id + '/details').then((res) => res.data);;
}


async function updateBlockDate(id:any, data: any) {
  return api.patch(ENDPOINTS.BLOCK_DATE+ '/' + id + '/update', data).then((res) => res.data);;
}

async function deleteBlockDate(id:any) {
  return api.delete(ENDPOINTS.BLOCK_DATE+ '/' + id + '/delete').then((res) => res.data);
}


async function createBlockDate(data: any) {
  return api.post(ENDPOINTS.CREATE_BLOCK_DATE, data).then((res) => res.data);
}

export {
    getBlockDateList,
    getBlockDateDetail,
    updateBlockDate,
    deleteBlockDate,
    createBlockDate
};
