/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiClient, deleteRequest, get, patch, post, put } from '@repo/shared/api';
import { AxiosRequestConfig } from 'axios';
import { config } from './config';

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
    return get(apiClient, endpoint, config);
  },
  postData(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return post(apiClient, endpoint, data, config);
  },
  putData(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return put(apiClient, endpoint, data, config);
  },
  patchData(endpoint: string, data: any, config?: AxiosRequestConfig) {
    return patch(apiClient, endpoint, data, config);
  },
  deleteData(endpoint: string, config?: AxiosRequestConfig) {
    return deleteRequest(apiClient, endpoint, config);
  },
}

export default api;
