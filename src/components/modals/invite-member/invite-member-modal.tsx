import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useToast from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { useModalStore } from "@/store/modal-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

export default function InviteMemberModal() {
   const [val, setVal] = useState("");
   const [value, setValue] = useState("");
   const [users, setUsers] = useState<IUser[]>([]);
   const { toast } = useToast();
   const { setIsOpen, isOpen } = useModalStore();
   const { user } = useAuthStore();

   const inviteMember = (user: IUser) => {
      console.log(user);
      toast(`${user.name} invited to the project`, "success");
   };

   useDebounce(
      () => {
         setValue(val);
      },
      350,
      [val]
   );

   const { data, error } = useQuery<ISuccessResponse<IUser[]>, AxiosError<IErrorResponse>>({
      queryKey: [`users?query=${value}`],
      retry: false,
      enabled: value.trim().length > 3,
   });

   useEffect(() => {
      if (data?.success) {
         setUsers(data.data!.filter((u) => u.id !== user?.id));
      }
   }, [data]);

   useEffect(() => {
      if (error) {
         toast(error.response?.data.message ?? "Error fetching users", "error");
      }
   }, [error, toast]);

   useEffect(() => {
      if (!isOpen) {
         setVal("");
         setValue("");
         setUsers([]);
      }
   }, [isOpen]);

   return (
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false, null)}>
         <DialogContent className='sm:max-w-md'>
            <div className='flex flex-col gap-4'>
               <DialogHeader>
                  <DialogTitle>Invite Member</DialogTitle>
                  <DialogDescription>Invite a new member</DialogDescription>
               </DialogHeader>
               <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-1.5'>
                     <Input
                        placeholder='Enter email address or name'
                        value={val}
                        onInput={(e) => setVal(e.currentTarget.value)}
                     />
                     {val.trim().length < 3 && (
                        <span className='text-xs pl-1 text-gray-500'>Please enter at least 3 characters to search</span>
                     )}
                  </div>
               </div>
               {!!users.length && (
                  <div className='flex flex-col gap-2'>
                     {users.map((user) => (
                        <div key={user.id} className='flex items-center gap-2'>
                           <div className='flex items-center gap-2'>
                              <Avatar>
                                 <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className='flex flex-col'>
                                 <p className='text-sm font-medium'>{user.name}</p>
                                 <p className='text-sm text-gray-500'>{user.email}</p>
                              </div>
                           </div>
                           <Button onClick={() => inviteMember(user)} className='ml-auto' variant='outline' size='icon'>
                              <Plus />
                           </Button>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}
