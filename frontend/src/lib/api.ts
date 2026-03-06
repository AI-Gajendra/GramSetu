import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://aibharat.onrender.com",
});

// Automatically attach auth token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("[API] Request:", config.method?.toUpperCase(), config.url, "| Token:", token ? `${token.substring(0, 20)}...` : "NONE");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses — only redirect, DON'T clear storage automatically
// Token should only be cleared on explicit logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only clear and redirect if token exists but is rejected by backend
            // This prevents logout loops when navigating between pages
            const token = localStorage.getItem("token");
            if (token && error.response?.data?.message === "Token has expired") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
