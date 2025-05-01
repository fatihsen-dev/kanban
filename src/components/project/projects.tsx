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
      <div className='flex flex-col gap-4 max-w-md w-full bg-blue-100 border border-blue-200 rounded-md p-4'>
         {projects.length === 0 ? (
            <div className='flex flex-col gap-2'>
               <h3 className='text-lg font-bold'>No projects</h3>
               <p className='text-sm text-gray-500'>Create a new project to get started</p>
            </div>
         ) : (
            <ul className='flex flex-col gap-2'>
               {projects.map((project) => (
                  <li key={project.id}>
                     <NavLink
                        className='py-2 px-4 flex rounded-md bg-white hover:bg-gray-100 transition-colors cursor-pointer'
                        to={`/${project.id}`}>
                        {project.name}
                     </NavLink>
                  </li>
               ))}
            </ul>
         )}
         <Button onClick={handleOpenCreateProjectModal}>Create Project</Button>
      </div>
   );
}
