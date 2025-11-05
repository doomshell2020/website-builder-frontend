import API from "./api";
import { Slider } from "@/types/slider";

export const getSliderById = async (id: string): Promise<Slider[]> => {
  const response = await API.get(`/slider/view/${id}`);
  return response.data;
};

export const findSliderByTitle = async (company: string, slug: string): Promise<Slider[]> => {
  const response = await API.get(`/slider/view-by/${slug}`, {
    headers: {
      'x-schema': company,
    },
  });
  return response.data;
};

export const getAllSliders = async (
  page = 1,
  limit = 10,
): Promise<Slider[]> => {
  const response = await API.get("/slider/view-all", {
    params: { page, limit },
  });
  return response.data;
};

export const createSlider = async (data: FormData): Promise<Slider> => {
  const response = await API.post("/slider/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateSlider = async (
  id: string,
  data: FormData,
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/slider/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteSlider = async (id: number): Promise<void> => {
  await API.delete(`/slider/delete/${id}`);
};

export const updateSliderStatus = async (
  id: number,
  data: { status: string },
): Promise<Slider> => {
  const response = await API.patch(`/slider/status-update/${id}`, data);
  return response.data;
};