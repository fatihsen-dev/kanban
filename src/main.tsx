import router from "@/routes/router.ts";
import "@/styles/index.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")!).render(
   <DndProvider backend={HTML5Backend}>
      <RouterProvider router={router} />
   </DndProvider>
);
