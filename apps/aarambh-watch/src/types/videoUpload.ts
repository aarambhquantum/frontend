export interface InitiateVideoUploadRequest {
  filename: string;
}

export interface InitiateVideoUploadResponse {
  upload_id: string;
}

export interface GetPresignedUrlRequest {
  files: string[];
  video_name: string;
}

export interface CompleteVideoUploadRequest {
  filename: string;
  upload_id: string;
  etags: {ETag: string, PartNumber: number}[];
}