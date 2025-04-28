import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum ModalType {
   PROJECT_SETTINGS = "project-settings",
   INVITE_MEMBER = "invite-member",
   CREATE_TASK = "create-task",
   CREATE_COLUMN = "create-column",
   EDIT_COLUMN = "edit-column",
}

interface State {
   type: ModalType | null;
   isOpen: boolean;
   setIsOpen: (isOpen: boolean, type: ModalType | null, options?: { data?: unknown }) => void;
   data: unknown;
   setData: (data: unknown) => void;
}

export const useModalStore = create<State>()(
   devtools(
      (set) => ({
         isOpen: false,
         type: null,
         data: null,
         setIsOpen: (isOpen, type, options) => set({ isOpen, type, data: isOpen ? options?.data : null }),
         setData: (data) => set({ data }),
      }),
      {
         name: "modal-store",
      }
   )
);
