import RoleSelect from "@/components/project/role-select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTeam from "@/hooks/use-team";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";
import { useState } from "react";

export default function Teams() {
   const { toast } = useToast();
   const [name, setName] = useState("");
   const [role, setRole] = useState<IProjectAccessRole>("read");
   const { project } = useProjectStore();
   const { create } = useTeam();

   const createTeam = () => {
      if (!project) return;

      if (!name || name.trim().length < 3) {
         toast("Name must be at least 3 characters", "error");
         return;
      }

      create({ name, role }, (error) => {
         if (error) toast(error, "error");
      });
   };

   return (
      <div className='flex flex-col justify-between h-full'>
         <Accordion className='w-full flex flex-col gap-2' type='single' collapsible>
            {project?.teams.map((team) => (
               <AccordionItem
                  className='bg-gray-50 !border border-gray-200 rounded-sm'
                  key={team.id}
                  value={`team-${team.id}`}>
                  <AccordionTrigger className='py-3 px-2 !no-underline cursor-pointer hover:bg-gray-100'>
                     {team.name}
                  </AccordionTrigger>
                  <AccordionContent className='px-2 !pb-2 !py-1'>
                     <ul>
                        {team.members.map((member) => (
                           <li key={member.id}>{member.user.name}</li>
                        ))}
                     </ul>
                  </AccordionContent>
               </AccordionItem>
            ))}
         </Accordion>
         <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
               <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
               <RoleSelect role={role} setRole={setRole} />
            </div>
            <Button onClick={createTeam}>Create Team</Button>
         </div>
      </div>
   );
}
