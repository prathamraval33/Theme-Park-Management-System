import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/index";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* 🔥 REQUIRED for toast */}
     <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "rgba(255,255,255,0.08)",
      color: "#fff",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
  }}
/>

      <RouterProvider router={router} />
    </>
  );
}

export default App;