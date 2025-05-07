import { useEffect, useState } from "react";
import useAuth from "./user-auth";

export default function useRoleGuard(roles: IProjectAccessRole[]) {
   const [memberIsExist, setMemberIsExist] = useState(false);
   const { authMember } = useAuth();
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
