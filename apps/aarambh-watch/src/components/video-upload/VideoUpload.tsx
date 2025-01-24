import {
  completeVideoUpload,
  getPresignedUrl,
  initiateVideoUpload,
} from "@apis/videoUpload";
import UploadIcon from "@assets/img/upload.svg?react";
import DragAndDrop from "@atoms/DragAndDrop";
import Typography from "@atoms/typography/Typography";
import { Button } from "@mui/material";
import { isNonEmptyArray } from "@shared/utils/arrayUtils";
import { GetPresignedUrlResponse, InitiateVideoUploadResponse } from "@types/videoUpload";
import { useRef, useState, useEffect } from "react";
import styles from "./videoUpload.module.scss";
import { VideoData, ApplicationResponse, InitiateVideoUploadRequest, ETag } from "@types/videoUpload"

const VideoUpload = () => {
  useEffect(() => {
    localStorage.setItem("etagList", JSON.stringify([]));
  }, []);
  // const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  console.log("🚀 ~ VideoUpload ~ loaded:", loaded);
  const [video, setVideo] = useState<File[]>([]);
  
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [uniqueViewId, setUniqueViewId] = useState<string | null>(null);
  const [eTagListLatest, setETagListLatest] = useState<ETag[] | null>([]);

  const mockVideoData: VideoData = {
    id: "mock-video-id",
    title: "Mock Video Title",
    description: "Mock Video Description",
    video_url: "https://example.com/mock-video.mp4",
    thumbnail_url: "https://example.com/mock-video-thumbnail.jpg",
    upload_date: "",
    status: "ACTIVE",
    user_id_of_owner: "mock-user-id",
    category_id: "mock-category-id",
    tags: "mock-tag1, mock-tag2",
    view_count: "1",
    like_count: "1",
    dislike_count: "1",
    comment_count: "",
    duration: "01:00:00",
    upload_type: "FILE",
    upload_size: "100MB",
  };

  const initiateVideoUploadRequest: InitiateVideoUploadRequest = {
    file_name: "sample_video_from_client.mp4",
    content_type: "application/octet-stream",
    video_data: mockVideoData
  }

const handleInitiateVideoUpload = async (request: InitiateVideoUploadRequest) => {
  try {
    const response: InitiateVideoUploadResponse = await initiateVideoUpload(request);
    setUploadId(response?.upload_id);
    setUniqueViewId(response?.unique_view_id);
    console.log("Initiate upload response:", response);
    return response;
  } catch (error) {
    console.error("Error during initiate upload:", error);
  }
};

/**
 * Gets a presigned URL for a part of a video that we can upload to S3.
 *
 * @param {string} fileName The name of the file that we're uploading.
 * @param {string} uploadId The ID of the upload that we're a part of.
 * @param {number} partNumber The number of the part that we're uploading.
 * @param {number} contentLength The length of the part that we're uploading.
 * @returns {Promise<GetPresignedUrlResponse>} A promise that resolves to the
 * pre-signed URL that we can use to upload the part to S3.
 */
const getPresignedUrlForPart = async (
  fileName: string,
  uploadId: string,
  partNumber: number,
  contentLength: number,
  uniqueViewId: string
): Promise<GetPresignedUrlResponse> => {
  try {
    // Make a request to the server to get a presigned URL for the part
    // that we're uploading.
    const preSignedUrl: GetPresignedUrlResponse = await getPresignedUrl({
      file_name: fileName,
      upload_id: uploadId,
      part_count: partNumber,
      content_length: contentLength,
      unique_view_id: uniqueViewId
    });

    // Log the presigned URL so that we can see it in the console.
    console.log(`Presigned URL for part ${partNumber}:`, preSignedUrl);

    // Return the presigned URL so that we can use it to upload the part
    // to S3.
    return preSignedUrl;
  } catch (error) {
    // If there's an error, log it so that we can see what went wrong.
    console.error("Error during get pre signed URL:", error);
    return Promise.reject(error);
  }
};

const uploadVideoPart = async (
  chunk: Blob,
  preSignedUrl: GetPresignedUrlResponse,
  partNumber : number
) => {
  try {
    const response = await fetch(preSignedUrl?.url, {
      method: "PUT",
      body: chunk,
    });
    if (!response.ok) {
      throw new Error(`Error uploading to S3: ${response.status}`);
    }
    console.log(response);
    const etagString = response.headers.get("ETag")?.replace(/"/g, '') || ''; 
    const etag : ETag = {
      e_tag: etagString,
      part_number: partNumber,
    };
    const etags = JSON.parse(localStorage.getItem("etagList") || "[]");
    etags.push(etag);
    localStorage.setItem("etagList", JSON.stringify(etags));
    setETagListLatest((prev) => {
      const updatedEtags = [...(prev || []), etag];
      return updatedEtags;
    });
  } catch (error) {
    console.error("Error during upload video part:", error);
  }
};

const handleUpload = async () => {
  try {
    const response = await handleInitiateVideoUpload(initiateVideoUploadRequest);

    if (!response?.upload_id) {
      throw new Error("Upload id is empty");
    }

    setUploadId(response.upload_id); // Set the uploadId state
    setUniqueViewId(response.unique_view_id); // Set the uniqueViewId state
    localStorage.setItem("etagList", JSON.stringify([]));
    const etagList = localStorage.getItem("etagList");
    const etags = etagList ? JSON.parse(etagList) : [];

    if (video?.[0]) {
      console.log("Video file:", video[0]);

      const chunkSize = 5 * 1024 * 1024; // 5MB
      const fileSize = video[0].size;
      const totalChunks = Math.ceil(fileSize / chunkSize);

      const videoParts = [];
      const uploadPromises = [];

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const chunk = video[0].slice(start, end);
        const reader = new FileReader();

        const uploadPromise = new Promise<void>((resolve, reject) => {
          reader.onload = async (event) => {
            const videoObj = {
              name: `video_part_${i + 1}`,
              data: event.target?.result,
            };

            videoParts.push(videoObj);

            try {
              const preSignedUrl = await getPresignedUrlForPart(
                "sample_video_from_client.mp4",
                response.upload_id,
                i + 1,
                chunk.size,
                response.unique_view_id
              );

              await uploadVideoPart(chunk, preSignedUrl, i+1);
              resolve();
            } catch (error) {
              reject(error);
            }
          };

          reader.onerror = (error) => reject(error);
        });

        reader.readAsArrayBuffer(chunk);
        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);
      // const eTagArray: ETag[] = [];
      const updatedETags = JSON.parse(localStorage.getItem("etagList") || "[]");
      // updatedETags.forEach((tag: string, index: number) => {
      //   const etag = {
      //     e_tag: tag,
      //     part_number: index + 1,
      //   };
      //   eTagArray.push(etag);
      // });

      const finalResponse = await completeVideoUpload({
        file_name: "sample_video_from_client.mp4",
        upload_id: response.upload_id, // Use the response upload_id
        e_tags: updatedETags,
        unique_view_id: response.unique_view_id,
      });

      console.log("Complete upload response:", finalResponse);
    }
  } catch (error) {
    console.error("Error during upload:", error);
  }
};

  return (
    <div className={styles.upload}>
      <div className={styles.upload__container}>
        <DragAndDrop
          files={video}
          setFiles={setVideo}
          acceptedFileTypes={{
            "video/*": [],
          }}
          className={styles.container__dragAndDrop}
          maxFiles={1}
          uploadIcon={<UploadIcon />}
        />
      </div>

      <Button
        variant="contained"
        classes={{ root: styles.upload__btn }}
        disabled={Boolean(!isNonEmptyArray(video))}
        onClick={handleUpload}
      >
        Upload
      </Button>

      <Typography>{messageRef.current?.innerHTML}</Typography>
    </div>
  );
};

export default VideoUpload;
