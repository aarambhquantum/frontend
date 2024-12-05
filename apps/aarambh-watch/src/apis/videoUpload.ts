import { COMPLETE_VIDEO_UPLOAD, GET_PRESIGNED_URL_FOR_PARTS, INITIATE_VIDEO_UPLOAD } from "@constants/apiEndPoints";
import type { CompleteVideoUploadRequest, GetPresignedUrlRequest, InitiateVideoUploadRequest } from "@types/videoUpload";
import api from "./apiClient";

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