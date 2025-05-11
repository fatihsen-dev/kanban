import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useTask from "@/hooks/use-task";
import useToast from "@/hooks/use-toast";
import { useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";

export default function CreateTaskModal() {
   const { toast } = useToast();
   const { create } = useTask();
   const store = useProjectStore();
   const { setIsOpen, data, isOpen } = useModalStore();

   const [title, setTitle] = useState("");

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { column_id } = data as { column_id: string };

      if (title.trim() === "" || !column_id) return;
      if (!store.project) return;

      create({ title, column_id, project_id: store.project.id, content: null }, (error) => {
         if (error) {
            toast(error, "error");
         } else {
            setTitle("");
            setIsOpen(false, null);
         }
      });
   };

   useEffect(() => {
      if (!isOpen) {
         setTitle("");
      }
   }, [isOpen]);

   return (
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false, null)}>
         <DialogContent className='sm:max-w-md'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Create Task</DialogTitle>
                  <DialogDescription>Create a new task</DialogDescription>
               </DialogHeader>
               <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-2'>
                     <Label htmlFor='title' className='sr-only'>
                        Title
                     </Label>
                     <Input id='title' value={title} onInput={(e) => setTitle(e.currentTarget.value)} />
                  </div>
               </div>
               <DialogFooter className='sm:justify-end'>
                  <DialogClose asChild>
                     <Button type='button' variant='secondary'>
                        Close
                     </Button>
                  </DialogClose>
                  <Button disabled={title.trim() === ""} type='submit'>
                     Create
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
