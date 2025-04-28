import { ModalType, useModalStore } from "@/store/modal-store";
import CreateColumnModal from "./column-modal/create-column-modal";
import EditColumnModal from "./column-modal/edit-column-modal";
import InviteMemberModal from "./invite-member/invite-member-modal";
import SettingsModal from "./setttings-modal";
import CreateTaskModal from "./task-modal/create-task-modal";

export default function Modals() {
   const { type } = useModalStore();

   const renderModal = () => {
      switch (type) {
         case ModalType.PROJECT_SETTINGS:
            return <SettingsModal />;
         case ModalType.CREATE_COLUMN:
            return <CreateColumnModal />;
         case ModalType.EDIT_COLUMN:
            return <EditColumnModal />;
         case ModalType.CREATE_TASK:
            return <CreateTaskModal />;
         case ModalType.INVITE_MEMBER:
            return <InviteMemberModal />;
      }
   };

   return <div>{renderModal()}</div>;
}
