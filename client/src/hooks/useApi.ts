import { useEffect } from "react";
import { useSession } from "./useSession";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

const useApi = () => {
    const { session, setSession } = useSession();
    const navigate = useNavigate();

    useEffect(() => {
        let currentToken = session?.token;

        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (currentToken) {
                    config.headers.Authorization = `Bearer ${currentToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        let isRefreshing = false;
        
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (isAxiosError(error) && error.response?.status === 401 && !isRefreshing && error.config) {
                    isRefreshing = true;
                    
                    try {
                        const res = await api.post("/auth/refresh-token", null, { withCredentials: true });
                        const newAccessToken = res.data.access_token;
                        if (session)  setSession({ ...session, token: newAccessToken });
                        currentToken = newAccessToken;
                        const originalRequest = error.config;
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        isRefreshing = false;
                        return api(originalRequest);
                    } catch (refreshError) {
                        isRefreshing = false;
                        localStorage.clear();
                        navigate("/auth/login");
                        return Promise.reject(refreshError);
                    }
                }
                
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [session, setSession, navigate]);

    return api;
};

export default useApi;