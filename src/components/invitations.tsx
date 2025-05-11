import { useMutation } from "@/hooks/use-mutation";
import useToast from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export default function Invitations() {
   const { toast } = useToast();
   const navigate = useNavigate();
   const { invitations, setInvitations } = useAuthStore();

   const updateStatusMutation = useMutation<IInvitation, IInvitationUpdateStatusRequest>();
   const { data, isLoading, error } = useQuery<ISuccessResponse<IInvitation[]>, AxiosError<IErrorResponse>>({
      queryKey: ["invitations"],
      retry: false,
   });

   const handleUpdateStatus = (invitation: IInvitation, status: IInvitationStatus) => {
      updateStatusMutation.mutate(
         {
            url: `/invitations/${invitation.id}`,
            method: "PUT",
            payload: { status },
         },
         {
            onSuccess: () => {
               setInvitations([]);
               if (status === "accepted") {
                  navigate(`/${invitation.project.id}`);
               }
            },
            onError: (error) => {
               toast(error.response?.data.message || "Something went wrong", "error");
            },
         }
      );
   };

   useEffect(() => {
      if (data?.success) {
         setInvitations(data.data!);
      }
   }, [data, setInvitations]);

   if (isLoading) {
      return <div className='py-2 px-4 text-sm text-muted-foreground'>Loading invitations...</div>;
   }

   if (error) {
      return <div className='py-2 px-4 text-sm text-red-500'>Error: {error.message}</div>;
   }

   return (
      <div className='flex flex-col gap-2'>
         {invitations.length === 0 ? (
            <p className='text-sm text-muted-foreground py-1 px-2'>No pending invitations</p>
         ) : (
            <ul className='w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto'>
               {invitations.map((invitation, index) => {
                  return (
                     <li
                        key={index}
                        className='py-2 w-full px-3 rounded-md flex justify-between items-start bg-muted/50 hover:bg-accent/50 transition-colors border border-border/40'>
                        <div className='text-sm'>
                           <span className='font-medium text-primary'>{invitation.inviter.name}</span>
                           <span className='text-foreground'> invited you to join </span>
                           <span className='font-medium text-primary'>{invitation.project.name}</span>
                        </div>
                        <div className='flex justify-end items-center gap-1 ml-2'>
                           <Button
                              className='p-0 h-6 w-6'
                              variant='outline'
                              size='icon'
                              onClick={() => handleUpdateStatus(invitation, "accepted")}>
                              <Check className='h-3 w-3 text-green-500' />
                           </Button>
                           <Button
                              className='p-0 h-6 w-6'
                              variant='outline'
                              size='icon'
                              onClick={() => handleUpdateStatus(invitation, "rejected")}>
                              <X className='h-3 w-3 text-red-500' />
                           </Button>
                        </div>
                     </li>
                  );
               })}
            </ul>
         )}
      </div>
   );
}
