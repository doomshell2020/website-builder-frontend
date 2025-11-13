import API from './api';
import { ThemeAttribute } from '@/types/theme';

export const viewAllThemes = async (page = 1, limit = 10): Promise<ThemeAttribute> => {
    const response = await API.get('/themes/read-all', { params: { page, limit }, });
    return response.data;
};

export const getThemeById = async (id: string): Promise<ThemeAttribute[]> => {
    const response = await API.get(`/themes/view/${id}`);
    return response.data;
};

export const getAllThemes = async (page = 1, limit = 10,): Promise<ThemeAttribute[]> => {
    const response = await API.get("/themes/view-all", { params: { page, limit }, });
    return response.data;
};

export const createTheme = async (payload: ThemeAttribute): Promise<ThemeAttribute> => {
    const response = await API.post("/themes/add", payload);
    return response.data;
};

export const updateTheme = async (id: string | number, payload: ThemeAttribute,):
    Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/themes/update/${id}`, payload);
    return response.data;
};

export const deleteTheme = async (id: number): Promise<void> => {
    await API.delete(`/themes/delete/${id}`);
};

export const updateThemeStatus = async (id: number, data: { status: string },): Promise<ThemeAttribute> => {
    const response = await API.patch(`/themes/status/${id}`, data);
    return response.data;
};
