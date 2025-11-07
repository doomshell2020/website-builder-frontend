import API from './api';
import { User } from '@/types/user';

export const getAllUsers = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/users/view-all', {
    params: { page, limit },
  });
  return response.data;
};

export const getAllAdmins = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/users/view-all-admin', {
    params: { page, limit },
  });
  return response.data;
};

export const getUserById = async (id: string): Promise<{ result: User }> => {
  const response = await API.get(`/users/view/${id}`);
  return response.data;
};

export const fetchProject = async (identifier: string): Promise<any> => {
  try {
    // 🧠 Detect if identifier is a domain (contains a dot)
    const isDomain = identifier.includes(".");

    const endpoint = isDomain
      ? `/company/view-company-by-domain/${identifier}`
      : `/company/view-company/${identifier}`;

    const response = await API.get(endpoint);

    return response.data; // Expected: { status: true, result: {...} }
  } catch (error: any) {
    return {
      status: false,
      message: error?.response?.data?.message || "Project not found",
    };
  }
};

export const searchUsers = async (
  params: { searchParams?: string; fromDate?: string; toDate?: string }, page: number, limit: number,
) => {
  const response = await API.get("/users/search", { params: { ...params, page, limit, }, });
  return response.data;
};

export const createUser = async (data: FormData): Promise<any> => {
  // All fields from UserFormData can be appended to FormData, including nullables
  const response = await API.post('/users/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (id: string, data: any): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/users/update/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data', },
  });
  return response.data;
};
// separate for users profile update
export const updateProfile = async (id: string, data: any): Promise<{ status: boolean; message?: string }> => {
  const response = await API.put(`/update-profile/self/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data', },
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await API.delete(`/users/delete/${id}`);
};

export const updateUserStatus = async (
  id: string,
  data: { status: string }
): Promise<User> => {
  const response = await API.patch(`/users/status/${id}`, data);
  return response.data;
};

export const approveUser = async (id: string, data: { approval: string, newSchema: string, role: number }): Promise<User> => {
  const response = await API.patch(`/users/approve/${id}`, data);
  return response.data;
};

export const getAllSchemas = async (page = 1, limit = 10): Promise<any> => {
  const response = await API.get('/schema/view-all', {
    params: { page, limit },
  });
  return response.data;
};