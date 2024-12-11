import { convertFileToUint8Array } from "./fileUtils";

export const convertVideoIntoHLSPlaylist = async (
  ffmpegRef: React.MutableRefObject<FFmpeg>,
  file: File,
  duration: number
) => {
  const dir = '/videos';
  const ffmpeg = ffmpegRef.current;
  const videoToTranscode: Uint8Array = await convertFileToUint8Array(file);
  await ffmpeg.writeFile("input.mp4", videoToTranscode);
  await ffmpeg.createDir(dir);
  await ffmpeg.exec([
    "-i",
    "input.mp4",
    "-preset",
    "fast",
    "-f",
    "hls", // Output format
    "-hls_time",
    `${duration}`, // Segment duration in seconds
    "-hls_playlist_type",
    "vod", // Video-on-demand mode
    "-hls_segment_filename",
    `${dir}/video_segment_%03d.ts`, // Naming for segments
    `${dir}/video_output.m3u8`,
  ]);

  let videoFiles = await ffmpeg.listDir(dir);
  console.log("🚀 ~ ALL FILE:", videoFiles);
  
  videoFiles = videoFiles?.filter((file) => file?.name?.includes("video"));
  console.log("🚀 ~ FILTERED FILE:", videoFiles);

  return videoFiles;
};
