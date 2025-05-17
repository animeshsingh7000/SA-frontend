import { api } from "../api";

const ENDPOINTS = {
    GET_FEATURETTE: "/api/v1/featurette/list/admin",
    FEATURETTE: "/api/v1/featurette",
    BLOG: "/api/v1/admin/blogs",
    GET_BLOGS: "/api/v1/admin/blogs/list",
    GET_PROMOTED_PROPERTIES: "/api/v1/admin/promoted-properties",
};

async function getFeaturetteList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_FEATURETTE, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.totalResult || [],
      count: rData?.count || 0,
    };
  });
}

async function getFeaturetteDetail(id: any) {
  return api.get(ENDPOINTS.FEATURETTE + '/' + id + '/details').then((res) => res.data);;
}

async function updateFeaturette(id:any, data: any) {
  return api.patch(ENDPOINTS.FEATURETTE+ '/' + id + '/update', data).then((res) => res.data);;
}

async function deleteFeaturette(id:any) {
  return api.delete(ENDPOINTS.FEATURETTE+ '/' + id + '/delete').then((res) => res.data);
}

async function createFeaturette(data: any) {
  return api.post(ENDPOINTS.FEATURETTE+'/add', data).then((res) => res.data);
}

async function getBlogList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_BLOGS, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.blogs || [],
      count: rData?.totalCount || 0,
    };
  });
}

async function getBlogDetail(id: any) {
  return api.get(ENDPOINTS.BLOG + '/' + id + '/details').then((res) => res.data);;
}

async function updateBlog(id:any, data: any) {
  return api.patch(ENDPOINTS.BLOG+ '/' + id + '/update', data).then((res) => res.data);;
}

async function deleteBlog(id:any) {
  return api.delete(ENDPOINTS.BLOG+ '/' + id + '/delete').then((res) => res.data);
}

async function createBlog(data: any) {
  return api.post(ENDPOINTS.BLOG+'/create', data).then((res) => res.data);
}

async function getPromotedPropertyList() {
  return api.get(ENDPOINTS.GET_PROMOTED_PROPERTIES).then((res) => res.data);
}

async function getPromotedPropertyDetail(position: any) {
  return api.get(ENDPOINTS.GET_PROMOTED_PROPERTIES + '/' + position ).then((res) => res.data);;
}

async function updatePromotedProperty(position:any, data: any) {
  return api.patch(ENDPOINTS.GET_PROMOTED_PROPERTIES+ '/' + position, data).then((res) => res.data);;
}

async function deletePromotedProperty(position:any) {
  return api.delete(ENDPOINTS.GET_PROMOTED_PROPERTIES+ '/' + position).then((res) => res.data);
}

async function createPromotedProperty(data: any) {
  return api.post(ENDPOINTS.GET_PROMOTED_PROPERTIES, data).then((res) => res.data);
}

export {
    getFeaturetteList,
    getFeaturetteDetail,
    updateFeaturette,
    deleteFeaturette,
    createFeaturette,
    getBlogList,
    createBlog,
    deleteBlog,
    updateBlog,
    getBlogDetail,
    getPromotedPropertyList,
    getPromotedPropertyDetail,
    updatePromotedProperty,
    deletePromotedProperty,
    createPromotedProperty
};
