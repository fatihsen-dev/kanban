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
import useColumn from "@/hooks/use-column";
import useToast from "@/hooks/use-toast";
import { useProjectStore } from "@/store/project-store";
import { useEffect, useState } from "react";

export default function CreateColumnModal() {
   const { create } = useColumn();
   const store = useProjectStore();
   const { toast } = useToast();
   const [name, setName] = useState("");

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (name.trim() === "" || !store.project) return;

      create({ name, project_id: store.project.id }, (error) => {
         if (error) {
            toast(error, "error");
         } else {
            setName("");
            store.column.modal.close();
         }
      });
   };

   useEffect(() => {
      if (!store.column.modal.isOpen) {
         setName("");
      }
   }, [store.column.modal.isOpen]);

   return (
      <Dialog open={store.column.modal.isOpen} onOpenChange={store.column.modal.toggle}>
         <DialogContent className='sm:max-w-md'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Create Column</DialogTitle>
                  <DialogDescription>Create a new column</DialogDescription>
               </DialogHeader>
               <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-2'>
                     <Label htmlFor='name' className='sr-only'>
                        Name
                     </Label>
                     <Input id='name' value={name} onInput={(e) => setName(e.currentTarget.value)} />
                  </div>
               </div>
               <DialogFooter className='sm:justify-end'>
                  <DialogClose asChild>
                     <Button type='button' variant='secondary'>
                        Close
                     </Button>
                  </DialogClose>
                  <Button disabled={name.trim() === ""} type='submit'>
                     Create
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
