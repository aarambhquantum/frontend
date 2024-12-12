import { getPresignedUrl, uploadFileToPresignedURL } from "@apis/videoUpload";
import UploadIcon from "@assets/img/upload.svg?react";
import DragAndDrop from "@atoms/DragAndDrop";
import Typography from "@atoms/typography/Typography";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { Button } from "@mui/material";
import { isNonEmptyArray } from "@shared/utils/arrayUtils";
import { convertChunkToTs, updateM3U8File } from "@shared/utils/ffmpeg";
import {
  readFileChunk
} from "@shared/utils/fileUtils";
import { useRef, useState } from "react";
import styles from "./videoUpload.module.scss";

const VideoUpload = () => {
  const dir = "/videos";

  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [videos, setVideos] = useState<File[]>([]);
  const filename = "sample_video_stream_10mb";

  const handleUpload = async () => {
    if (!loaded) await load();

    const ffmpeg = ffmpegRef?.current;
    const video = videos?.[0];
    console.log("🚀 ~ handleUpload ~ video:", video)

    if (!video) {
      throw new Error("Could not find the video.");
    }

    const totalChunks = Math.ceil(video?.size / (10 * 1024 * 1024));
    const chunksFileName = Array.from({ length: totalChunks }, (_, i) => `video_segment_${i+1}.ts`);
    chunksFileName.push('playlist.m3u8');

    const presignedUrls: string[] = await getPresignedUrl({ files: chunksFileName, video_name: filename });

    for (let i = 0;i< totalChunks;i++) {
      const chunk = await readFileChunk(video, 1024 * 1024, 1024 * 1024 * i);
      const tsFile = await convertChunkToTs(ffmpegRef, chunk, i+1);
      
      await updateM3U8File(ffmpegRef, chunksFileName[i], 'playlist.m3u8');
      await uploadFileToPresignedURL(tsFile, presignedUrls[i], 'video/MP2T');
    }

    const playlistFile = await ffmpeg.readFile('playlist.m3u8');
    await uploadFileToPresignedURL(playlistFile, 'playlist.m3u8', 'application/x-mpegURL');

    console.log("UPLOAD SUCCESS");
  }

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
          files={videos}
          setFiles={setVideos}
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
        disabled={Boolean(!isNonEmptyArray(videos))}
        onClick={handleUpload}
      >
        Upload
      </Button>

      <Typography>{messageRef.current?.innerHTML}</Typography>
    </div>
  );
};

export default VideoUpload;
