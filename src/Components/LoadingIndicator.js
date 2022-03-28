import React from "react";
import "./styles/LoadingIndicator.css";
function LoadingIndicator() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default LoadingIndicator;
