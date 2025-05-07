import { useAuthStore } from "@/store/auth-store";
import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";

export default function useAuth() {
   const { user } = useAuthStore();
   const { project } = useProjectStore();
   const [authMember, setAuthMember] = useState<IProjectMember | null>(null);

   useEffect(() => {
      if (project) {
         const member = project.members.find((member) => member.user.id === user?.id);
         if (member) {
            setAuthMember(member);
         }
      }
   }, [project, user]);

   return {
      authMember,
   };
}
