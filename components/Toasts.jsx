"use client";

import toast from "react-hot-toast";

export const toastSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    style: {
      background: "white",
      color: "#3d7b80",
      textAlign: "center",
      fontSize: "16px",
      fontWeight: "500", // небольшая жирность
      padding: "12px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    iconTheme: {
      primary: "#3d7b80",
      secondary: "white",
    },
  });
};

export const toastError = (message) => {
  toast.error(message, {
    position: "top-center",
    style: {
      background: "white",
      color: "#b91c1c",
      textAlign: "center",
      fontSize: "16px",
      fontWeight: "500", // небольшая жирность
      padding: "12px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    iconTheme: {
      primary: "#b91c1c",
      secondary: "white",
    },
  });
};

export default toast;
