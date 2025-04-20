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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useColumn from "@/hooks/use-column";
import useToast from "@/hooks/use-toast";
import { createColumnSchema } from "@/schemas/column/create-column-schema";
import { useProjectStore } from "@/store/project-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { colors } from ".";

export default function EditColumnModal() {
   const [column, setColumn] = useState<IColumn | null>(null);
   const { getById, update } = useColumn();
   const store = useProjectStore();
   const { toast } = useToast();

   useEffect(() => {
      if (!store.column.modal.isOpen) return;
      const columnId = store.column.modal.column_id;
      if (!columnId) return;

      const column = getById(columnId);
      setColumn(column);
   }, [store.column.modal, getById]);

   const form = useForm({
      resolver: zodResolver(createColumnSchema),
      values: {
         name: column?.name ?? "",
         color: column?.color ?? "",
      },
   });

   const onSubmit = async (data: z.infer<typeof createColumnSchema>) => {
      if (!store.project) return;
      const columnId = store.column.modal.column_id;
      if (!columnId) return;

      update({ ...data, id: columnId }, (error) => {
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
                     <DialogTitle>Edit Column</DialogTitle>
                     <DialogDescription>Edit the column</DialogDescription>
                  </DialogHeader>
                  <FormField
                     control={form.control}
                     name='name'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Input placeholder='Name' {...field} />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name='color'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Color</FormLabel>
                           <FormControl>
                              <div className='grid grid-cols-7 justify-items-center gap-2 mr-auto'>
                                 {colors.map((color) => (
                                    <div
                                       key={color.color}
                                       onClick={() => field.onChange(color.color)}
                                       style={{
                                          backgroundColor: `${color.color}50`,
                                          borderColor: color.color,
                                       }}
                                       className='w-8 aspect-square rounded-md border-2 flex items-center justify-center border-dashed cursor-pointer'>
                                       {field.value === color.color && (
                                          <div
                                             className='w-3 aspect-square rounded'
                                             style={{ backgroundColor: color.color }}></div>
                                       )}
                                    </div>
                                 ))}
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
                        Update
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
