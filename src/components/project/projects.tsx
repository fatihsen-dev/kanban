import { ModalType, useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { NavLink } from "react-router";
import Loading from "../loading";
import { Button } from "../ui/button";
export default function Projects() {
   const { projects, setProjects } = useProjectStore();
   const { setIsOpen } = useModalStore();

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

   const handleOpenCreateProjectModal = () => {
      setIsOpen(true, ModalType.CREATE_PROJECT);
   };

   return (
      <div className='flex flex-col gap-4 w-full bg-card border rounded-lg shadow-sm p-4'>
         {projects.length === 0 ? (
            <div className='flex flex-col gap-2'>
               <h3 className='text-lg font-medium'>No projects</h3>
               <p className='text-sm text-muted-foreground'>Create a new project to get started</p>
            </div>
         ) : (
            <ul className='flex flex-col gap-2'>
               {projects.map((project) => (
                  <li key={project.id}>
                     <NavLink
                        className='p-3 flex rounded-md bg-muted/50 hover:bg-accent/50 transition-colors cursor-pointer border border-border/40 items-center'
                        to={`/${project.id}`}>
                        <div className='w-8 h-8 rounded-md bg-primary/20 text-primary flex items-center justify-center mr-3 font-medium'>
                           {project.name.charAt(0).toUpperCase()}
                        </div>
                        <span className='font-medium'>{project.name}</span>
                     </NavLink>
                  </li>
               ))}
            </ul>
         )}
         <Button className='mt-2' onClick={handleOpenCreateProjectModal} size='sm'>
            Create Project
         </Button>
      </div>
   );
}
