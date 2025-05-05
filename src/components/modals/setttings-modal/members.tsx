import RoleSelect from "@/components/project/role-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";
import { useState } from "react";

export default function Members() {
   const { project } = useProjectStore();

   return (
      <div className='space-y-2'>
         {project?.members
            .filter((member) => member.user.id !== project.owner_id)
            .map((member) => (
               <Member key={member.id} member={member} />
            ))}
      </div>
   );
}

interface MemberProps {
   member: IProjectMember;
}

function Member({ member }: MemberProps) {
   const [role, setRole] = useState<IProjectAccessRole>(member.role);

   return (
      <div
         key={member.id}
         className='flex items-center justify-start gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
         <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback className='bg-gray-200 text-gray-500'>{member.user.name.charAt(0)}</AvatarFallback>
         </Avatar>
         <div className='flex  flex-col'>
            <span>{member.user.name}</span>
            <span className='text-xs text-gray-500'>Joined on {formatDate(member.created_at)}</span>
         </div>
         <RoleSelect role={role} setRole={setRole} className='max-w-[100px] ml-auto' />
      </div>
   );
}
