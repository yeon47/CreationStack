import React from "react";
import Main from "../components/main";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import { NavbarCreator } from "../components/NavbarCreator";

const MainLayout = ({ children }) => (
  <div className={styles.layout}>
    <NavbarCreator />
    <Main>{children}</Main>
    <Footer />
  </div>
);

export default MainLayout;