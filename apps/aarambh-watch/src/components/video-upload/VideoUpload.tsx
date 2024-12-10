import {
  completeVideoUpload,
  getPresignedUrl,
  initiateVideoUpload,
} from "@apis/videoUpload";
import UploadIcon from "@assets/img/upload.svg?react";
import DragAndDrop from "@atoms/DragAndDrop";
import Typography from "@atoms/typography/Typography";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { Button } from "@mui/material";
import { isNonEmptyArray } from "@shared/utils/arrayUtils";
import {
  convertFileDataIntoUint8Array,
  convertFileToUint8Array,
  getSizeInMBForUint8Array
} from "@shared/utils/fileUtils";
import { InitiateVideoUploadResponse } from "@types/videoUpload";
import axios from "axios";
import { useRef, useState } from "react";
import styles from "./videoUpload.module.scss";

const VideoUpload = () => {
  const dir = "/testing";

  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  console.log("🚀 ~ VideoUpload ~ loaded:", loaded);
  const [video, setVideo] = useState<File[]>([]);
  const [uploadId, setUploadId] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!loaded) await load();

    const filesize: string = video?.[0]?.size;

    const response: InitiateVideoUploadResponse = await initiateVideoUpload({
      filename: "sample_video_from_client",
    });
    setUploadId(response?.upload_id);

    const videoParts: unknown[] = await transcode();

    if (videoParts?.length === 0) {
      console.error("NO VIDEO FILE FOUND!");
      return;
    }

    const presignedUrls: string[] = await getPresignedUrl({
      filename: "sample_video_from_client",
      upload_id: response?.upload_id,
      part_count: videoParts?.length,
    });

    const etags = [];
    const promises: Promise<unknown>[] = videoParts?.map(
      async (videoObj, index) => {
        const ffmpeg = ffmpegRef.current;
        console.log("🚀 ~ READING:", videoObj);
        const file = await ffmpeg.readFile(`${dir}/${videoObj?.name}`);
        const sizeInMB = getSizeInMBForUint8Array(
          convertFileDataIntoUint8Array(file)
        );
        console.log("🚀 ~ file, sizeInMB:", videoObj?.name, sizeInMB);
        if (sizeInMB < 5 && index !== videoParts?.length - 1) {
          console.log(
            "🚀 ~ FILE CHUNK SIZE TOO SMALL (should be atleast 5MB):",
            `${sizeInMB.toFixed(2)} MB`
          );
        }
        console.log("🚀 ~ UPLOAD STARTED:", videoObj);
        const data = await uploadVideo(file, presignedUrls[index]);
        console.log("🚀 ~ UPLOAD ENDED:", videoObj);

        etags.push({
          ETag: data?.headers?.etag,
          PartNumber: index + 1,
        });
      }
    );

    await Promise.all(promises);
    const finalResponse = await completeVideoUpload({
      filename: "sample_video_from_client",
      upload_id: response?.upload_id as string,
      etags,
    });
    console.log("🚀 ~ handleUpload ~ response?.data:", finalResponse?.data);
  };

  const uploadVideo = async (file: File, presignedUrl: string) => {
    try {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": "video/mp4", // Ensure you set the correct content type
        },
      });

      console.log("Upload successful!", response);
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // const load = async () => {
  //   const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
  //   const ffmpeg = ffmpegRef.current;
  //   ffmpeg.on("log", ({ message }) => {
  //     if (messageRef.current) messageRef.current.innerHTML = message;
  //     console.log("🚀 ~ ffmpeg.on ~ message:", message);
  //   });
  //   // toBlobURL is used to bypass CORS issue, urls with the same
  //   // domain can be used directly.
  //   await ffmpeg.load({
  //     coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
  //     wasmURL: await toBlobURL(
  //       `${baseURL}/ffmpeg-core.wasm`,
  //       "application/wasm"
  //     ),
  //     workerURL: await toBlobURL(
  //       `${baseURL}/ffmpeg-core.worker.js`,
  //       "text/javascript"
  //     ),
  //   });
  //   setLoaded(true);
  // };
  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
  
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
      console.log("🚀 ~ ffmpeg.on ~ message:", message);
    });
  
    // Bypass CORS issues with toBlobURL
    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");
    const workerURL = await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript");
  
    // Load FFmpeg with adjusted settings
    await ffmpeg.load({
      coreURL,
      wasmURL,
      workerURL,
      // Predefine total memory without passing callbacks
      totalMemory: 512 * 1024 * 1024, // 512MB for larger video processing
    });
  
    console.log("FFmpeg loaded successfully");
    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const videoToTranscode: Uint8Array = await convertFileToUint8Array(
      video?.[0]
    );
    await ffmpeg.writeFile("input.webm", videoToTranscode);
    var directoryPromise = await ffmpeg.createDir(dir);
    console.log(directoryPromise);
    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-f",
      "segment",
      "-segment_time",
      "10",
      "-g",
      "9",
      "-sc_threshold",
      "0",
      "-force_key_frames",
      "expr:gte(t,n_forced*9)",
      "-reset_timestamps",
      "1",
      "-map",
      "0",
      `${dir}/output_%d.mp4`,
    ]);

    let videoFiles = await ffmpeg.listDir(dir);
    console.log("🚀 ~ ALL FILE:", videoFiles);
    videoFiles = videoFiles?.filter((file) => file?.name?.includes("output"));
    console.log("🚀 ~ FILTERED FILE:", videoFiles);

    return videoFiles;
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
