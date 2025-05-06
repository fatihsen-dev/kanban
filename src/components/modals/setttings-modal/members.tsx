import RoleSelect from "@/components/project/role-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useMember from "@/hooks/use-member";
import useAuth from "@/hooks/user-auth";
import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";
import { useState } from "react";

export default function Members() {
   const { authMember } = useAuth();
   const { update } = useMember();
   const { project } = useProjectStore();

   const updateRole = (member: IProjectMember, role: IProjectAccessRole) => {
      update({ id: member.id, role });
   };

   return (
      <div className='space-y-2'>
         {project?.members
            .filter(
               (member) =>
                  member.user.id !== authMember?.user.id && member.user.id !== project.owner_id
            )
            .map((member) => (
               <Member key={member.id} member={member} updateRole={updateRole} />
            ))}
      </div>
   );
}

interface MemberProps {
   member: IProjectMember;
   updateRole: (member: IProjectMember, role: IProjectAccessRole) => void;
}

function Member({ member, updateRole }: MemberProps) {
   const [role, setRole] = useState<IProjectAccessRole>(member.role);

   const handleChange = (role: IProjectAccessRole) => {
      setRole(role);
      updateRole(member, role);
   };

   return (
      <div
         key={member.id}
         className='flex items-center justify-start gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
         <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback className='bg-gray-200 text-gray-500'>
               {member.user.name.charAt(0)}
            </AvatarFallback>
         </Avatar>
         <div className='flex  flex-col'>
            <span>{member.user.name}</span>
            <span className='text-xs text-gray-500'>Joined on {formatDate(member.created_at)}</span>
         </div>
         <RoleSelect role={role} setRole={setRole} onChange={handleChange} className='ml-auto' />
      </div>
   );
}
