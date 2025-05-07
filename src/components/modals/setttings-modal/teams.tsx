import RoleSelect from "@/components/project/role-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTeam from "@/hooks/use-team";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";
import { Pencil } from "lucide-react";
import { useState } from "react";

type ITab = "list" | "create" | "edit";

export default function Teams() {
   const [editingTeam, setEditingTeam] = useState<IProjectTeam | null>(null);
   const [tab, setTab] = useState<ITab>("list");

   const TabContent: Record<ITab, React.ReactNode> = {
      list: <TeamList setEditingTeam={setEditingTeam} setTab={setTab} />,
      create: <CreateTeam />,
      edit: editingTeam ? <EditTeam editingTeam={editingTeam} setTab={setTab} /> : null,
   };

   return <div className='flex flex-col justify-between h-full'>{TabContent[tab]}</div>;
}

function EditTeam({
   editingTeam,
   setTab,
}: {
   editingTeam: IProjectTeam;
   setTab: (tab: ITab) => void;
}) {
   const { toast } = useToast();
   const [name, setName] = useState(editingTeam.name);
   const [role, setRole] = useState<IProjectAccessRole>(editingTeam.role);
   const { update } = useTeam();
   const { project } = useProjectStore();

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
      <div className='flex flex-col gap-2'>
         <div className='flex gap-2'>
            <Input
               placeholder='Name'
               value={name}
               onChange={(e) => setName(e.currentTarget.value)}
            />
            <RoleSelect role={role} setRole={(role) => setRole(role)} />
         </div>
         <Button onClick={updateTeam}>Update Team</Button>
      </div>
   );
}

function CreateTeam() {
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
      });
   };

   return (
      <div className='flex flex-col gap-2'>
         <div className='flex gap-2'>
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
      <div className='w-full flex flex-col gap-2 h-full'>
         <ul className='flex flex-col gap-2 flex-1'>
            {project?.teams.map((team) => (
               <Team key={team.id} team={team} setEditingTeam={setEditingTeam} setTab={setTab} />
            ))}
         </ul>
         <Button onClick={() => setTab("create")}>Create Team</Button>
      </div>
   );
}

interface TeamProps {
   team: IProjectTeam;
   setEditingTeam: (team: IProjectTeam) => void;
   setTab: (tab: ITab) => void;
}

function Team({ team, setEditingTeam, setTab }: TeamProps) {
   const handleEdit = () => {
      setEditingTeam(team);
      setTab("edit");
   };

   return (
      <li className='flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'>
         <h3 className='text-lg pl-1 font-medium'>{team.name}</h3>
         <div className='ml-auto bg-white rounded-sm p-1 px-3 border capitalize border-gray-200'>
            {team.role}
         </div>
         <Button size='icon' onClick={handleEdit}>
            <Pencil />
         </Button>
      </li>
   );
}
