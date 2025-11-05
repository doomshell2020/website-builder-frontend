import API from "./api";
import { ClientLogo } from "@/types/clientlogo";

export interface PaginatedCustomerResult {
  result: {
    data: ClientLogo[];
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export const getClientLogoById = async (id: string): Promise<ClientLogo[]> => {
  const response = await API.get(`/client-logos/view/${id}`);
  return response.data;
};

export const getAllClientLogos = async (
  page = 1,
  limit = 10,
): Promise<PaginatedCustomerResult> => {
  const response = await API.get(`/client-logos/view-all`, {
    params: { page, limit },
  });
  return response.data;
};

export const createClientLogo = async (data: FormData): Promise<ClientLogo> => {
  const response = await API.post(`/client-logos/add`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateClientLogo = async (
  id: string,
  data: FormData,
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/client-logos/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteClientLogo = async (id: number): Promise<void> => {
  await API.delete(`/client-logos/delete/${id}`);
};

export const updateClientLogoStatus = async (
  id: number,
  data: { status: string },
): Promise<ClientLogo> => {
  const response = await API.patch(`/client-logos/status-update/${id}`, data);
  return response.data;
};