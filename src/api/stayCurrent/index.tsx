import { api } from "../api";

const ENDPOINTS = {
  GET_FAQ: "/api/v1/faq/list",
  GET_TEAM: "/api/v1/user/attache-user-list",
  GET_NEWS: "api/v1/news/list",
  POST_CONTACT: "api/v1/contact-us/add"
}

async function getFAQ() {
  return api
    .get(ENDPOINTS.GET_FAQ)
    .then((res) => res.data);
}

async function getTeam() {
  return api
    .get(ENDPOINTS.GET_TEAM)
    .then((res) => res.data);
}

async function getNews(data: Record<string, any>) {
  return api.get(ENDPOINTS.GET_NEWS, { params: data }).then((res) => {
    const rData = res.data;
    return {
      data: rData.data.newsList,
      totalNews: rData.data.count,
    };
  });
}

async function contactUs(data: any) {
  return api.post(ENDPOINTS.POST_CONTACT, data).then((res) => res.data);
}

export {
    getFAQ,
    getTeam,
    getNews,
    contactUs
};
