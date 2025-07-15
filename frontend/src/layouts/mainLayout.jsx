import React from "react";
import Main from "../components/main";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";

const MainLayout = ({ children }) => (
  <div className={styles.layout}>
    {/* <NavBar /> */}
    <Main>{children}</Main>
    <Footer />
  </div>
);

export default MainLayout;