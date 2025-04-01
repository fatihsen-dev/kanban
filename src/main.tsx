import router from "@/routes/router.ts";
import "@/styles/index.css";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")!).render(
   <DndProvider backend={HTML5Backend}>
      <NuqsAdapter>
         <RouterProvider router={router} />
      </NuqsAdapter>
   </DndProvider>
);
