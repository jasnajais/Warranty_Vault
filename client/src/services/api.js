import axios from "axios";

const api = axios.create({ baseURL: "" });

export const fetchStats = () => api.get("/api/warranties/stats").then((r) => r.data);

export const fetchWarranties = (params) =>
  api.get("/api/warranties", { params }).then((r) => r.data);

export const createWarranty = (formData) =>
  api.post("/api/warranties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteWarranty = (id) => api.delete(`/api/warranties/${id}`);
