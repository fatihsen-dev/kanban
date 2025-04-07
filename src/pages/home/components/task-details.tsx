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
import useTask from "@/hooks/useTask";

import { useEffect, useState } from "react";

interface TaskDetailsProps {
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export default function TaskDetails({ taskId, setTaskId }: TaskDetailsProps) {
   const { getById } = useTask();
   const [isOpen, setIsOpen] = useState(false);
   const [task, setTask] = useState<Task | null>(null);
   useEffect(() => {
      if (taskId) {
         const task = getById(taskId);
         if (task) {
            setTask(task);
            setIsOpen(true);
         }
      }
   }, [taskId]);

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
