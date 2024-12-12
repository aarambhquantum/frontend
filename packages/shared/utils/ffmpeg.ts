import { convertFileToUint8Array } from "./fileUtils";

export const convertVideoIntoHLSPlaylist = async (
  ffmpegRef: React.MutableRefObject<FFmpeg>,
  file: File,
  duration: number
) => {
  const dir = "/videos";
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

/**
 * Converts a video chunk to a .ts file using FFmpeg.
 *
 * @param {ArrayBuffer} chunkBuffer - The video chunk as an ArrayBuffer.
 * @param {string} outputFileName - The desired name of the output .ts file.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the .ts file as a Uint8Array.
 */
export async function convertChunkToTs(
  ffmpegRef: React.MutableRefObject<FFmpeg>,
  chunkBuffer: ArrayBuffer,
  partNumber: number
) {
  const ffmpeg = ffmpegRef.current;

  // Write the chunk to FFmpeg's virtual file system
  const inputFileName = "input.mp4";
  ffmpeg.writeFile(inputFileName, new Uint8Array(chunkBuffer));
  console.log("🚀 ~ segment written on ffmpeg:", inputFileName);

  // Run the FFmpeg command to convert to .ts format
  await ffmpeg.exec([
    "-i",
    inputFileName, // Input file
    "-c:v",
    "libx264", // Video codec
    "-preset",
    "fast", // Use a faster preset for conversion
    "-f",
    "mpegts", // Output format as MPEG-TS
    `video_segment_${partNumber}`, // Output .ts file
  ]);
  console.log("🚀 ~ ts file created by ffmpeg:", inputFileName);

  // Read the converted .ts file from FFmpeg's virtual file system
  const tsFile = ffmpeg.readFile(`video_segment_${partNumber}`);

  // Clean up virtual file system
  // ffmpeg.uinputFileName

  return tsFile;
}

/**
 * Updates or creates an M3U8 playlist file with the new .ts segment, dynamically calculating the segment duration.
 *
 * @param {string} segmentFileName - The name of the .ts segment file.
 * @param {string} playlistFileName - The name of the M3U8 playlist file.
 * @returns {Promise<Uint8Array>} - A promise that resolves to the updated M3U8 file as a Uint8Array.
 */
export async function updateM3U8File(
  ffmpegRef: React.MutableRefObject<FFmpeg>,
  segmentFileName: string,
  playlistFileName: string
) {
  const ffmpeg = ffmpegRef.current;

  let playlistContent = "";

  // Check if the playlist file already exists
  try {
    playlistContent = new TextDecoder().decode(
      ffmpeg.FS("readFile", playlistFileName)
    );
  } catch (e) {
    // File doesn't exist, create a new one
    playlistContent =
      "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n#EXT-X-MEDIA-SEQUENCE:0\n";
  }

  // Use FFmpeg to get the duration of the segment
  const durationOutput = await ffmpeg.run(
    "-i",
    segmentFileName,
    "-hide_banner"
  );
  const durationMatch = durationOutput.match(
    /Duration:\s(\d+):(\d+):(\d+\.\d+)/
  );

  if (!durationMatch) {
    throw new Error("Could not determine duration of the segment.");
  }

  const hours = parseFloat(durationMatch[1]);
  const minutes = parseFloat(durationMatch[2]);
  const seconds = parseFloat(durationMatch[3]);
  const duration = hours * 3600 + minutes * 60 + seconds;

  // Add the new segment to the playlist
  playlistContent += `#EXTINF:${duration.toFixed(3)},\n${segmentFileName}\n`;

  // Write the updated playlist back to the virtual file system
  ffmpeg.FS(
    "writeFile",
    playlistFileName,
    new TextEncoder().encode(playlistContent)
  );

  // Return the updated playlist as a Uint8Array
  return ffmpeg.FS("readFile", playlistFileName);
}
