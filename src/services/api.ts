import { getToken, getSlug } from "@/lib/auth";
import axios, { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add token and schema
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const slug = getSlug?.();
  const token = typeof window !== 'undefined' ? getToken?.() : null;

  if (slug && config.headers) {
    config.headers['x-schema'] = slug;
  }
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: Handle 401 globally
API.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response?.status == 401) {
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/administrator';
      }
    }
    return Promise.reject(error);
  }
);

export default API;