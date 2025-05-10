import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
} from "@/components/ui/drawer";
import useTask from "@/hooks/use-task";
import useToast from "@/hooks/use-toast";
import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Editor from "./editor";

interface TaskDetailsProps {
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export default function TaskDetails({ taskId, setTaskId }: TaskDetailsProps) {
   const { project } = useProjectStore();
   const [isOpen, setIsOpen] = useState(false);
   const [task, setTask] = useState<ITask | null>(null);
   const { toast } = useToast();
   const { update } = useTask();
   const { data, isLoading, error } = useQuery<ISuccessResponse<ITask>, AxiosError<IErrorResponse>>({
      queryKey: [`projects/${project?.id}/tasks/${taskId}`],
      retry: false,
      enabled: !!taskId,
   });

   useEffect(() => {
      if (data?.success) {
         setTask(data.data!);
         setIsOpen(true);
      }
   }, [data]);

   useEffect(() => {
      if (error) {
         toast(error.response?.data.message || "Something went wrong", "error");
      }
   }, [error, toast]);

   const updateTask = () => {
      if (!task) return;
      update(task, (error) => {
         if (error) {
            toast(error, "error");
         }
      });
   };

   const setContent = (value: string) => {
      if (!task) return;
      setTask({ ...task, content: value });
   };

   if (!taskId) return null;

   if (isLoading) {
      return <Loading />;
   }

   return (
      <Drawer
         direction='right'
         open={isOpen}
         onOpenChange={() => {
            setTaskId(null);
            setIsOpen(false);
         }}>
         <DrawerContent data-vaul-no-drag className='min-w-2xl w-full p-6 gap-4'>
            <DrawerHeader className='!p-0'>
               <DrawerTitle className='text-2xl font-bold'>{task?.title}</DrawerTitle>
               <DrawerDescription>Created: {formatDate(task?.created_at)}</DrawerDescription>
            </DrawerHeader>
            <div className='flex flex-col gap-4 p-1 overflow-auto'>
               <Editor value={task?.content || ""} setValue={setContent} />
            </div>
            <DrawerFooter className='!p-0'>
               <Button onClick={updateTask}>Update</Button>
               <DrawerClose></DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
