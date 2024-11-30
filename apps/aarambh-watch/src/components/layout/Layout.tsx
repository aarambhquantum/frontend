import { Outlet } from "react-router-dom";
import styles from './layout.module.scss';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <main className={`${styles.layout__main} main-override`}>
        <Outlet />
      </main>
    </div>
  )
};

export default Layout;