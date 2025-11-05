import API from "./api";
import { Seo } from "@/types/seo";

export const getSeoById = async (id: string): Promise<Seo[]> => {
  const response = await API.get(`/seo/view/${id}`);
  return response.data;
};

export const getSeoByPage = async (
  orgid: number | string,
  type: string,
): Promise<Seo[]> => {
  const response = await API.get(`/seo/view-seo`, {
    params: { orgid, type },
  });
  return response.data;
};

export const searchSeo = async (
  searchType: string,
  searchQuery: string,
  page: number,
  limit: number,
) => {
  const response = await API.get("/seo/search", {
    params: { searchType, searchQuery, page, limit },
  });
  return response.data;
};

export const getAllSeo = async (page: number, limit: number) => {
  const response = await API.get("/seo/view-all", {
    params: { page, limit },
  });
  return response.data;
};

export const createSeo = async (data: any): Promise<Seo> => {
  const response = await API.post("/seo/add", data);
  return response.data;
};

export const updateSeo = async (
  id: string,
  data: any,
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/seo/update/${id}`, data);
  return response.data;
};

export const deleteSeo = async (id: number): Promise<void> => {
  await API.delete(`/seo/delete/${id}`);
};

export const deleteSeoByOrgId = async (id: number): Promise<void> => {
  await API.delete(`/seo/delete-multiple/${id}`);
};

export const updateSeoStatus = async (
  id: number,
  data: { status: string },
): Promise<Seo> => {
  const response = await API.patch(`/seo/status-update/${id}`, data);
  return response.data;
};
