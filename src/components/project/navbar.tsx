import { ModalType, useModalStore } from "@/store/modal-store";
import { useProjectStore } from "@/store/project-store";
import { Settings, UserPlus } from "lucide-react";
import { AvatarGroup, User } from "../ui/avatar-group";
import { Button } from "../ui/button";

const users: User[] = [
   { id: "1", name: "Fatih Sen", image: "https://github.com/fatihsen-dev.png", status: "online" },
   { id: "2", name: "Fatih Sen", image: "https://github.com/fatihsen-dev.png", status: "offline" },
   { id: "3", name: "Fatih Sen", image: "https://github.com/fatihsen-dev.png", status: "online" },
   { id: "4", name: "Fatih Sen", image: "https://github.com/fatihsen-dev.png", status: "offline" },
   { id: "5", name: "Fatih Sen", image: "https://github.com/fatihsen-dev.png", status: "offline" },
   { id: "6", name: "Fatih Sen", image: "https://github.com/fatihsen-dev.png", status: "online" },
];

export default function Navbar() {
   const { project } = useProjectStore();
   const { setIsOpen } = useModalStore();

   return (
      <div className='flex items-center justify-between border-2 border-dashed border-gray-300 rounded-md px-4 py-2'>
         <div className='flex items-center gap-2'>
            <h1 className='text-xl font-bold'>{project?.name}</h1>
         </div>
         <div className='flex items-center gap-3'>
            <AvatarGroup users={users} />
            <Button variant='outline' size='icon'>
               <UserPlus />
            </Button>
            <Button variant='outline' size='icon' onClick={() => setIsOpen(true, ModalType.PROJECT_SETTINGS)}>
               <Settings />
            </Button>
         </div>
      </div>
   );
}
