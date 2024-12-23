export interface InitiateVideoUploadRequest {
  file_name: string;
  content_type: string;
  video_data : VideoData | null;
}

export interface InitiateVideoUploadResponse {
  upload_id: string;
  file_name: string;
  expiry_date: string;
}

export interface GetPresignedUrlRequest {
  file_name: string;
  upload_id: string;
  part_count: number;
  content_length: number;
}

export interface GetPresignedUrlResponse {
  url: string;
}

export interface CompleteVideoUploadRequest {
  file_name: string;
  upload_id: string | null;
  e_tags: ETag[] | null;
}
export interface ETag{
  e_tag: string,
  part_number: number
}
export interface VideoData {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  upload_date: string;
  status: string;
  user_id_of_owner: string;
  category_id: string;
  tags: string;
  view_count: string;
  like_count: string;
  dislike_count: string;
  comment_count: string;
  duration: string;
  upload_type: string;
  upload_size: string;
}
export interface ApplicationResponse {
  message: string;
  exception_message: string;
  exception_occurred: string;
  data: any;
  internal_status_code: string;
}
