import API from './api'
import { EnquiryAttributes } from '../types/enquiry'

export const viewEnquiry = async (id: string): Promise<EnquiryAttributes[]> => {
    const response = await API.get(`/enquiries/view/${id}`);
    return response.data;
}

export const getEnquiries = async (page = 1, limit = 10,): Promise<EnquiryAttributes[]> => {
    const response = await API.get("/enquiries/view-all", {
        params: { page, limit },
    });
    return response.data;
};

export const createEnquiry = async (
    company: string, payload: EnquiryAttributes): Promise<EnquiryAttributes> => {
    const response = await API.post("/enquiries/add", payload, {
        headers: { "x-schema": company, },
    });
    return response.data;
};


export const deleteEnquiry = async (id: number): Promise<void> => {
    await API.delete(`/enquiries/delete/${id}`);
};

export const deleteMultipleEnquiry = async (ids: string[]): Promise<EnquiryAttributes[]> => {
    const response = await API.delete(`/enquiries/delete-multiple`, { data: { ids } });
    return response.data;
};

export const getAllCountries = async () => {
    const response = await API.get("/country/find-all");
    return response;
};
