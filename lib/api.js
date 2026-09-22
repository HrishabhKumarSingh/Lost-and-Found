import axios from 'axios';

// Default to internal Next.js API routes when NEXT_PUBLIC_API_URL is not provided
const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
  : '/api';

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = {
  login: (email, password) =>
    axios.post(`${BASE_URL}/login`, { email, password }),

  signup: (data) =>
    axios.post(`${BASE_URL}/signup`, data),

  signout: () =>
    axios.post(`${BASE_URL}/signout`, {}, { headers: authHeaders() }),

  getItems: () =>
    axios.get(`${BASE_URL}/getitem`),

  getItem: (itemId) =>
    axios.get(`${BASE_URL}/item/${itemId}`),

  postItem: (formData, onUploadProgress) =>
    axios.post(`${BASE_URL}/postitem`, formData, {
      headers: { ...authHeaders() },
      onUploadProgress,
    }),

  editItem: (formData) =>
    axios.post(`${BASE_URL}/edititem`, formData, {
      headers: { ...authHeaders() },
    }),

  deleteItem: (itemId) =>
    axios.post(`${BASE_URL}/deleteitem`, { item_id: itemId }, { headers: authHeaders() }),

  activateItem: (itemId) =>
    axios.post(`${BASE_URL}/activateItem/${itemId}`, {}, { headers: authHeaders() }),

  submitAnswer: (data) =>
    axios.post(`${BASE_URL}/submitAnswer`, data, { headers: authHeaders() }),

  confirmResponse: (messageId, response) =>
    axios.post(`${BASE_URL}/confirmResponse/${messageId}`, { response }, { headers: authHeaders() }),

  getMyListings: (userId) =>
    axios.get(`${BASE_URL}/mylistings/${userId}`, { headers: authHeaders() }),

  getMyResponses: (userId) =>
    axios.get(`${BASE_URL}/myresponses/${userId}`, { headers: authHeaders() }),

  getNumber: (userId) =>
    axios.get(`${BASE_URL}/getnumber/${userId}`, { headers: authHeaders() }),

  sendMessage: (data) =>
    axios.post(`${BASE_URL}/sendmessage`, data),
};

export default api;
