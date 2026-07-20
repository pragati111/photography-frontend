import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const getAuthHeader = (token) => {
  const bearerToken =
    token || localStorage.getItem("wholesalerToken");

  if (!bearerToken) return {};

  return {
    Authorization: `Bearer ${bearerToken}`,
  };
};

export const getWholesaleAddresses = (token) =>
  axios.get(`${API}/api/wholesalers/address`, {
    headers: getAuthHeader(token),
  });

export const addWholesaleAddress = (data, token) =>
  axios.post(`${API}/api/wholesalers/address`, data, {
    headers: getAuthHeader(token),
  });

export const updateWholesaleAddress = (id, data, token) =>
  axios.put(`${API}/api/wholesalers/address/${id}`, data, {
    headers: getAuthHeader(token),
  });

export const deleteWholesaleAddress = (id, token) =>
  axios.delete(`${API}/api/wholesalers/address/${id}`, {
    headers: getAuthHeader(token),
  });

export const setDefaultWholesaleAddressApi = (id, token) =>
  axios.put(
    `${API}/api/wholesalers/address/default/${id}`,
    {},
    {
      headers: getAuthHeader(token),
    },
  );