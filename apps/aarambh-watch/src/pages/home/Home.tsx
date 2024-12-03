import VideoUpload from "@components/video-upload";
import styles from "./home.module.scss";

const Home = () => {
  return (
    <div className={styles.page}>
      <VideoUpload />
    </div>
  );
};

export default Home;
