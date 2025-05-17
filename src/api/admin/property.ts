import { api } from "../api";

const ENDPOINTS = {
  PROPERTIES: "/api/v1/admin/properties",
};

async function getAllPropertyList(data: Record<string, any>) {
  return api.get(ENDPOINTS.PROPERTIES + '/all', { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.properties || [],
      count: rData?.totalcount || 0,
    };
  });
}

async function getActiveProperty(data: Record<string, any>) {
    return api.get(ENDPOINTS.PROPERTIES + '/active', { params: data }).then((res) => {
        const rData = res?.data.data;
        return {
          data: rData?.properties || [],
          count: rData?.totalcount || 0,
        };
      });
}


async function getOnLeaseProperty(data: Record<string, any>) {
    return api.get(ENDPOINTS.PROPERTIES + '/on-lease', { params: data }).then((res) => {
        const rData = res?.data.data;
        return {
          data: rData?.properties || [],
          count: rData?.totalcount || 0,
        };
      });
}

async function getAvailableProperty(data: Record<string, any>) {
    return api.get(ENDPOINTS.PROPERTIES + '/available', { params: data }).then((res) => {
        const rData = res?.data.data;
        return {
          data: rData?.properties || [],
          count: rData?.totalcount || 0,
        };
      });
}

async function createProperty(data: any) {
  return api.post(ENDPOINTS.PROPERTIES + '/create', data).then((res) => res.data);
}

async function updateProperty(id:any, data: any) {
  return api.patch(ENDPOINTS.PROPERTIES + '/' + id + '/update', data).then((res) => res.data);
}

async function propertyDetails(id: any, arrivalDate?:any, departureDate?:any) {
  if(arrivalDate || departureDate) {
    let data = {
      arrivalDate: arrivalDate,
      departureDate: departureDate
    }
    return api.get(`${ENDPOINTS.PROPERTIES}/${id}/details`, { params: data }).then((res) => res.data);
  } else {
    return api.get(`${ENDPOINTS.PROPERTIES}/${id}/details`).then((res) => res.data);
  }
}

async function uploadPropertyImage(id:any, data: any) {
  return api.patch(ENDPOINTS.PROPERTIES + '/' + id + '/upload-image', data).then((res) => res.data);
}

async function deletePropertyImage(id:any, imageId: any) {
  return api.delete(ENDPOINTS.PROPERTIES + '/' + id + '/image/'+imageId).then((res) => res.data);
}

async function propertyImages(id: any) {
  return api.get(`${ENDPOINTS.PROPERTIES}/${id}/images-list`).then((res) => res.data);
}

async function updateImageOrder(id: any, data: any) {
  return api.patch(`${ENDPOINTS.PROPERTIES}/${id}/update-image-order`, data)
    .then((res) => res.data);
}

export {
    getAllPropertyList,
    getActiveProperty,
    getOnLeaseProperty,
    getAvailableProperty,
    createProperty,
    updateProperty,
    propertyDetails,
    uploadPropertyImage,
    deletePropertyImage,
    propertyImages,
    updateImageOrder
};
