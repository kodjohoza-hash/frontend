import { useEffect } from 'react';
import api from '@config/axios';
import useAuthStore from '@store/auth.store';

const useAxios = () => {
  const { token } = useAuthStore();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  return { api };
};

export default useAxios;
