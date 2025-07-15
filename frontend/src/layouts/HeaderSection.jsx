import React from "react";
import { NavbarCreator } from "../components/NavbarCreator";

export const HeaderSection = () => {
  return (
    <div className="header-section">
      <NavbarCreator className="navbar-creator-instance" />
    </div>
  );
};
