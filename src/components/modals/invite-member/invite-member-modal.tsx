import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@/hooks/use-mutation";
import useToast from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

export default function InviteMemberModal() {
   const [val, setVal] = useState("");
   const [value, setValue] = useState("");
   const [users, setUsers] = useState<IUser[]>([]);
   const { toast } = useToast();
   const { setIsOpen, isOpen } = useModalStore();
   const { user } = useAuthStore();
   const { project } = useProjectStore();
   const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
   const inviteMutation = useMutation<ISuccessResponse<IUser>, IInvitationCreateRequest>();

   const addSelectedUser = (user: IUser) => {
      if (!selectedUsers.some((u) => u.id === user.id)) {
         setSelectedUsers([...selectedUsers, user]);
      }
   };

   const removeSelectedUser = (user: IUser) => {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (selectedUsers.length === 0) {
         toast("Please select at least one user", "error");
         return;
      }

      inviteMutation.mutate(
         {
            url: `/invitations`,
            method: "POST",
            payload: {
               invitee_ids: selectedUsers.map((u) => u.id),
               project_id: project!.id,
               message: "You are invited to join the project",
            },
         },
         {
            onSuccess: () => {
               toast("Invitation sent successfully", "success");
               setIsOpen(false, null);
            },
            onError: (error) => {
               toast(error.response?.data.message ?? "Error inviting member", "error");
            },
         }
      );
   };

   useDebounce(
      () => {
         setValue(val);
         setUsers([]);
         setSelectedUsers([]);
      },
      350,
      [val]
   );

   const { data, error } = useQuery<ISuccessResponse<IUser[]>, AxiosError<IErrorResponse>>({
      queryKey: [`users?query=${value}`],
      retry: false,
      enabled: value.trim().length >= 3,
   });

   useEffect(() => {
      if (data?.success) {
         setUsers(data.data!.filter((u) => u.id !== user?.id));
      }
   }, [data]);

   useEffect(() => {
      if (val.trim().length < 3) {
         setUsers([]);
      }
   }, [val]);

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
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
               <DialogHeader>
                  <DialogTitle>Invite Member</DialogTitle>
                  <DialogDescription>Invite a new member</DialogDescription>
               </DialogHeader>
               <div className='flex items-center'>
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
               {!!users.filter((u) => !selectedUsers.some((su) => su.id === u.id)).length && (
                  <div>
                     <ul className='flex flex-col gap-2'>
                        {users
                           .filter((u) => !selectedUsers.some((su) => su.id === u.id))
                           .map((user) => (
                              <li key={user.id} className='flex items-center gap-2'>
                                 <div className='flex items-center gap-2'>
                                    <Avatar>
                                       <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                       <p className='text-sm font-medium'>{user.name}</p>
                                       <p className='text-sm text-gray-500'>{user.email}</p>
                                    </div>
                                 </div>
                                 <Button
                                    onClick={() => {
                                       if (selectedUsers.some((u) => u.id === user.id)) removeSelectedUser(user);
                                       else addSelectedUser(user);
                                    }}
                                    type='button'
                                    className='ml-auto'
                                    variant='outline'
                                    size='icon'>
                                    {selectedUsers.some((u) => u.id === user.id) ? <Trash /> : <Plus />}
                                 </Button>
                              </li>
                           ))}
                     </ul>
                  </div>
               )}
               {selectedUsers.length > 0 && (
                  <div className='flex flex-col gap-2 bg-blue-100 border border-blue-200 p-2 rounded-md'>
                     <h3 className='text-sm font-medium'>Selected Members</h3>
                     <ul>
                        {selectedUsers.map((user) => (
                           <li key={user.id} className='flex items-center gap-2'>
                              <Avatar>
                                 <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className='flex flex-col'>
                                 <p className='text-sm font-medium'>{user.name}</p>
                                 <p className='text-sm text-gray-500'>{user.email}</p>
                              </div>
                              <Button
                                 onClick={() => removeSelectedUser(user)}
                                 type='button'
                                 className='ml-auto'
                                 variant='outline'
                                 size='icon'>
                                 <Trash />
                              </Button>
                           </li>
                        ))}
                     </ul>
                  </div>
               )}
               <Button disabled={selectedUsers.length === 0} type='submit' className='w-full ml-auto'>
                  Invite
               </Button>
            </form>
         </DialogContent>
      </Dialog>
   );
}
