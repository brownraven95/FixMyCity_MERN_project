import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for receiving and sending HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Authorization Bearer token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fmc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
      // Token expired or invalid
      // Do not hard-redirect if checking /citizens/me on first load
    }
    return Promise.reject(error);
  }
);

// ================= AUTH APIs =================
export const registerApi = (data) => api.post("/citizens/register", data);
export const loginApi = (credentials) => api.post("/citizens/login", credentials);
export const getProfileApi = () => api.get("/citizens/me");
export const logoutApi = () => api.post("/citizens/logout");
export const changePasswordApi = (data) => api.patch("/citizens/change-password", data);

// ================= ISSUES APIs =================
export const getIssuesApi = (params) => api.get("/issues", { params });
export const getIssueByIdApi = (id) => api.get(`/issues/${id}`);
export const createIssueApi = (data) => api.post("/issues", data);
export const toggleUpvoteApi = (id) => api.post(`/issues/${id}/upvote`);
export const updateIssueStatusApi = (id, data) => api.patch(`/issues/${id}/status`, data);

// ================= WATCHLIST APIs =================
export const getWatchlistApi = () => api.get("/watchlist");
export const addToWatchlistApi = (issueId) => api.post(`/watchlist/${issueId}`);
export const removeFromWatchlistApi = (issueId) => api.delete(`/watchlist/${issueId}`);
export const toggleWatchlistApi = (issueId) => api.patch(`/watchlist/${issueId}/toggle`);

// ================= GRIEVANCE APIs =================
export const fileGrievanceApi = (data) => api.post("/grievances/file", data);
export const getMyGrievancesApi = () => api.get("/grievances");
export const getGrievanceByIdApi = (id) => api.get(`/grievances/${id}`);
export const updateGrievanceStatusApi = (id, data) => api.patch(`/grievances/${id}/status`, data);

export default api;
