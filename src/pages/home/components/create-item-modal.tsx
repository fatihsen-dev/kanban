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
import useDataStore from "@/store/data";
import { useEffect, useState } from "react";

export default function CreateItemModal() {
   const store = useDataStore();

   const [title, setTitle] = useState("");

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (title.trim() === "" || !store.item.modal.column_id) return;

      store.item.add(store.item.modal.column_id, { title });
      setTitle("");
      store.item.modal.close();
   };

   useEffect(() => {
      if (!store.item.modal.isOpen) {
         setTitle("");
      }
   }, [store.item.modal.isOpen]);

   return (
      <Dialog open={store.item.modal.isOpen} onOpenChange={() => store.item.modal.toggle(store.item.modal.column_id)}>
         <DialogContent className='sm:max-w-md'>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Create Item</DialogTitle>
                  <DialogDescription>Create a new item</DialogDescription>
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
