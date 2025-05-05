import useRoleGuard from "@/hooks/use-role-guard";

interface RoleGuardProps {
   roles: IProjectAccessRole[];
   children: React.ReactNode | React.ReactNode[];
}

export default function RoleGuard({ roles, children }: RoleGuardProps) {
   const { isAllowed } = useRoleGuard(roles);

   if (!isAllowed) {
      return null;
   }

   return <>{children}</>;
}
