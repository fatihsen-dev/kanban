import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";

interface RoleGuardProps {
   roles: IProjectAccessRole[];
   children: React.ReactNode | React.ReactNode[];
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
   const [memberIsExist, setMemberIsExist] = useState(false);
   const { authMember } = useProjectStore();

   useEffect(() => {
      if (authMember) {
         setMemberIsExist(true);
      }
   }, [authMember]);

   if (!memberIsExist || !roles.includes(authMember!.role)) {
      return null;
   }

   return <>{children}</>;
}
