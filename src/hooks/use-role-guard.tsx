import { useAuthStore } from "@/store/auth-store";
import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";

export const checkRoleAccess = (
   roles: IProjectAccessRole[],
   authMember: IProjectMember,
   project: IProjectWithDetails
) => {
   const memberAccess = roles.includes(authMember!.role);
   if (!memberAccess && authMember?.team_id) {
      const team = project?.teams.find((team) => team.id === authMember.team_id);
      if (team) {
         return roles.includes(team.role);
      } else {
         return false;
      }
   } else {
      return memberAccess;
   }
};

export default function useRoleGuard(roles: IProjectAccessRole[]) {
   const [memberIsExist, setMemberIsExist] = useState(false);
   const { authMember } = useAuthStore();
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
         setIsAllowed(checkRoleAccess(roles, authMember!, project!));
      }
   }, [roles, authMember, memberIsExist, project]);

   return {
      isAllowed,
   };
}
