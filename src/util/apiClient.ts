import axios from 'axios';
import { RootState, store } from "../redux/store";

// This is a client-side SPA: apiClient runs in the visitor's BROWSER, so the
// base URL must be reachable from the browser — never localhost/127.0.0.1 in
// production. Configure it per environment with VITE_API_BASE_URL:
//   - .env.development -> http://127.0.0.1:8080 (local backend)
//   - production build  -> the backend's public URL (falls back to the value below)
// Vite inlines VITE_* vars at BUILD time, so rebuild after changing them.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api-e-grant.aztu.edu.az';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = (store.getState() as RootState).auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient; 
