import React, { FC } from "react";
import "../../styles/Loader.css";

const Loader: FC = () => {
  return (
    <div className="loading-container">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default Loader;
