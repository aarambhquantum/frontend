import { initiateVideoUpload } from "@apis/videoUpload";
import UploadIcon from "@assets/img/upload.svg?react";
import DragAndDrop from "@atoms/DragAndDrop";
import Typography from "@atoms/typography/Typography";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { Button } from "@mui/material";
import { isNonEmptyArray } from "@shared/utils/arrayUtils";
import { convertFileToUint8Array } from "@shared/utils/fileUtils";
import { InitiateVideoUploadResponse } from "@types/videoUpload";
import { useEffect, useRef, useState } from "react";
import styles from "./videoUpload.module.scss";

const VideoUpload = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const messageRef = useRef<HTMLParagraphElement | null>(null)
  const [loaded, setLoaded] = useState(false);
  console.log("🚀 ~ VideoUpload ~ loaded:", loaded)
  const [video, setVideo] = useState<File[]>([]);
  const [uploadId, setUploadId] = useState<string | null>(null);

  useEffect(() => {
    if (loaded) {
      transcode();
    }
  }, [loaded]);

  const handleUpload = async () => {
    await load();
    const response: InitiateVideoUploadResponse = await initiateVideoUpload({
      filename: "sample_video_from_client",
    });
    setUploadId(response?.upload_id);
  };

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
      console.log("🚀 ~ ffmpeg.on ~ message:", message)
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const videoToTranscode: Uint8Array = await convertFileToUint8Array(
      video?.[0]
    );
    const dir = "/testing";
    await ffmpeg.writeFile("input.webm", videoToTranscode);
    await ffmpeg.createDir(dir);
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
    videoFiles = videoFiles?.filter((file) => file?.name?.includes("output"));
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
