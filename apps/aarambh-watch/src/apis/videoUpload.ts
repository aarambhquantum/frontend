import { INITIATE_VIDEO_UPLOAD } from "@constants/apiEndPoints";
import type { InitiateVideoUploadRequest } from "@types/videoUpload";
import api from "./apiClient";

export const initiateVideoUpload = async (payload: InitiateVideoUploadRequest) => {
  const url = INITIATE_VIDEO_UPLOAD;
  const response = await api.postData(url, payload);
  return response?.data;
}