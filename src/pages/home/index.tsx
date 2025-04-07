import useDataStore from "@/store/data";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import Column from "./components/column";
import CreateColumnModal from "./components/create-column-modal";
import CreateTaskModal from "./components/create-task-modal";
import TaskDetails from "./components/task-details";

export default function Home() {
   const [taskId, setTaskId] = useQueryState("taskId");
   const store = useDataStore();

   return (
      <div className='flex p-4 gap-4 h-screen'>
         <div
            className='grid gap-4 h-full'
            style={{
               gridTemplateColumns: `repeat(${store.data.length}, 1fr)`,
            }}>
            {store.data.map((column) => (
               <Column key={column.id} column={column} taskId={taskId} setTaskId={setTaskId} />
            ))}
         </div>
         <div
            onClick={store.column.modal.toggle}
            className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center transition-all hover:bg-gray-100 cursor-pointer text-gray-700'>
            <Plus size={46} strokeWidth={1.3} />
         </div>
         <CreateTaskModal />
         <CreateColumnModal />
         <TaskDetails taskId={taskId} setTaskId={setTaskId} />
      </div>
   );
}
