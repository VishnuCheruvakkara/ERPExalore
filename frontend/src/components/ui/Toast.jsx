import { Toaster } from "react-hot-toast";

export const AppToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        color: "#fff",
        fontSize: "14px",
        fontWeight: "500",
      },
      success: {
        style: {
          background: "#16a34a", // green
          color: "#fff",
        },
      },
      error: {
        style: {
          background: "#dc2626", // red
          color: "#fff",
        },
      },
      loading: {
        style: {
          background: "#0f172a", // dark slate
          color: "#fff",
        },
      },
    }}
  />
);