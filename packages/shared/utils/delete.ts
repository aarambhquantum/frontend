// const handleUpload = async () => {
//   if (!loaded) await load();

//   const videoParts: {name: string, dir: boolean}[] = await convertVideoIntoHLSPlaylist(
//     ffmpegRef,
//     video?.[0],
//     20
//   );

//   if (videoParts?.length === 0) {
//     console.error("NO VIDEO FILE FOUND!");
//     return;
//   }

//   const presignedUrls: string[] = await getPresignedUrl({
//     files: videoParts?.map((item) => item?.name),
//     video_name: filename
//   });

//   for (let i=0;i<videoParts?.length;i++) {
//     const ffmpeg = ffmpegRef.current;
//     const videoObj = videoParts[i];
//     const file = await ffmpeg.readFile(`${dir}/${videoObj?.name}`);
//     const sizeInMB = getSizeInMBForUint8Array(
//       convertFileDataIntoUint8Array(file)
//     );
//     console.log("🚀 ~ UPLOAD STARTED:", videoObj?.name, sizeInMB);
//     await uploadFileToPresignedURL(
//       file as unknown as File,
//       presignedUrls[i],
//       file?.name?.includes("m3u8") ? "application/x-mpegURL" : "video/MP2T"
//     );
//     console.log("🚀 ~ UPLOAD ENDED:", videoObj?.name);
//     ffmpegRef.current.deleteFile(`/videos/${videoObj.name}`);
//   }
// };