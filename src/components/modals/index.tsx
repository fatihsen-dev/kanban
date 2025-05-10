import { checkRoleAccess } from "@/hooks/use-role-guard";
import { useAuthStore } from "@/store/auth-store";
import { ModalType, useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import CreateColumnModal from "./column-modal/create-column-modal";
import EditColumnModal from "./column-modal/edit-column-modal";
import InviteMemberModal from "./invite-member/invite-member-modal";
import CreateProjectModal from "./project-modal/create-project-modal";
import SettingsModal from "./setttings-modal";
import CreateTaskModal from "./task-modal/create-task-modal";

export default function Modals() {
   const { authMember } = useAuthStore();
   const { type, setIsOpen } = useModalStore();
   const { project } = useProjectStore();

   const renderWithAccess = (component: React.ReactNode, roles: IProjectAccessRole[]) => {
      if (checkRoleAccess(roles, authMember!, project!)) {
         return component;
      } else {
         setIsOpen(false, null);
         return null;
      }
   };

   return (() => {
      switch (type) {
         case ModalType.PROJECT_SETTINGS:
            return renderWithAccess(<SettingsModal />, ["owner", "admin"]);
         case ModalType.CREATE_COLUMN:
            return renderWithAccess(<CreateColumnModal />, ["admin", "owner"]);
         case ModalType.EDIT_COLUMN:
            return renderWithAccess(<EditColumnModal />, ["admin", "owner"]);
         case ModalType.CREATE_TASK:
            return renderWithAccess(<CreateTaskModal />, ["admin", "write", "owner"]);
         case ModalType.INVITE_MEMBER:
            return renderWithAccess(<InviteMemberModal />, ["admin", "owner"]);
         case ModalType.CREATE_PROJECT:
            return <CreateProjectModal />;
      }
   })();
}
