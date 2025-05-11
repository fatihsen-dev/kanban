import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import useProject from "@/hooks/use-project";
import useToast from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { ModalType, useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Loading from "../loading";
import { Button } from "../ui/button";

export default function Projects() {
   const { projects, setProjects, removeProject } = useProjectStore();
   const { setIsOpen } = useModalStore();
   const { delete: deleteProject } = useProject();
   const { user } = useAuthStore();
   const { toast } = useToast();
   const [open, setOpen] = useState(false);

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

   const handleDeleteProject = (project_id: IProject["id"]) => {
      deleteProject(project_id, (error) => {
         if (error) {
            toast(error || "Project deletion failed", "error");
         } else {
            removeProject(project_id);
         }
      });
   };

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
                  <li
                     className='p-3 flex rounded-md bg-muted/50 hover:bg-accent/50 transition-colors border border-border/40 items-center'
                     key={project.id}>
                     <NavLink className='flex items-center w-full' to={`/${project.id}`}>
                        <div className='w-8 h-8 rounded-md bg-primary/20 text-primary flex items-center justify-center mr-3 font-medium'>
                           {project.name.charAt(0).toUpperCase()}
                        </div>
                        <span className='font-medium'>{project.name}</span>
                     </NavLink>
                     {user?.id === project.owner_id && (
                        <Dialog open={open} onOpenChange={setOpen}>
                           <DialogTrigger asChild>
                              <Button
                                 className='ml-auto'
                                 variant='destructive'
                                 size='icon'
                                 onClick={() => setOpen(true)}>
                                 <Trash />
                              </Button>
                           </DialogTrigger>
                           <DialogContent>
                              <DialogHeader>
                                 <DialogTitle>Are you absolutely sure?</DialogTitle>
                                 <DialogDescription>
                                    This action cannot be undone. This will permanently delete the project and remove it
                                    from the project.
                                 </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                 <Button variant='outline' onClick={() => setOpen(false)}>
                                    Cancel
                                 </Button>
                                 <Button variant='destructive' onClick={() => handleDeleteProject(project.id)}>
                                    Delete
                                 </Button>
                              </DialogFooter>
                           </DialogContent>
                        </Dialog>
                     )}
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
