import { Home } from "@/pages";
import { createBrowserRouter } from "react-router";
const router = createBrowserRouter([
   {
      path: "/",
      Component: Home,
   },
]);

export default router;
