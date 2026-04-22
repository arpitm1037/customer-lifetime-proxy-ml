import axios from "axios";

const BASE_URL = "http://3.93.162.204"

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/upload/`, formData);
};

export const generateFeatures = () => {
  return axios.post(`${BASE_URL}/features/`);
};

export const runPrediction = () => {
  return axios.post(`${BASE_URL}/predict/`);
};

export const getPredictions = () => {
  return axios.get(`${BASE_URL}/predictions/`);
};

export const getCohorts = () => {
  return axios.get(`${BASE_URL}/cohorts/`);
};

export const getCustomerDetail = (customerId) => {
  return axios.get(`${BASE_URL}/customer/${customerId}/`);
};

export const signupUser = (payload) => {
  return axios.post(`${BASE_URL}/auth/signup/`, payload);
};

export const loginUser = (payload) => {
  return axios.post(`${BASE_URL}/auth/login/`, payload);
};

export const saveHistory = (payload) => {
  return axios.post(`${BASE_URL}/history/save/`, payload);
};

export const getHistory = (email) => {
  return axios.get(`${BASE_URL}/history/list/`, { params: { email } });
};

export const getHistoryDetail = (historyId, email) => {
  return axios.get(`${BASE_URL}/history/detail/${historyId}/`, {
    params: email ? { email } : {},
  });
};