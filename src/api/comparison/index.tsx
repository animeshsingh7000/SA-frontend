import { api } from "../api";

const ENDPOINTS = {
  COMPARE_PROPERTIES: "/api/v1/property-comparison/list"
}

async function compareProperties() {
    return api.get(ENDPOINTS.COMPARE_PROPERTIES).then((res) => res.data);
}

export {
    compareProperties
};
