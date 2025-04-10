import router from "@/routes/router";
import "@/styles/index.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import Providers from "./providers";

createRoot(document.getElementById("root")!).render(
   <Providers>
      <RouterProvider router={router} />
   </Providers>
);
