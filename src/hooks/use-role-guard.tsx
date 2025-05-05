import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";

export default function useRoleGuard(roles: IProjectAccessRole[]) {
   const [memberIsExist, setMemberIsExist] = useState(false);
   const { authMember } = useProjectStore();
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
         setIsAllowed(roles.includes(authMember!.role));
      }
   }, [roles, authMember, memberIsExist]);

   return {
      isAllowed,
   };
}
