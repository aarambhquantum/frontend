import UploadIcon from "@assets/img/upload.svg?react";
import DragAndDrop from "@atoms/DragAndDrop";
import { useState } from "react";
import styles from "./videoUpload.module.scss";

const VideoUpload = () => {
  const [video, setVideo] = useState<File[]>([]);

  return (
    <div className={styles.container}>
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
  );
};

export default VideoUpload;
