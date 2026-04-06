import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes/index";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
<GoogleOAuthProvider clientId="800819175089-o1g5da5019htke4l1dq5okm1rq3vt0iv.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>

      <RouterProvider router={router} />
    </>
    
  );
}


export default App;