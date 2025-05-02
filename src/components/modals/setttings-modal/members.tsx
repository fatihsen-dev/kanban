import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project-store";
import { TrashIcon } from "lucide-react";

export default function Members() {
   const { project } = useProjectStore();

   return (
      <div className='space-y-2'>
         {project?.members.map((member) => (
            <div key={member.id} className='flex items-center justify-between bg-gray-50 shadow-sm rounded-sm p-2'>
               <span>{member.user.name}</span>
               {member.role !== "owner" && (
                  <div>
                     <Button variant='destructive' size='icon' className='w-6 h-6 p-1.5 rounded-sm'>
                        <TrashIcon className='!w-full !h-full' />
                     </Button>
                  </div>
               )}
            </div>
         ))}
      </div>
   );
}
