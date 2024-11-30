import styles from "@atoms/DragAndDrop/dragAndDrop.module.scss";
import Typography from "@atoms/typography/Typography";
import { BODY_1 } from "@shared/constants/material-ui";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type DragAndDropProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

const DragAndDrop = ({ files, setFiles }: DragAndDropProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className={styles.container}>
      <input {...getInputProps()} className={styles.container__input} />
      <Typography variant={BODY_1} classes={{ root: styles.container__text }}>
        Drag & drop some files here, or click to select files
      </Typography>
    </div>
  );
};

export default DragAndDrop;
