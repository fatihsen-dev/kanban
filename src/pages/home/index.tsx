import Invitations from "@/components/invitations";
import Projects from "@/components/project/projects";

export default function Home() {
   return (
      <div className='h-screen flex items-center justify-center flex-col gap-4'>
         <Invitations />
         <Projects />
      </div>
   );
}
