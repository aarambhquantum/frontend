/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create a function to create an API client with baseUrl
export const createApiClient = (baseUrl: string): AxiosInstance => {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      // Add other headers here if needed
    },
  });
};

// GET Request
export const get = async (client: AxiosInstance, endpoint: string, config?: AxiosRequestConfig) => {
  try {
    const response = await client.get(endpoint, config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to GET data: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// POST Request
export const post = async (client: AxiosInstance, endpoint: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await client.post(endpoint, data, config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to POST data: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// PUT Request
export const put = async (client: AxiosInstance, endpoint: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await client.put(endpoint, data, config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to PUT data: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// PATCH Request
export const patch = async (client: AxiosInstance, endpoint: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await client.patch(endpoint, data, config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to PATCH data: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// DELETE Request
export const deleteRequest = async (client: AxiosInstance, endpoint: string, config?: AxiosRequestConfig) => {
  try {
    const response = await client.delete(endpoint, config);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to DELETE data: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

// Example function to get data
export const fetchData = async (client: AxiosInstance, endpoint: string) => {
  return get(client, endpoint);
};

