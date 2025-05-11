import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useRoleGuard from "@/hooks/use-role-guard";
import useTask from "@/hooks/use-task";
import useToast from "@/hooks/use-toast";
import formatDate from "@/lib/format-date";
import { Ellipsis } from "lucide-react";
import { useRef } from "react";
import { useDrag } from "react-dnd";
import RoleGuard from "../role-guard";

interface TaskProps {
   task: ITask;
   column_id: string;
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export const TypeName = "TASK";

export default function Task({ task, column_id, taskId, setTaskId }: TaskProps) {
   const { isAllowed } = useRoleGuard(["owner", "admin", "write"]);
   const { toast } = useToast();
   const { remove } = useTask();

   const ref = useRef<HTMLDivElement>(null);

   const [{ isDragging }, drag] = useDrag(() => ({
      type: TypeName,
      item: { ...task, column_id },
      collect: (monitor) => ({
         isDragging: monitor.isDragging(),
      }),
   }));

   const removeTask = () => {
      remove(task.id, (error) => {
         if (error) {
            toast(error, "error");
         }
      });
   };

   drag(ref);

   return (
      <div
         ref={isAllowed ? ref : null}
         className={`bg-muted/50 border-2 border-dashed rounded-md p-2 px-3 transition-colors ${
            isDragging ? "opacity-50" : "opacity-100"
         } ${isAllowed ? "cursor-move" : ""}`}>
         <div className='flex items-center gap-2 justify-between'>
            <span className='text-xs text-gray-500/60'>{formatDate(task.created_at)}</span>
            <RoleGuard roles={["owner", "admin", "write"]}>
               <DropdownMenu>
                  <DropdownMenuTrigger className='cursor-pointer'>
                     <Ellipsis className='w-full! h-full!' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='left' align='start' sideOffset={0} alignOffset={0}>
                     <DropdownMenuLabel>Task</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className='cursor-pointer' variant='destructive' onClick={removeTask}>
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </RoleGuard>
         </div>
         <button
            onClick={() => setTaskId(task.id)}
            className={`hover:underline cursor-pointer ${taskId === task.id ? "text-blue-500" : ""}`}>
            {task.title}
         </button>
      </div>
   );
}
