import {
  COMPLETE_VIDEO_UPLOAD,
  GET_PRESIGNED_URL_FOR_PARTS,
  INITIATE_VIDEO_UPLOAD,
} from "@constants/apiEndPoints";
import type {
  CompleteVideoUploadRequest,
  GetPresignedUrlRequest,
  InitiateVideoUploadRequest,
} from "@types/videoUpload";
import api from "./apiClient";
import axios from "axios";

export const initiateVideoUpload = async (
  payload: InitiateVideoUploadRequest
) => {
  const url = INITIATE_VIDEO_UPLOAD;
  const response = await api.postData(url, payload);
  return response?.data;
};

export const getPresignedUrl = async (payload: GetPresignedUrlRequest) => {
  const url = GET_PRESIGNED_URL_FOR_PARTS;
  const response = await api.postData(url, payload);
  return response?.data;
};

export const completeVideoUpload = async (
  payload: CompleteVideoUploadRequest
) => {
  const url = COMPLETE_VIDEO_UPLOAD;
  const response = await api.postData(url, payload);
  return response;
};

export const uploadFileToPresignedURL = async (
  file: File,
  presignedUrl: string,
  format: string
) => {
  try {
    const response = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": format,
      },
    });

    console.log("Upload successful!", response);
    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    return error;
  }
};
