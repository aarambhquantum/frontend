import { UPLOAD_CONTROLLER_API_ENDPOINTS } from "@constants/apiEndPoints";
import type { CompleteVideoUploadRequest, GetPresignedUrlRequest, GetPresignedUrlResponse, InitiateVideoUploadRequest } from "@types/videoUpload";
import api from "./apiClient";

const { FULL_VIDEO_UPLOAD, INITIATE_VIDEO_UPLOAD, GET_PRESIGNED_URL_FOR_PARTS, COMPLETE_VIDEO_UPLOAD } = UPLOAD_CONTROLLER_API_ENDPOINTS;

export const initiateVideoUpload = async (payload: InitiateVideoUploadRequest) => {
  const url = INITIATE_VIDEO_UPLOAD;
  const response = await api.postData(url, payload);
  return response?.data;
}

export const getPresignedUrl = async (payload: GetPresignedUrlRequest) => {
  const url = GET_PRESIGNED_URL_FOR_PARTS;
  const response = await api.postData(url, payload);
  return response?.data;
}

export const completeVideoUpload = async (payload: CompleteVideoUploadRequest) => {
  const url = COMPLETE_VIDEO_UPLOAD;
  const response = await api.postData(url, payload);
  return response;
}

//todo
export const uploadFullVideo = async (payload: GetPresignedUrlRequest) => {
  const url = FULL_VIDEO_UPLOAD;
  const response = await api.postData(url, payload);
  return response?.data;
}