import Loading from "@/components/loading";
import Column from "@/components/project/column";
import Navbar from "@/components/project/navbar";
import TaskDetails from "@/components/project/task-details";
import RoleGuard from "@/components/role-guard";
import { useAuthStore } from "@/store/auth-store";
import { ModalType, useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router";

export default function Project() {
   const { project_id } = useParams();
   const { user } = useAuthStore();
   const [taskId, setTaskId] = useQueryState("taskId");
   const { project, setProject } = useProjectStore();
   const { setIsOpen } = useModalStore();

   const { data, isLoading, error } = useQuery<ISuccessResponse<IProjectWithDetails>, AxiosError<IErrorResponse>>({
      queryKey: [`projects/${project_id}`],
      retry: false,
   });

   const { data: onlineUsersData } = useQuery<ISuccessResponse<IUserStatusResponse[]>, AxiosError<IErrorResponse>>({
      queryKey: [`projects/${data?.data?.id}/members/online`],
      retry: false,
      enabled: !!data?.success,
   });

   useEffect(() => {
      if (data?.success && onlineUsersData?.success) {
         const project = data.data!;
         const onlineUsers = onlineUsersData.data!;
         setProject({
            ...project,
            members: project.members.map((member) => ({
               ...member,
               user: {
                  ...member.user,
                  status: onlineUsers.find((m) => m.id === member.user.id)?.status ?? "offline",
               },
            })),
         });
      }

      return () => {
         setProject(null);
      };
   }, [data, setProject, user, onlineUsersData]);

   if (error) {
      return <div>Error: {error.response?.data.message}</div>;
   }

   if (isLoading || !project) {
      return <Loading />;
   }

   const openCreateColumnModal = () => {
      setIsOpen(true, ModalType.CREATE_COLUMN);
   };

   return (
      <DndProvider backend={HTML5Backend}>
         <div className='flex flex-col p-4 gap-4 h-screen'>
            <Navbar />
            <div className='flex gap-4 flex-1 h-full overflow-x-auto'>
               <div
                  className='grid gap-4 h-full'
                  style={{
                     gridTemplateColumns: `repeat(${project?.columns.length}, 1fr)`,
                  }}>
                  {project?.columns.map((column) => (
                     <Column key={column.id} column={column} taskId={taskId} setTaskId={setTaskId} />
                  ))}
               </div>
               <RoleGuard roles={["owner", "admin"]}>
                  <div
                     onClick={openCreateColumnModal}
                     className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer text-gray-700 h-full'>
                     <Plus size={36} strokeWidth={1.3} />
                  </div>
               </RoleGuard>
               <TaskDetails taskId={taskId} setTaskId={setTaskId} />
            </div>
         </div>
      </DndProvider>
   );
}
