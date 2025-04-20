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
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface TaskDetailsProps {
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export default function TaskDetails({ taskId, setTaskId }: TaskDetailsProps) {
   const { project } = useProjectStore();
   const [isOpen, setIsOpen] = useState(false);
   const [task, setTask] = useState<ITask | null>(null);
   const { toast } = useToast();

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
         <DrawerContent>
            <DrawerHeader>
               <DrawerTitle>{task?.title}</DrawerTitle>
               <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
               <Button>Button</Button>
               <DrawerClose></DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
