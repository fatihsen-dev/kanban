import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccessManage from "./access-manage";
import Info from "./info";
import Members from "./members";

interface SettingsModalProps {
   isOpen: boolean;
   onOpenChange: (isOpen: boolean) => void;
}

export default function SettingsModal({ isOpen, onOpenChange }: SettingsModalProps) {
   const tabs = [
      {
         label: "Project Info",
         value: "project-info",
         component: <Info />,
      },
      {
         label: "Members",
         value: "members",
         component: <Members />,
      },
      {
         label: "Manage Access",
         value: "manage-access",
         component: <AccessManage />,
      },
   ];

   return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
         <DialogContent className='sm:max-w-2xl min-h-[500px]'>
            <div className='space-y-4 flex flex-col flex-1'>
               <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
               </DialogHeader>
               <Tabs defaultValue='project-info' className='w-full flex flex-row p-0 flex-1'>
                  <TabsList className='flex flex-col bg-gray-50 h-auto p-1 min-w-36 rounded-sm mb-auto'>
                     {tabs.map((tab) => (
                        <TabsTrigger
                           key={tab.value}
                           className='w-full shadow-none! rounded-sm justify-start cursor-pointer'
                           value={tab.value}>
                           {tab.label}
                        </TabsTrigger>
                     ))}
                  </TabsList>
                  {tabs.map((tab) => (
                     <TabsContent key={tab.value} className='bg-gray-50 rounded-sm p-2' value={tab.value}>
                        {tab.component}
                     </TabsContent>
                  ))}
               </Tabs>
            </div>
         </DialogContent>
      </Dialog>
   );
}
