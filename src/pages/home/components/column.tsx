import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useDataStore from "@/store/data";
import { Ellipsis } from "lucide-react";
import { useDrop } from "react-dnd";
import Task, { TypeName } from "./task";

interface ColumnProps {
   column: Column;
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export default function Column({ column, taskId, setTaskId }: ColumnProps) {
   const store = useDataStore();

   const [{ isOver }, drop] = useDrop(() => ({
      accept: TypeName,
      drop: ({ column_id, ...task }: Task & { column_id: string }) => {
         store.task.move(column_id, column.id, task);
      },
      collect: (monitor) => ({
         isOver: monitor.isOver(),
      }),
   }));

   return (
      <div
         ref={drop as unknown as React.RefObject<HTMLDivElement>}
         className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 min-w-96 h-full flex flex-col gap-4 transition-colors ${
            isOver ? "bg-gray-200" : ""
         }`}>
         <div className='flex flex-col w-full'>
            <div className='w-full flex tasks-center justify-between gap-2'>
               <h2 className='text-lg font-bold'>{column.title}</h2>
               <DropdownMenu>
                  <DropdownMenuTrigger className='cursor-pointer'>
                     <Ellipsis className='w-full! h-full!' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='left' align='start' sideOffset={0} alignOffset={0}>
                     <DropdownMenuLabel>Column</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        className='cursor-pointer'
                        variant='destructive'
                        onClick={() => store.column.remove(column.id)}>
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
            <span className='text-sm text-gray-500'>{column.tasks.length} tasks</span>
         </div>
         <div className='flex flex-col gap-2 flex-1'>
            {column.tasks.map((task) => (
               <Task key={task.id} column_id={column.id} task={task} taskId={taskId} setTaskId={setTaskId} />
            ))}
         </div>
         <div className='flex justify-between tasks-center border-t border-gray-300 pt-4'>
            <Button size='lg' variant='outline' className='w-full' onClick={() => store.task.modal.toggle(column.id)}>
               Add Task
            </Button>
         </div>
      </div>
   );
}
