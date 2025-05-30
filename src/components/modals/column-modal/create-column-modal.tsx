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
import { useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const columnColors = [
   {
      color: "#fb2c36",
   },
   {
      color: "#00c951",
   },
   {
      color: "#2b7fff",
   },
   {
      color: "#ad46ff",
   },
];

export default function CreateColumnModal() {
   const { create } = useColumn();
   const store = useProjectStore();
   const { toast } = useToast();
   const { setIsOpen, isOpen } = useModalStore();

   const form = useForm({
      resolver: zodResolver(createColumnSchema),
      defaultValues: {
         name: "",
         color: undefined,
      },
   });

   const onSubmit = async (data: z.infer<typeof createColumnSchema>) => {
      if (!store.project) return;

      create({ ...data, project_id: store.project.id }, (error) => {
         if (error) {
            toast(error, "error");
         } else {
            form.reset();
            setIsOpen(false, null);
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
                  <FormField
                     control={form.control}
                     name='color'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Color</FormLabel>
                           <FormControl>
                              <div className='grid grid-cols-7 justify-items-center gap-2 mr-auto'>
                                 <div
                                    onClick={() => field.onChange(undefined)}
                                    className='w-8 aspect-square rounded-md border-2 flex items-center justify-center border-dashed cursor-pointer text-muted-foreground border-muted-foreground'>
                                    {field.value === undefined && (
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
                        Create
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
