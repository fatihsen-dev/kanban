import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectStore } from "@/store/project-store";
import { Ellipsis } from "lucide-react";
import { useRef } from "react";
import { useDrag } from "react-dnd";

interface TaskProps {
   task: Task;
   column_id: string;
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export const TypeName = "TASK";

export default function Task({ task, column_id, taskId, setTaskId }: TaskProps) {
   const store = useProjectStore();

   const ref = useRef<HTMLDivElement>(null);

   const [{ isDragging }, drag] = useDrag(() => ({
      type: TypeName,
      item: { ...task, column_id },
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   drag(ref);

   return (
      <div
         ref={ref}
         className={`bg-white border-2 border-dashed border-gray-300 rounded-md p-4 transition-colors ${
            isDragging ? "opacity-50 cursor-move" : "opacity-100 cursor-move"
         }`}>
         <div className='flex items-center gap-2 justify-between'>
            <button
               onClick={() => setTaskId(task.id)}
               className={`hover:underline cursor-pointer ${taskId === task.id ? "text-blue-500" : ""}`}>
               {task.title}
            </button>
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
                     onClick={() => store.task.remove(task.id)}>
                     Delete
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
}
