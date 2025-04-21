import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { NavLink } from "react-router";

export default function Home() {
   const { create } = useProject();
   const { projects, setProjects } = useProjectStore();

   const { data, isLoading, error } = useQuery<ISuccessResponse<IProject[]>, AxiosError<IErrorResponse>>({
      queryKey: [`projects`],
      retry: false,
   });

   useEffect(() => {
      if (data?.success) {
         setProjects(data.data!);
      }
   }, [data, setProjects]);

   if (error) {
      return <div>Error: {error.response?.data.message}</div>;
   }

   if (isLoading) {
      return <Loading />;
   }

   const handleCreateProject = () => {
      create({ name: "New Project" });
   };

   return (
      <div className='h-screen flex items-center justify-center flex-col gap-4'>
         <ul>
            {projects.map((project) => (
               <li key={project.id}>
                  <NavLink to={`/${project.id}`}>{project.name}</NavLink>
               </li>
            ))}
         </ul>
         <Button onClick={handleCreateProject}>Create Project</Button>
      </div>
   );
}
