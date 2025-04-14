import Loading from "@/components/loading";
import Column from "@/components/project/column";
import CreateColumnModal from "@/components/project/create-column-modal";
import CreateTaskModal from "@/components/project/create-task-modal";
import TaskDetails from "@/components/project/task-details";
import WsProvider from "@/providers/project/ws-provider";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router";

export default function Project() {
   const { project_id } = useParams();
   const [taskId, setTaskId] = useQueryState("taskId");
   const { project, setProject, column } = useProjectStore();

   const { data, isLoading, error } = useQuery<ISuccessResponse<IProjectWithColumns>, IErrorResponse>({
      queryKey: [`projects/${project_id}/columns`],
      retry: false,
   });

   useEffect(() => {
      if (data?.success) {
         setProject(data.data!);
      }
   }, [data, setProject]);

   if (error) {
      return <div>Error: {error.message}</div>;
   }

   if (isLoading || !project) {
      return <Loading />;
   }

   return (
      <WsProvider>
         <DndProvider backend={HTML5Backend}>
            <div className='flex p-4 gap-4 h-screen'>
               <div
                  className='grid gap-4 h-full'
                  style={{
                     gridTemplateColumns: `repeat(${project?.columns.length}, 1fr)`,
                  }}>
                  {project?.columns.map((column) => (
                     <Column key={column.id} column={column} taskId={taskId} setTaskId={setTaskId} />
                  ))}
               </div>
               <div
                  onClick={column.modal.toggle}
                  className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer text-gray-700'>
                  <Plus size={36} strokeWidth={1.3} />
               </div>
               <CreateTaskModal />
               <CreateColumnModal />
               <TaskDetails taskId={taskId} setTaskId={setTaskId} />
            </div>
         </DndProvider>
      </WsProvider>
   );
}
