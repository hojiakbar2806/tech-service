import axios from "axios";
import { useEffect } from "react";
import { useSession } from "./useSession";
import api from "@/lib/api";

const useApi = () => {
    const { token, setToken, setUser } = useSession();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            async(config) => {
                    config.headers.Authorization = `Bearer ${token}`;

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status === 401 &&!originalRequest._retry
                ) {
                    originalRequest._retry = true;
                    try {
                        const res = await api.get("/auth/refresh-token");
                        setToken(res.data.access_token);
                        if (res.status === 200) {
                            const res = await api.get("/api/auth/me", {headers: {Authorization: `Bearer ${token}`}});
                            setUser(res.data.user);
                        }
                    } catch {
                        setToken(null);
                        setUser(null);
                        await axios.post("/api/auth/logout");
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [token, setToken, setUser]);

    return api;
};

export default useApi;
