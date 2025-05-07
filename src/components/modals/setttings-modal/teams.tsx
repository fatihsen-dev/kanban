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
import { List, Pencil, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

type ITab = "list" | "create" | "edit";

export default function Teams() {
   const [editingTeam, setEditingTeam] = useState<IProjectTeam | null>(null);
   const [tab, setTab] = useState<ITab>("list");

   const TabContent: Record<ITab, React.ReactNode> = {
      list: <TeamList setEditingTeam={setEditingTeam} setTab={setTab} />,
      create: <CreateTeam setTab={setTab} />,
      edit: editingTeam ? <EditTeam editingTeam={editingTeam} setTab={setTab} /> : null,
   };

   return <div className='flex flex-col justify-between h-full'>{TabContent[tab]}</div>;
}

function EditTeam({ editingTeam, setTab }: { editingTeam: IProjectTeam; setTab: (tab: ITab) => void }) {
   const { toast } = useToast();
   const [name, setName] = useState(editingTeam.name);
   const [role, setRole] = useState<IProjectAccessRole>(editingTeam.role);
   const [members, setMembers] = useState<IProjectMember[]>([]);
   const { update } = useTeam();
   const { update: updateMember } = useMember();
   const { project } = useProjectStore();
   const [open, setOpen] = useState(false);

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
               <h3 className='font-medium'>Members</h3>
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
            </div>
         </div>
         <Button onClick={updateTeam}>Update Team</Button>
      </div>
   );
}

function CreateTeam({ setTab }: { setTab: (tab: ITab) => void }) {
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

function TeamList({
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
