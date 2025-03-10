
import React from "react";

const Loader = ({ size = "medium", text = "Loading..." }) => {
  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader"></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;
