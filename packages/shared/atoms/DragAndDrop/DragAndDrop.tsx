import styles from "@atoms/DragAndDrop/dragAndDrop.module.scss";
import Typography from "@atoms/typography/Typography";
import { BODY_1, CAPTION, COLOR_RED } from "@shared/constants/material-ui";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type DragAndDropProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  acceptedFileTypes: { [key: string]: string[] };
  uploadIcon: React.ReactNode;
  maxFiles?: number;
  className?: string;
};

const DragAndDrop = ({
  files,
  setFiles,
  acceptedFileTypes,
  uploadIcon,
  maxFiles = 5,
  className = "",
}: DragAndDropProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      ...acceptedFileTypes,
    },
    maxFiles,
  });

  return (
    <div {...getRootProps()} className={`${styles.container} ${className}`}>
      <input {...getInputProps()} className={styles.container__input} />
      <div className={styles.container__uploadIcon}>{uploadIcon}</div>
      <Typography variant={BODY_1} className={styles.container__text}>
        Drag & drop some files here, <br /> or{" "}
        <span className={styles.container__highlight}>browse</span> to select
        files
      </Typography>
      <Typography
        variant={CAPTION}
        color={COLOR_RED}
        className={styles.container__helperText}
      >{`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""}.`}</Typography>
    </div>
  );
};

export default DragAndDrop;
