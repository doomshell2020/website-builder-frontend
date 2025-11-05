import API from "./api";
import { Testimonial } from "@/types/testimonial";

export const getTestimonialById = async (
  id: string,
): Promise<Testimonial[]> => {
  const response = await API.get(`/testimonials/view/${id}`);
  return response.data;
};

export const fetchTestimonials = async (company: string): Promise<Testimonial[]> => {
  const response = await API.get("/testimonials/view-all", {
    headers: { 'x-schema': company, },
  });
  return response.data;
};

export const getAllTestimonials = async (page, limit) => {
  const response = await API.get("/testimonials/view-all", {
    params: { page, limit },
  });
  return response.data;
};

export const createTestimonial = async (
  data: FormData,
): Promise<Testimonial> => {
  const response = await API.post("/testimonials/add", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateTestimonial = async (
  id: string,
  data: FormData,
): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/testimonials/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTestimonial = async (id: number): Promise<void> => {
  await API.delete(`/testimonials/delete/${id}`);
};

export const updateTestimonialStatus = async (
  id: number,
  data: { status: string },
): Promise<Testimonial> => {
  const response = await API.patch(
    `/testimonials/status-update/${id}`,
    data,
  );
  return response.data;
};
