import API from "./api";
import { Gallery } from "@/types/gallery";

export const getGalleryById = async (id: string): Promise<Gallery[]> => {
    const response = await API.get(`/gallery/view/${id}`);
    return response.data;
};

export const findGalleryBySlug = async (company: string, slug: string): Promise<Gallery[]> => {
    const response = await API.get(`/gallery/view-by/${slug}`, {
        headers: { 'x-schema': company, },
    });
    return response.data;
};

export const getAllGallery = async (page = 1, limit = 10,): Promise<Gallery[]> => {
    const response = await API.get("/gallery/view-all", { params: { page, limit }, });
    return response.data;
};

export const createGallery = async (data: FormData): Promise<Gallery> => {
    const response = await API.post("/gallery/add", data, {
        headers: { "Content-Type": "multipart/form-data", },
    });
    return response.data;
};

export const updateGallery = async (id: string, data: FormData,): Promise<{ status: boolean; message?: string }> => {
    const response = await API.put(`/gallery/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data", },
    });
    return response.data;
};

export const deleteGallery = async (id: number): Promise<void> => {
    await API.delete(`/gallery/delete/${id}`);
};

export const updateGalleryStatus = async (id: number, data: { status: string },): Promise<Gallery> => {
    const response = await API.patch(`/gallery/status-update/${id}`, data);
    return response.data;
};

export const deleteSingleGalleryImage = async (galleryname: string, filename: string): Promise<any> => {
    const response = await API.delete("/gallery/delete-image", { data: { galleryname, filename }, });
    return response.data;
};

// export const deleteSingleImage = async (company: string, galleryname: string, filename: string): Promise<any> => {
//     const response = await API.delete("/gallery/delete-image", { data: { galleryname, filename }, headers: { 'x-schema': company, }, });
//     return response.data;
// };