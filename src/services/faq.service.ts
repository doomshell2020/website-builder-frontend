import API from './api'
import { FAQAttributes } from '@/types/faq'

export const viewFAQ = async (id: string): Promise<FAQAttributes[]> => {
    const response = await API.get(`/faq/view/${id}`);
    return response.data;
}

export const findFAQs = async (page = 1, limit = 10,): Promise<FAQAttributes[]> => {
    const response = await API.get("/faq/view-all", { params: { page, limit }, });
    return response.data;
};

export const createFAQ = async (payload: FAQAttributes): Promise<FAQAttributes> => {
    const response = await API.post("/faq/add", payload);
    return response.data;
};

export const updateFAQ = async (id: string | number, payload: FAQAttributes,): Promise<FAQAttributes[]> => {
    const response = await API.put(`/faq/update/${id}`, payload);
    return response.data;
};

export const deleteFAQ = async (id: number): Promise<void> => {
    await API.delete(`/faq/delete/${id}`);
};

export const deleteMultipleFAQ = async (ids: string[]): Promise<FAQAttributes[]> => {
    const response = await API.delete(`/faq/delete-multiple`, { data: { ids } });
    return response.data;
};

export const updateFAQStatus = async (id: number, data: { status: string },): Promise<FAQAttributes> => {
    const response = await API.patch(`/faq/update-status/${id}`, data);
    return response.data;
};

export const updateMultipleFAQStatus = async (data: { ids: string[]; status: string }): Promise<FAQAttributes[]> => {
    const response = await API.put(`/faq/update-bulk-status`, data);
    return response.data;
};
