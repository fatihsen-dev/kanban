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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useColumn from "@/hooks/use-column";
import useToast from "@/hooks/use-toast";
import { createColumnSchema } from "@/schemas/column/create-column-schema";
import { useProjectStore } from "@/store/project-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateColumnModal() {
   const { create } = useColumn();
   const store = useProjectStore();
   const { toast } = useToast();

   const form = useForm({
      resolver: zodResolver(createColumnSchema),
      defaultValues: {
         name: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof createColumnSchema>) => {
      if (!store.project) return;

      create({ ...data, project_id: store.project.id }, (error) => {
         if (error) {
            toast(error, "error");
         } else {
            store.column.modal.close();
            form.reset();
         }
      });
   };

   useEffect(() => {
      if (!store.column.modal.isOpen) {
         form.reset();
      }
   }, [store.column.modal.isOpen, form]);

   return (
      <Dialog open={store.column.modal.isOpen} onOpenChange={store.column.modal.close}>
         <DialogContent className='sm:max-w-md'>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  <DialogHeader>
                     <DialogTitle>Create Column</DialogTitle>
                     <DialogDescription>Create a new column</DialogDescription>
                  </DialogHeader>
                  <FormField
                     control={form.control}
                     name='name'
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className='relative'>
                                 <Input placeholder='Name' {...field} />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <DialogFooter className='sm:justify-end'>
                     <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                           Close
                        </Button>
                     </DialogClose>
                     <Button disabled={form.formState.isSubmitting} type='submit'>
                        Create
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
