export interface InitiateVideoUploadRequest {
  filename: string;
}

export interface InitiateVideoUploadResponse {
  upload_id: string;
}

export interface GetPresignedUrlRequest {
  filename: string;
  upload_id: string;
  part_count: number;
}

export interface CompleteVideoUploadRequest {
  filename: string;
  upload_id: string;
  etags: {ETag: string, PartNumber: number}[];
}