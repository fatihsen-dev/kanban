import RoleSelect from "@/components/project/role-select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useTeam from "@/hooks/use-team";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";
import { List } from "lucide-react";
import { useState } from "react";
import { ITab } from ".";

export default function CreateTeam({ setTab }: { setTab: (tab: ITab) => void }) {
   const { toast } = useToast();
   const [name, setName] = useState("");
   const [role, setRole] = useState<IProjectAccessRole>("read");
   const { create } = useTeam();
   const { project } = useProjectStore();

   const createTeam = () => {
      if (!project) return;

      if (!name || name.trim().length < 3) {
         toast("Name must be at least 3 characters", "error");
         return;
      }

      create({ name, role }, (error) => {
         if (error) toast(error, "error");
         else setTab("list");
      });
   };

   return (
      <div className='flex flex-col gap-2 h-full'>
         <div className='flex gap-2 flex-1'>
            <Button variant='outline' size='icon' onClick={() => setTab("list")}>
               <List />
            </Button>
            <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
            <RoleSelect role={role} setRole={setRole} />
         </div>
         <Button onClick={createTeam}>Create Team</Button>
      </div>
   );
}
