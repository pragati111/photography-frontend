// api/addressApi.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getAddresses = (token) =>
  axios.get(`${API}/api/user/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addAddress = (data, token) =>
  axios.post(`${API}/api/user/addresses`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAddress = (id, data, token) =>
  axios.put(`${API}/api/user/addresses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAddress = (id, token) =>
  axios.delete(`${API}/api/user/addresses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const setDefaultAddressApi = (id, token) =>
  axios.patch(`${API}/api/user/addresses/${id}/default`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });