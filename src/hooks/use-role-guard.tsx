import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";
import useAuth from "./use-auth";

export default function useRoleGuard(roles: IProjectAccessRole[]) {
   const [memberIsExist, setMemberIsExist] = useState(false);
   const { authMember } = useAuth();
   const { project } = useProjectStore();
   const [isAllowed, setIsAllowed] = useState(false);

   useEffect(() => {
      if (authMember) {
         setMemberIsExist(true);
      }
   }, [authMember]);

   useEffect(() => {
      if (!memberIsExist) {
         setIsAllowed(false);
      } else {
         const memberAccess = roles.includes(authMember!.role);
         if (!memberAccess && authMember?.team_id) {
            const team = project?.teams.find((team) => team.id === authMember.team_id);
            if (team) {
               setIsAllowed(roles.includes(team.role));
            } else {
               setIsAllowed(false);
            }
         } else {
            setIsAllowed(memberAccess);
         }
      }
   }, [roles, authMember, memberIsExist, project]);

   return {
      isAllowed,
   };
}
