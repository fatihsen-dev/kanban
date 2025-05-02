import { useMutation } from "@/hooks/use-mutation";
import useToast from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loading from "./loading";
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
            method: "POST",
            payload: { status },
         },
         {
            onSuccess: () => {
               navigate(`/${invitation.project.id}`);
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
      return <Loading />;
   }

   if (error) {
      return <div>Error: {error.message}</div>;
   }

   return (
      <div className='flex flex-col gap-4 fixed top-2 right-2 p-2 bg-gray-100 border border-gray-200 rounded-sm max-w-md w-full'>
         <h3 className='text-xl font-bold mx-auto'>Notifications</h3>
         <ul className='w-full flex flex-col gap-2'>
            {invitations.map((invitation) => {
               return (
                  <li
                     key={invitation.id}
                     className='py-2 w-full px-4 rounded-md flex justify-between items-start bg-white'>
                     <div>
                        <span className='text-blue-500'>{invitation.inviter.name}</span>
                        {" invited you to join "}
                        <span className='text-blue-500'>{invitation.project.name}</span>
                     </div>
                     <div className='flex justify-end items-center gap-2'>
                        <Button
                           className='p-0 h-7 w-7 text-green-500'
                           variant='outline'
                           size='icon'
                           onClick={() => handleUpdateStatus(invitation, "accepted")}>
                           <Check />
                        </Button>
                        <Button
                           className='p-0 h-7 w-7 text-red-500'
                           variant='outline'
                           size='icon'
                           onClick={() => handleUpdateStatus(invitation, "rejected")}>
                           <X />
                        </Button>
                     </div>
                  </li>
               );
            })}
         </ul>
      </div>
   );
}
