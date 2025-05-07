import RoleSelect from "@/components/project/role-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import useMember from "@/hooks/use-member";
import useTeam from "@/hooks/use-team";
import useToast from "@/hooks/use-toast";
import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";
import { List, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ITab } from ".";

export default function EditTeam({ editingTeam, setTab }: { editingTeam: IProjectTeam; setTab: (tab: ITab) => void }) {
   const { toast } = useToast();
   const [name, setName] = useState(editingTeam.name);
   const [role, setRole] = useState<IProjectAccessRole>(editingTeam.role);
   const [members, setMembers] = useState<IProjectMember[]>([]);
   const { update } = useTeam();
   const { update: updateMember } = useMember();
   const { project } = useProjectStore();
   const [open, setOpen] = useState(false);
   const [addingMember, setAddingMember] = useState(false);
   useEffect(() => {
      if (project) {
         setMembers(project.members.filter((member) => member.team_id === editingTeam.id));
      }
   }, [editingTeam, project]);

   const updateTeam = () => {
      if (!project) return;

      if (!name || name.trim().length < 3) {
         toast("Name must be at least 3 characters", "error");
         return;
      }

      update(
         {
            id: editingTeam.id,
            ...(name !== editingTeam.name && { name }),
            ...(role !== editingTeam.role && { role }),
         },
         (error) => {
            if (error) {
               toast(error, "error");
            } else {
               setTab("list");
            }
         }
      );
   };

   const handleDelete = (member: IProjectMember) => {
      updateMember(
         {
            id: member.id,
            team_id: "",
         },
         (error) => {
            if (error) toast(error, "error");
         }
      );
   };

   return (
      <div className='flex flex-col gap-2 h-full'>
         <div className='flex flex-col gap-2 flex-1'>
            <div className='flex gap-2'>
               <Button variant='outline' size='icon' onClick={() => setTab("list")}>
                  <List />
               </Button>
               <Input placeholder='Name' value={name} onChange={(e) => setName(e.currentTarget.value)} />
               <RoleSelect role={role} setRole={(role) => setRole(role)} />
            </div>
            <div className='flex flex-col gap-1.5 mt-3'>
               <div className='flex items-center justify-between'>
                  <h3 className='font-medium'>Members</h3>
               </div>
               <ul className='flex flex-col gap-2'>
                  {members.map((member) => (
                     <div
                        key={member.id}
                        className='flex items-center justify-start gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
                        <Avatar>
                           <AvatarImage src={""} />
                           <AvatarFallback className='bg-gray-200 text-gray-500'>
                              {member.user.name.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col leading-[1.2rem]'>
                           <span>{member.user.name}</span>
                           <span className='text-xs text-gray-500'>Joined on {formatDate(member.created_at)}</span>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                           <DialogTrigger asChild>
                              <Button className='ml-auto' variant='destructive' size='icon'>
                                 <Trash />
                              </Button>
                           </DialogTrigger>
                           <DialogContent>
                              <DialogHeader>
                                 <DialogTitle>Are you absolutely sure?</DialogTitle>
                                 <DialogDescription>
                                    This action cannot be undone. This will permanently delete the member from the team.
                                 </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                 <Button variant='outline' onClick={() => setOpen(false)}>
                                    Cancel
                                 </Button>
                                 <Button variant='destructive' onClick={() => handleDelete(member)}>
                                    Delete
                                 </Button>
                              </DialogFooter>
                           </DialogContent>
                        </Dialog>
                     </div>
                  ))}
               </ul>
               <Dialog open={addingMember} onOpenChange={setAddingMember}>
                  <DialogTrigger asChild>
                     <Button variant='outline'>Add Member</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Add Member</DialogTitle>
                        <DialogDescription>
                           Select a member from the project to add them to this team.
                        </DialogDescription>
                     </DialogHeader>
                     <DialogFooter>
                        <Button variant='outline' onClick={() => setAddingMember(false)}>
                           Cancel
                        </Button>
                        <Button onClick={() => setAddingMember(false)}>Add</Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
         </div>
         <Button onClick={updateTeam}>Update Team</Button>
      </div>
   );
}
