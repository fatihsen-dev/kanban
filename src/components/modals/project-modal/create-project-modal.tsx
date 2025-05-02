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
import useProject from "@/hooks/use-project";
import useToast from "@/hooks/use-toast";
import { createProjectSchema } from "@/schemas/project/create-project-schema";
import { useModalStore } from "@/store/modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateProjectModal() {
   const { create } = useProject();
   const { toast } = useToast();
   const { setIsOpen, isOpen } = useModalStore();

   const form = useForm({
      resolver: zodResolver(createProjectSchema),
      defaultValues: {
         name: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof createProjectSchema>) => {
      create(data, (error) => {
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
                     <DialogTitle>Create Project</DialogTitle>
                     <DialogDescription>Create a new project</DialogDescription>
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
