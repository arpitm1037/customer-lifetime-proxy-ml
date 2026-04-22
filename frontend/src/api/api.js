import axios from "axios";

const BASE_URL = "http://3.93.162.204/api/analytics";

// API: Upload CSV data file
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE_URL}/upload/`, formData);
};

// API: Trigger feature generation
export const generateFeatures = () => {
  return axios.post(`${BASE_URL}/features/`);
};

// API: Trigger prediction pipeline
export const runPrediction = () => {
  return axios.post(`${BASE_URL}/predict/`);
};

// API: Fetch prediction results
export const getPredictions = () => {
  return axios.get(`${BASE_URL}/predictions/`);
};

// API: Fetch cohort analysis results
export const getCohorts = () => {
  return axios.get(`${BASE_URL}/cohorts/`);
};

// API: Fetch customer detail by ID
export const getCustomerDetail = (customerId) => {
  return axios.get(`${BASE_URL}/customer/${customerId}/`);
};

// API: Signup user account
export const signupUser = (payload) => {
  return axios.post(`${BASE_URL}/auth/signup/`, payload);
};

// API: Login user account
export const loginUser = (payload) => {
  return axios.post(`${BASE_URL}/auth/login/`, payload);
};

// API: Save analysis history
export const saveHistory = (payload) => {
  return axios.post(`${BASE_URL}/history/save/`, payload);
};

// API: Fetch analysis history list
export const getHistory = (email) => {
  return axios.get(`${BASE_URL}/history/list/`, { params: { email } });
};

// API: Fetch specific history detail
export const getHistoryDetail = (historyId, email) => {
  return axios.get(`${BASE_URL}/history/detail/${historyId}/`, {
    params: email ? { email } : {},
  });
};
