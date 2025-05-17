import { api } from "../api";

const ENDPOINTS = {
  GET_USER_LIST: "/api/v1/admin/user/list",
  UPDATE_USER: "/api/v1/admin/user/update",
  ADD_USER: "/api/v1/admin/user/add",
  GET_USER_DETAILS: "/api/v1/admin/user/details",
  GET_USER_GROUP_LIST: "/api/v1/admin/user/groups",
};

async function getUserList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_USER_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.users || [],
      count: rData?.totalCount || 0,
    };
  });
}

async function getUserDetail(id: any) {
  return api.get(ENDPOINTS.GET_USER_DETAILS + '/' + id);
}


async function updateUser(id:any, data: any) {
  return api.patch(ENDPOINTS.UPDATE_USER+ '/' + id, data);
}

async function getUserGroupList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_USER_GROUP_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.groups || [],
      count: rData?.totalCount || 0,
    };
  });
}

async function addUser(data: any) {
  return api.post(ENDPOINTS.ADD_USER, data);
}


export {
    getUserList,
    updateUser,
    getUserDetail,
    getUserGroupList,
    addUser
};
