import Loading from "@/components/loading";
import { Home, Login, NotFound, Project, Register } from "@/pages";
import AuthProvider from "@/providers/auth-provider";
import WsProvider from "@/providers/ws-provider";
import { createBrowserRouter } from "react-router";
import { authLoader, protectedLoader } from "./loaders";

const router = createBrowserRouter([
   {
      path: "/",
      loader: protectedLoader,
      element: (
         <AuthProvider>
            <WsProvider>
               <Home />
            </WsProvider>
         </AuthProvider>
      ),
      HydrateFallback: Loading,
   },
   {
      path: "/:project_id",
      loader: protectedLoader,
      element: (
         <AuthProvider>
            <WsProvider>
               <Project />
            </WsProvider>
         </AuthProvider>
      ),
      HydrateFallback: Loading,
   },
   {
      path: "/login",
      loader: authLoader,
      element: <Login />,
      HydrateFallback: Loading,
   },
   {
      path: "/register",
      loader: authLoader,
      element: <Register />,
      HydrateFallback: Loading,
   },
   {
      path: "*",
      element: <NotFound />,
   },
]);

export default router;
