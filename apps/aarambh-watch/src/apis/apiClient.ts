/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiClient, get, post, put, patch, deleteRequest } from '@repo/shared/api'; 
import { config } from './config';
import { AxiosRequestConfig } from 'axios';

// Create an instance of the API client
const apiClient = createApiClient(config.apiBaseUrl);

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Add a request interceptor to include the Bearer token
apiClient.interceptors.request.use(
  (request) => {
    const token = getAuthToken();
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  getData(endpoint: string, config?: AxiosRequestConfig) {
    get(apiClient, endpoint, config);
  },
  postData(endpoint: string, data: any, config?: AxiosRequestConfig) {
    post(apiClient, endpoint, data, config);
  },
  putData(endpoint: string, data: any, config?: AxiosRequestConfig) {
    put(apiClient, endpoint, data, config);
  },
  patchData(endpoint: string, data: any, config?: AxiosRequestConfig) {
    patch(apiClient, endpoint, data, config);
  },
  deleteData(endpoint: string, config?: AxiosRequestConfig) {
    deleteRequest(apiClient, endpoint, config);
  },
}

export default api;
