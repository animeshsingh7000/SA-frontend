import { api } from "../api";

const ENDPOINTS = {
  GET_RENTER_TYPE: "/api/v1/admin/lease/renters/type",
  GET_LEASE_STATUS: "/api/v1/admin/lease/status",
  GET_PER_DIEM_TYPE: "/api/v1/admin/lease/perdiem/type",
  CREATE_LEASE: "/api/v1/admin/lease/create",
  UPDATE_LEASE: "/api/v1/admin/lease/update",
  GET_LEASE_TEMPLATE: "/api/v1/admin/lease/template",
  GET_LEASE_LIST: "/api/v1/admin/lease/list",
  LEASE: '/api/v1/admin/lease',
  RECURRING_FEE: '/api/v1/admin/recurring/fee',
  INVOICE: '/api/v1/admin/invoice',
  GET_TRANSACTION_CREDIT_TYEPE: '/api/v1/admin/transaction/credit/types',
  GET_TRANSACTION_TYEPE: '/api/v1/admin/transaction/types',
  ADD_TRANSACTION: '/api/v1/admin/transaction/add',
  PAYMENT_SUMMARY: '/api/v1/admin/lease/payments/summary',
  DELETE_PAYMENT: '/api/v1/admin/lease/payments',
  IMPERSONATE_USER: '/api/v1/admin/user',
  EXPORT_UNSIGNED_PDF: '/api/v1/admin/lease/export/template'
};

async function getAllLeaseList(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_LEASE_LIST, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.leases || [],
      count: rData?.count || 0,
    };
  });
}

async function getRenterType() {
    return api.get(ENDPOINTS.GET_RENTER_TYPE).then((res) => res.data);
}

async function getLeaseStatus() {
    return api.get(ENDPOINTS.GET_LEASE_STATUS).then((res) => res.data);
}

async function getPerDiemType() {
    return api.get(ENDPOINTS.GET_PER_DIEM_TYPE).then((res) => res.data);
}

async function getLeaseTemplate(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_LEASE_TEMPLATE, { params: data }).then((res) => {
    const rData = res?.data.data;
    return {
      data: rData?.templates || [],
      count: rData?.pagination.total || 0,
    };
  });
}

async function createLease(data: any) {
  return api.post(ENDPOINTS.CREATE_LEASE, data).then((res) => res.data);
}

async function updateLease(data: any) {
  return api.post(ENDPOINTS.UPDATE_LEASE, data).then((res) => res.data);
}

async function leaseDetails(id: any) {
  return api.get(`${ENDPOINTS.LEASE}/${id}/details`).then((res) => res.data);
}

async function lockUnlockLease(id:any, isLocked:boolean) {
  return api.patch(`${ENDPOINTS.LEASE}/${id}/lock-unlock?isLocked=`+isLocked).then((res) => res.data);
}

async function deleteLease(id:any) {
  return api.delete(`${ENDPOINTS.LEASE}/${id}/delete`).then((res) => res.data);
}

async function getRecurringFee(data:any) {
  return api.post(ENDPOINTS.RECURRING_FEE, data).then((res) => res.data);
}

async function getTransactionType() {
  return api.get(`${ENDPOINTS.GET_TRANSACTION_TYEPE}`).then((res) => res.data);
}

async function getTransactionCreditType() {
  return api.get(`${ENDPOINTS.GET_TRANSACTION_CREDIT_TYEPE}`).then((res) => res.data);
}

async function lockUnlockTransaction(id:any, isLocked:boolean) {
  return api.patch(`${ENDPOINTS.INVOICE}/${id}/lock-unlock?isLocked=`+isLocked).then((res) => res.data);
}

async function invoiceDetail(id:any) {
  return api.get(`${ENDPOINTS.INVOICE}/${id}`).then((res) => res.data);
}

async function addTransaction(data: any) {
  return api.post(ENDPOINTS.ADD_TRANSACTION, data).then((res) => res.data);
}

async function paymentSummary(id:any) {
  return api.get(`${ENDPOINTS.PAYMENT_SUMMARY}/${id}`).then((res) => res.data);
}

async function deletePayment(data:any) {
  return api.delete(`${ENDPOINTS.DELETE_PAYMENT}/${data.paymentId}/${data.invoiceId}`).then((res) => res.data);
}

async function impersonateUser(id:any) {
  return api.get(`${ENDPOINTS.IMPERSONATE_USER}/${id}/impersonate`).then((res) => res.data);
}

async function exportUnsignedPdf(id:any) {
  return api.get(`${ENDPOINTS.EXPORT_UNSIGNED_PDF}/${id}`).then((res) => res.data);
}

export {
    getAllLeaseList,
    getRenterType,
    getLeaseStatus,
    getPerDiemType,
    getLeaseTemplate,
    createLease,
    updateLease,
    leaseDetails,
    lockUnlockLease,
    deleteLease,
    getRecurringFee,
    getTransactionType,
    getTransactionCreditType,
    lockUnlockTransaction,
    invoiceDetail,
    addTransaction,
    paymentSummary,
    deletePayment,
    impersonateUser,
    exportUnsignedPdf
};
