import { useProjectStore } from "@/store/project-store";

export default function Members() {
   const { project } = useProjectStore();

   return (
      <div>
         {project?.members.map((member) => (
            <div key={member.id}>{member.user.name}</div>
         ))}
      </div>
   );
}
