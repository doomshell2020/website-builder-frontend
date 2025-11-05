import API from './api'
import { FAQCategoryAttributes } from '../types/faq'

export const viewFAQCategory = async (id: string): Promise<FAQCategoryAttributes[]> => {
    const response = await API.get(`/faq/category/view/${id}`);
    return response.data;
}

export const findFAQsCategories = async (page = 1, limit = 10,): Promise<FAQCategoryAttributes[]> => {
    const response = await API.get("/faq/category/view-all", { params: { page, limit }, });
    return response.data;
};

export const createFAQCategory = async (payload: FAQCategoryAttributes): Promise<FAQCategoryAttributes> => {
    const response = await API.post("/faq/category/add", payload);
    return response.data;
};

export const updateFAQCategory = async (id: string | number, payload: FAQCategoryAttributes,): Promise<FAQCategoryAttributes[]> => {
    const response = await API.put(`/faq/category/update/${id}`, payload);
    return response.data;
};

export const deleteFAQCategory = async (id: number): Promise<void> => {
    await API.delete(`/faq/category/delete/${id}`);
};

export const deleteMultipleFAQCategory = async (ids: string[]): Promise<FAQCategoryAttributes[]> => {
    const response = await API.delete(`/faq/category/delete-multiple`, { data: { ids } });
    return response.data;
};

export const updateFAQCategoryStatus = async (id: number, data: { status: string },): Promise<FAQCategoryAttributes> => {
    const response = await API.patch(`/faq/category/update-status/${id}`, data);
    return response.data;
};

