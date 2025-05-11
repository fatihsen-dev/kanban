import { useAuthStore } from "@/store/auth-store";
import { ModalType, useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { Home, Settings, UserPlus } from "lucide-react";
import { useMemo } from "react";
import { NavLink } from "react-router";
import RoleGuard from "../role-guard";
import { AvatarGroup, User } from "../ui/avatar-group";
import { Button } from "../ui/button";

export default function Navbar() {
   const { project } = useProjectStore();
   const { authMember } = useAuthStore();
   const { setIsOpen } = useModalStore();

   const users: User[] = useMemo(
      () =>
         project?.members
            .map((member) => {
               const status = member.user.id === authMember?.user.id ? "online" : member.user.status ?? "offline";
               return {
                  id: member.user.id,
                  name: member.user.name,
                  image: "",
                  status,
               };
            })
            ?.sort((a, b) => {
               if (a.status === "online" && b.status !== "online") return -1;
               if (a.status !== "online" && b.status === "online") return 1;
               return 0;
            }) ?? [],
      [project, authMember]
   );

   const openInviteMemberModal = () => {
      setIsOpen(true, ModalType.INVITE_MEMBER);
   };

   return (
      <div className='flex items-center bg-muted/40 justify-between border-2 border-dashed rounded-md px-2.5 py-2'>
         <div className='flex items-center gap-2'>
            <NavLink to='/'>
               <Button variant='outline' size='icon'>
                  <Home />
               </Button>
            </NavLink>
            <h1 className='text-xl font-bold'>{project?.name}</h1>
         </div>
         <div className='flex items-center gap-3'>
            <AvatarGroup users={users} />
            <RoleGuard roles={["owner", "admin"]}>
               <Button onClick={openInviteMemberModal} variant='outline' size='icon'>
                  <UserPlus />
               </Button>
               <Button variant='outline' size='icon' onClick={() => setIsOpen(true, ModalType.PROJECT_SETTINGS)}>
                  <Settings />
               </Button>
            </RoleGuard>
         </div>
      </div>
   );
}
