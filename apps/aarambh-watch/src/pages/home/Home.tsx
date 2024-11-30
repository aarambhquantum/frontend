import { useState } from "react";
import styles from "./home.module.scss";
import DragAndDrop from "@atoms/DragAndDrop";
import { Button } from "@mui/material";

const Home = () => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className={styles.page}>
      <DragAndDrop files={files} setFiles={setFiles} />
      <Button>Start</Button>
    </div>
  );
};

export default Home;
