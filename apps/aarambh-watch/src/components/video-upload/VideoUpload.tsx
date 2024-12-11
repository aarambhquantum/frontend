import { getPresignedUrl, uploadFileToPresignedURL } from "@apis/videoUpload";
import UploadIcon from "@assets/img/upload.svg?react";
import DragAndDrop from "@atoms/DragAndDrop";
import Typography from "@atoms/typography/Typography";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { Button } from "@mui/material";
import { isNonEmptyArray } from "@shared/utils/arrayUtils";
import { convertVideoIntoHLSPlaylist } from "@shared/utils/ffmpeg";
import {
  convertFileDataIntoUint8Array,
  getSizeInMBForUint8Array
} from "@shared/utils/fileUtils";
import { useRef, useState } from "react";
import styles from "./videoUpload.module.scss";

const VideoUpload = () => {
  const dir = "/videos";

  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  console.log("🚀 ~ VideoUpload ~ loaded:", loaded);
  const [video, setVideo] = useState<File[]>([]);
  const filename = "sample_video_4_10mb";

  const handleUpload = async () => {
    if (!loaded) await load();

    const videoParts: {name: string, dir: boolean}[] = await convertVideoIntoHLSPlaylist(
      ffmpegRef,
      video?.[0],
      20
    );

    if (videoParts?.length === 0) {
      console.error("NO VIDEO FILE FOUND!");
      return;
    }

    const presignedUrls: string[] = await getPresignedUrl({
      files: videoParts?.map((item) => item?.name),
      video_name: filename
    });

    for (let i=0;i<videoParts?.length;i++) {
      const ffmpeg = ffmpegRef.current;
      const videoObj = videoParts[i];
      const file = await ffmpeg.readFile(`${dir}/${videoObj?.name}`);
      const sizeInMB = getSizeInMBForUint8Array(
        convertFileDataIntoUint8Array(file)
      );
      console.log("🚀 ~ UPLOAD STARTED:", videoObj?.name, sizeInMB);
      await uploadFileToPresignedURL(
        file as unknown as File,
        presignedUrls[i],
        file?.name?.includes("m3u8") ? "application/x-mpegURL" : "video/MP2T"
      );
      console.log("🚀 ~ UPLOAD ENDED:", videoObj?.name);
      ffmpegRef.current.deleteFile(`/videos/${videoObj.name}`);
    }
  };

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
      console.log("🚀 ~ ffmpeg.on ~ message:", message);
    });

    // Bypass CORS issues with toBlobURL
    const coreURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.js`,
      "text/javascript"
    );
    const wasmURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.wasm`,
      "application/wasm"
    );
    const workerURL = await toBlobURL(
      `${baseURL}/ffmpeg-core.worker.js`,
      "text/javascript"
    );

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
