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
import { List, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { ITab } from ".";

export default function EditTeam({ editingTeam, setTab }: { editingTeam: IProjectTeam; setTab: (tab: ITab) => void }) {
   const { toast } = useToast();
   const [name, setName] = useState(editingTeam.name);
   const [role, setRole] = useState<IProjectAccessRole>(editingTeam.role);
   const [members, setMembers] = useState<IProjectMember[]>([]);
   const { update } = useTeam();
   const { project } = useProjectStore();
   const [addingMember, setAddingMember] = useState(false);

   useEffect(() => {
      if (project) {
         const members = project.members.filter((m) => m.team_id === editingTeam.id);
         setMembers(members);
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
                     <Member key={member.id} member={member} />
                  ))}
               </ul>
               <AddMemberDialog
                  addingMember={addingMember}
                  setAddingMember={setAddingMember}
                  editingTeam={editingTeam}
               />
            </div>
         </div>
         <Button onClick={updateTeam}>Update Team</Button>
      </div>
   );
}

function AddMemberDialog({
   addingMember,
   setAddingMember,
   editingTeam,
}: {
   addingMember: boolean;
   setAddingMember: (addingMember: boolean) => void;
   editingTeam: IProjectTeam;
}) {
   const { project } = useProjectStore();
   const [selectedMembers, setSelectedMembers] = useState<IProjectMember[]>([]);
   const [search, setSearch] = useState("");
   const [members, setMembers] = useState<IProjectMember[]>([]);
   const { addMembers } = useTeam();
   const { toast } = useToast();

   useEffect(() => {
      if (project) {
         setMembers(
            project.members
               .filter((member) => member.user.name.toLowerCase().includes(search.toLowerCase()))
               .filter(
                  (member) => !selectedMembers.some((m) => m.id === member.id) && member.team_id !== editingTeam.id
               )
               .slice(0, 5)
         );
      }
   }, [project, search, selectedMembers, editingTeam]);

   const addMember = (member: IProjectMember) => {
      if (selectedMembers.some((m) => m.id === member.id)) {
         return;
      }
      setSelectedMembers([...selectedMembers, member]);
   };

   const removeMember = (member: IProjectMember) => {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
   };

   const handleAddMember = () => {
      addMembers(
         editingTeam.id,
         selectedMembers.map((m) => m.id),
         (error) => {
            if (error) toast(error, "error");
            else {
               setSelectedMembers([]);
               setAddingMember(false);
            }
         }
      );
   };

   return (
      <Dialog open={addingMember} onOpenChange={setAddingMember}>
         <DialogTrigger asChild>
            <Button variant='outline'>Add Member</Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add Member</DialogTitle>
               <DialogDescription>Select a member from the project to add them to this team.</DialogDescription>
            </DialogHeader>
            <Input placeholder='Search' value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
            {members.length > 0 && (
               <div className='flex flex-col gap-2'>
                  <span>Members</span>
                  <ul className='flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
                     {members.map((member) => (
                        <div key={member.id} className='flex items-center justify-between'>
                           <span>{member.user.name}</span>
                           <Button variant='outline' size='icon' onClick={() => addMember(member)}>
                              <Plus />
                           </Button>
                        </div>
                     ))}
                  </ul>
               </div>
            )}
            {selectedMembers.length > 0 && (
               <div className='flex flex-col gap-2'>
                  <span>Selected Members</span>
                  <div className='flex flex-col gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
                     {selectedMembers.map((member) => (
                        <div key={member.id} className='flex items-center justify-between gap-2'>
                           <span>{member.user.name}</span>
                           <Button variant='outline' size='icon' onClick={() => removeMember(member)}>
                              <Trash />
                           </Button>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            <DialogFooter>
               <Button variant='outline' onClick={() => setAddingMember(false)}>
                  Cancel
               </Button>
               <Button onClick={handleAddMember}>Add</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

function Member({ member }: { member: IProjectMember }) {
   const [open, setOpen] = useState(false);
   const { update: updateMember } = useMember();
   const { toast } = useToast();

   const deleteMember = (member: IProjectMember) => {
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
      <div
         key={member.id}
         className='flex items-center justify-start gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
         <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback className='bg-gray-200 text-gray-500'>{member.user.name.charAt(0)}</AvatarFallback>
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
                  <Button variant='destructive' onClick={() => deleteMember(member)}>
                     Delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
