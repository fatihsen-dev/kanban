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
import { editColumnSchema } from "@/schemas/column/edit-column-schema";
import { useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { columnColors } from "./create-column-modal";

export default function EditColumnModal() {
   const [column, setColumn] = useState<IColumn | null>(null);
   const { getById, update } = useColumn();
   const store = useProjectStore();
   const { toast } = useToast();
   const { setIsOpen, data, isOpen } = useModalStore();

   useEffect(() => {
      if (!isOpen) return;
      const { column_id } = data as { column_id: string };
      if (!column_id) return;

      const column = getById(column_id);
      setColumn(column);
   }, [isOpen, data, getById]);

   const form = useForm({
      resolver: zodResolver(editColumnSchema),
      values: {
         name: column?.name ?? "",
         color: column?.color ?? "",
      },
   });

   const onSubmit = async (values: z.infer<typeof editColumnSchema>) => {
      if (!store.project) return;
      const { column_id } = data as { column_id: string };
      if (!column_id) return;

      update({ ...values, id: column_id }, (error) => {
         if (error) {
            toast(error, "error");
         } else {
            setIsOpen(false, null);
            form.reset();
         }
      });
   };

   useEffect(() => {
      if (!isOpen) {
         form.reset();
      }
   }, [isOpen, form]);

   return (
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false, null)}>
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
                                 <div
                                    onClick={() => field.onChange("")}
                                    className='w-8 aspect-square rounded-md border-2 flex items-center justify-center border-dashed cursor-pointer text-muted-foreground border-muted-foreground'>
                                    {field.value === "" && (
                                       <div className='w-3 aspect-square rounded bg-muted-foreground'></div>
                                    )}
                                 </div>
                                 {columnColors.map((color) => (
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
