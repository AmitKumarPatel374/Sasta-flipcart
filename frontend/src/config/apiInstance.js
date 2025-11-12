import axios from 'axios';

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials:true
});

// Add request interceptor to add token
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiInstance;