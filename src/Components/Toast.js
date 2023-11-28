import React, { useEffect } from "react";

const Toast = ({ message, setShowToast, timer, isError }) => {
  useEffect(() => {
    console.log("triggered");
    setTimeout(() => {
      setShowToast(false);
    }, timer);
  });

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
      <div
        className="toast show "
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div
          className={
            isError ? "alert alert-danger m-0" : "alert alert-success m-0"
          }
          role="alert"
        >
          {message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
