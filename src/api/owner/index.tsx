import { api } from "../api";

const ENDPOINTS = {
  OWNER_DASHBOARD: "/api/v1/owner/dashboard-counts",
  OWNER_INQUIRY: "/api/v1/owner/inquiry",
  OWNER_LEASE: "/api/v1/owner/leases",
  OWNER_BLOCK_DATE: "/api/v1/owner/block-dates",
}

async function ownerInquiry(data:any) {
    return api
        .post(
            ENDPOINTS.OWNER_INQUIRY,
            data
        )
        .then((res) => res.data);
}

async function getOwnerLeases(data: Record<string, any>) {
    return api.get(ENDPOINTS.OWNER_LEASE ,{ params: data }).then((res) => {
        const rData = res.data;
        return {
          data: rData.data.leases,
          totalLeases: rData.data.count,
        };
    });
}

async function getOwnerLeasesDetail (id:any) {
    return api
      .get(ENDPOINTS.OWNER_LEASE + '/' +id)
      .then((res) => res.data);
  }

async function getOwnerDashboard() {
    return api.get(ENDPOINTS.OWNER_DASHBOARD).then((res) => res.data);
}

async function getOwnerBlockDates(data: Record<string, any>) {
    return api.get(ENDPOINTS.OWNER_BLOCK_DATE ,{ params: data }).then((res) => {
        const rData = res.data;
        return {
          data: rData.data.blockdates,
          totalLeases: rData.data.count,
        };
    });
}

async function createBlockDate(data:any) {
    return api
        .post(
            ENDPOINTS.OWNER_BLOCK_DATE + '/add',
            data
        )
        .then((res) => res.data);
}

async function updateBlockDate(id:any, data:any) {
    return api
        .patch(
            ENDPOINTS.OWNER_BLOCK_DATE + '/' + id +'/update',
            data
        )
        .then((res) => res.data);
}

export {
    ownerInquiry,
    getOwnerLeases,
    getOwnerDashboard,
    getOwnerBlockDates,
    createBlockDate,
    updateBlockDate,
    getOwnerLeasesDetail
};
