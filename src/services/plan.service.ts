import API from './api';
import { PlanAttribute } from '@/types/plan';

export const viewAllPlans = async (page = 1, limit = 10): Promise<PlanAttribute> => {
    const response = await API.get('/plans/read-all', { params: { page, limit }, });
    return response.data;
};

export const getPlanById = async (id: number): Promise<PlanAttribute[]> => {
    const response = await API.get(`/plans/view/${id}`);
    return response.data;
};

export const getAllPlans = async (page = 1, limit = 10,): Promise<PlanAttribute[]> => {
    const response = await API.get("/plans/view-all", { params: { page, limit }, });
    return response.data;
};

export const createPlan = async (payload: PlanAttribute): Promise<PlanAttribute> => {
    const response = await API.post("/plans/add", payload);
    return response.data;
};

export const updatePlan = async (id: string | number, payload: PlanAttribute,):
    Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/plans/update/${id}`, payload);
    return response.data;
};

export const deletePlan = async (id: number): Promise<PlanAttribute> => {
    const response = await API.delete(`/plans/delete/${id}`);
    return response.data;
};

export const updatePlanStatus = async (id: number, data: { status: string },): Promise<PlanAttribute> => {
    const response = await API.patch(`/plans/status/${id}`, data);
    return response.data;
};