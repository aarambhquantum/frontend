export const UPLOAD_CONTROLLER_API_ENDPOINTS = {
  FULL_VIDEO_UPLOAD: 'upload/upload-full',
  INITIATE_VIDEO_UPLOAD: 'upload-multi-part/initiate-upload',
  GET_PRESIGNED_URL_FOR_PARTS: 'upload-multi-part/generate-pre-signed-url',
  COMPLETE_VIDEO_UPLOAD: 'upload-multi-part/complete',
} as const;

