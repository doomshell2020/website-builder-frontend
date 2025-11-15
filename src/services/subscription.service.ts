import API from './api';
import { SubscriptionAttribute } from '@/types/subscription';

export const viewAllSubscriptions = async (page = 1, limit = 10): Promise<SubscriptionAttribute> => {
    const response = await API.get('/subscription/read-all', { params: { page, limit }, });
    return response.data;
};

export const getSubscriptionById = async (id: number): Promise<SubscriptionAttribute[]> => {
    const response = await API.get(`/subscription/view/${id}`);
    return response.data;
};

export const getAllSubscriptions = async (page = 1, limit = 10,): Promise<SubscriptionAttribute[]> => {
    const response = await API.get("/subscription/view-all", { params: { page, limit }, });
    return response.data;
};

export const createSubscription = async (payload: SubscriptionAttribute): Promise<SubscriptionAttribute> => {
    const response = await API.post("/subscription/create", payload);
    return response.data;
};

export const updateSubscription = async (id: string | number, payload: SubscriptionAttribute,): Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/subscription/update/${id}`, payload);
    return response.data;
};

export const deleteSubscription = async (id: number): Promise<SubscriptionAttribute> => {
    const response = await API.delete(`/subscription/delete/${id}`);
    return response.data;
};

export const updateSubscriptionStatus = async (id: number, data: { status: string },): Promise<SubscriptionAttribute> => {
    const response = await API.patch(`/subscription/status/${id}`, data);
    return response.data;
};

export const searchSubscription = async (
    params: { searchParams?: string; fromDate?: string; toDate?: string }, page: number, limit: number,
) => {
    const response = await API.get("/subscription/search", { params: { ...params, page, limit, }, });
    return response.data;
};