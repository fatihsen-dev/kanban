import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import useTeam from "@/hooks/use-team";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";
import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { ITab } from ".";

export default function TeamList({
   setEditingTeam,
   setTab,
}: {
   setEditingTeam: (team: IProjectTeam) => void;
   setTab: (tab: ITab) => void;
}) {
   const { project } = useProjectStore();

   return (
      <div className='flex flex-col gap-2 h-full'>
         <ul className='flex flex-col gap-2 flex-1'>
            {project?.teams.map((team) => (
               <Team key={team.id} team={team} setEditingTeam={setEditingTeam} setTab={setTab} />
            ))}
         </ul>
         <div className='flex justify-end'>
            <Button size='icon' onClick={() => setTab("create")}>
               <Plus />
            </Button>
         </div>
      </div>
   );
}

interface TeamProps {
   team: IProjectTeam;
   setEditingTeam: (team: IProjectTeam) => void;
   setTab: (tab: ITab) => void;
}

function Team({ team, setEditingTeam, setTab }: TeamProps) {
   const { remove } = useTeam();
   const { toast } = useToast();
   const [open, setOpen] = useState(false);

   const handleEdit = () => {
      setEditingTeam(team);
      setTab("edit");
   };

   const handleDelete = () => {
      remove(team, (error) => {
         if (error) toast(error, "error");
      });
   };

   return (
      <li className='flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
         <h3 className='text-lg pl-1 font-medium'>{team.name}</h3>
         <div className='ml-auto bg-white rounded-sm p-1 px-3 border capitalize border-gray-200'>{team.role}</div>
         <Button size='icon' variant='outline' onClick={handleEdit}>
            <Pencil />
         </Button>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button variant='destructive' size='icon'>
                  <Trash />
               </Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                     This action cannot be undone. This will permanently delete the team and remove it from the project.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button variant='outline' onClick={() => setOpen(false)}>
                     Cancel
                  </Button>
                  <Button variant='destructive' onClick={handleDelete}>
                     Delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </li>
   );
}
