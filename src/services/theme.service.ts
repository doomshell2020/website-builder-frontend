import API from './api';
import { WebsiteTypeAttribute } from '@/types/theme';

export const viewAllWebsiteType = async (page = 1, limit = 10): Promise<WebsiteTypeAttribute> => {
    const response = await API.get('/themes/read-all', { params: { page, limit }, });
    return response.data;
};

export const getWebsiteTypeById = async (id: string): Promise<WebsiteTypeAttribute[]> => {
    const response = await API.get(`/themes/view/${id}`);
    return response.data;
};

export const getAllWebsiteTypes = async (page = 1, limit = 10,): Promise<WebsiteTypeAttribute[]> => {
    const response = await API.get("/themes/view-all", { params: { page, limit }, });
    return response.data;
};

export const createWebsiteType = async (payload: WebsiteTypeAttribute): Promise<WebsiteTypeAttribute> => {
    const response = await API.post("/themes/add", payload);
    return response.data;
};

export const updateWebsiteType = async (id: string | number, payload: WebsiteTypeAttribute,):
    Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/themes/update/${id}`, payload);
    return response.data;
};

export const deleteWebsiteType = async (id: number): Promise<void> => {
    await API.delete(`/themes/delete/${id}`);
};

export const updateWebsiteTypeStatus = async (id: number, data: { status: string },): Promise<WebsiteTypeAttribute> => {
    const response = await API.patch(`/themes/status/${id}`, data);
    return response.data;
};
