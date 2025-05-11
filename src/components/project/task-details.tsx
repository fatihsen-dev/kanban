import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
   Drawer,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
} from "@/components/ui/drawer";
import useTask from "@/hooks/use-task";
import useTheme from "@/hooks/use-theme";
import useToast from "@/hooks/use-toast";
import formatDate from "@/lib/format-date";
import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Input } from "../ui/input";
import Editor from "./markdown/editor";
import Preview from "./markdown/preview";

interface TaskDetailsProps {
   taskId: string | null;
   setTaskId: (taskId: string | null) => void;
}

export default function TaskDetails({ taskId, setTaskId }: TaskDetailsProps) {
   const { project } = useProjectStore();
   const [isOpen, setIsOpen] = useState(false);
   const [task, setTask] = useState<ITask | null>(null);
   const [updatableTask, setUpdatableTask] = useState<ITask | null>(null);
   const { toast } = useToast();
   const [isLoading, setIsLoading] = useState(true);
   const { update, getById } = useTask();
   const [error, setError] = useState<string | null>(null);
   const [isEditing, setIsEditing] = useState(false);
   const { theme } = useTheme();

   useEffect(() => {
      if (!taskId) return;
      const task = getById(taskId);
      if (task) {
         setTask(task);
         setUpdatableTask(task);
         setIsOpen(true);
         setIsLoading(false);
      } else {
         setError("Task not found");
         setIsLoading(false);
      }
   }, [taskId, project]);

   const updateTask = () => {
      if (!updatableTask) return;
      update(
         {
            id: updatableTask.id,
            ...(task?.title !== updatableTask.title && { title: updatableTask.title }),
            ...(task?.content !== updatableTask.content && { content: updatableTask.content }),
         },
         (error) => {
            if (error) {
               toast(error, "error");
            } else {
               toast("Task updated", "success");
               setIsEditing(false);
            }
         }
      );
   };

   const setContent = (value: string) => {
      if (!updatableTask) return;
      setUpdatableTask({ ...updatableTask, content: value });
   };

   const setTitle = (value: string) => {
      if (!updatableTask) return;
      setUpdatableTask({ ...updatableTask, title: value });
   };

   if (!taskId) return null;

   if (isLoading) {
      return <Loading />;
   }

   return (
      <>
         <Helmet>
            <title>{task?.title} - Kanban</title>
         </Helmet>
         <Drawer
            direction='right'
            open={isOpen}
            onOpenChange={() => {
               setTaskId(null);
               setIsOpen(false);
               setIsLoading(true);
               setError(null);
               setIsEditing(false);
            }}>
            <DrawerContent data-vaul-no-drag className='min-w-2xl w-full p-6 gap-4'>
               {error ? (
                  <div className='flex flex-col gap-4'>
                     <h1 className='text-2xl font-bold'>Error</h1>
                     <p>{error}</p>
                  </div>
               ) : (
                  <>
                     <DrawerHeader className='!p-0'>
                        <DrawerTitle className='text-2xl font-bold'>
                           {isEditing ? (
                              <Input
                                 type='text'
                                 value={updatableTask?.title}
                                 onChange={(e) => setTitle(e.target.value)}
                                 className='!text-xl !font-medium !h-10'
                              />
                           ) : (
                              <DrawerTitle className='text-2xl font-bold'>{updatableTask?.title}</DrawerTitle>
                           )}
                        </DrawerTitle>
                        <DrawerDescription>Created: {formatDate(updatableTask?.created_at)}</DrawerDescription>
                     </DrawerHeader>
                     <div
                        className={`flex flex-col gap-4 overflow-auto p-2 rounded-sm ${
                           isEditing ? "bg-gray-50" : "border"
                        }`}
                        data-color-mode={theme}>
                        {isEditing || !updatableTask?.content?.length ? (
                           <Editor value={updatableTask?.content || ""} setValue={setContent} extraCommands={false} />
                        ) : (
                           <Preview content={updatableTask?.content || ""} />
                        )}
                     </div>
                     <DrawerFooter className='!p-0'>
                        {isEditing ? (
                           <div className='grid grid-cols-2 gap-2'>
                              <Button variant='outline' onClick={() => setIsEditing(!isEditing)}>
                                 Cancel
                              </Button>
                              <Button onClick={updateTask}>Update</Button>
                           </div>
                        ) : (
                           <Button onClick={() => setIsEditing(!isEditing)}>Edit</Button>
                        )}
                     </DrawerFooter>
                  </>
               )}
            </DrawerContent>
         </Drawer>
      </>
   );
}
