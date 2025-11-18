import axios from 'axios';
import { API_BASE_URL } from './constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    // Check if window is defined (i.e., we're on the client side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// This is a temporary interceptor to handle mock API responses for PATCH requests
// In a real application, the API would handle this logic.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (config.method === 'patch' && config.baseURL === '/api' && config.url?.startsWith('/devices')) {
      try {
        const url = new URL(config.url, 'http://localhost');
        const id = url.pathname.split('/')[2];
        const data = JSON.parse(config.data);
        
        const response = await fetch(`/api/devices/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(config.headers as Record<string, string>),
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const responseData = await response.json();
        
        return {
            data: responseData,
            status: 200,
            statusText: 'OK',
            headers: response.headers,
            config: config,
            request: config,
        };
      } catch (fetchError) {
         return Promise.reject(fetchError);
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;
