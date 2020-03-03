import React from "react";

const LoadingScreen = props => {
  return (
    <div className="overlay">
      <i className="fa fa-refresh fa-spin"></i>
      <span>
        <h1>{props.text}</h1>
      </span>
    </div>
  );
};

export default LoadingScreen;
