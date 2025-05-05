import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";

export default function Members() {
   const { project } = useProjectStore();

   return (
      <div className='space-y-2'>
         {project?.members.map((member) => (
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
            </div>
         ))}
      </div>
   );
}
