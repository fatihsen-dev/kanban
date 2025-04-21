import Loading from "@/components/loading";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import { Navigate, useLoaderData } from "react-router";

interface AuthProviderProps {
   children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
   const { authUser } = useLoaderData();
   const { setUser, status, setToken } = useAuthStore();

   useEffect(() => {
      if (authUser) {
         setUser(authUser);
         setToken(localStorage.getItem("token") || null);
      } else {
         setToken(null);
      }
   }, [authUser]);

   if (status === "loading") {
      return <Loading />;
   }

   if (status === "unauthenticated") {
      return <Navigate to='/login' />;
   }

   return <>{children}</>;
}
