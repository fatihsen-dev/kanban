import { useState } from "react";
import CreateTeam from "./create-team";
import EditTeam from "./edit-team";
import TeamList from "./team-list";

export type ITab = "list" | "create" | "edit";

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
