import Loading from "@/components/loading";
import { useAuthStore } from "@/store/auth-store";
import { useProjectStore } from "@/store/project-store";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { Navigate, useLoaderData } from "react-router";

interface AuthProviderProps {
   children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
   const { authUser } = useLoaderData();
   const { setUser, status, setToken } = useAuthStore();
   const { project } = useProjectStore();
   const { authMember, setAuthMember } = useAuthStore();

   useEffect(() => {
      if (authUser) {
         setUser(authUser);
         setToken(localStorage.getItem("token") || null);
      } else {
         setToken(null);
      }
   }, [authUser, setToken, setUser]);

   useEffect(() => {
      if (project && authUser) {
         const member = project.members.find((member) => member.user.id === authUser?.id);
         if ((!authMember || !isEqual(authMember, member)) && member) {
            setAuthMember(member);
         }
      }
   }, [project, authUser, authMember, setAuthMember]);

   if (status === "loading") {
      return <Loading />;
   }

   if (status === "unauthenticated") {
      return <Navigate to='/login' />;
   }

   return <>{children}</>;
}
