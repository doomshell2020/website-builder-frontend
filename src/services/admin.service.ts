// services/adminService.ts
import API from "./api";
import { AdminLoginResponse } from "@/types/admin";

// ✅ LOGIN
export const AdminLogin = async (data: {
  email: string;
  password: string;
}): Promise<AdminLoginResponse> => {
  const response = await API.post("/auth/login", data, {
    validateStatus: () => true, // ✅ Prevent Axios from throwing
  });
  return response.data;
};

// ✅ PROFILE
export const AdminProfile = async () => {
  const response = await API.get("/profile", {
    withCredentials: true, // ✅ ensure cookies sent with GET requests too
  });
  return response.data;
};