import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useRoleGuard from "@/hooks/use-role-guard";
import { useModalStore } from "@/store/modal-store";
import Info from "./info";
import Members from "./members";
import Teams from "./teams";

export default function SettingsModal() {
   const { isAllowed } = useRoleGuard(["owner"]);
   const { isOpen, setIsOpen } = useModalStore();

   const tabs = [
      {
         label: "Project Info",
         value: "project-info",
         component: <Info />,
         isAllowed: true,
      },
      {
         label: "Members",
         value: "members",
         component: <Members />,
         isAllowed: isAllowed,
      },
      {
         label: "Teams",
         value: "teams",
         component: <Teams />,
         isAllowed: isAllowed,
      },
   ];

   return (
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false, null)}>
         <DialogContent className='sm:max-w-2xl min-h-[500px]'>
            <div className='space-y-4 flex flex-col flex-1'>
               <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
               </DialogHeader>
               <Tabs defaultValue='project-info' className='w-full flex flex-row gap-5 p-0 flex-1'>
                  <TabsList className='flex flex-col !bg-transparent h-auto gap-2 !p-0 min-w-36 rounded-sm mb-auto'>
                     {tabs
                        .filter((tab) => tab.isAllowed)
                        .map((tab) => (
                           <TabsTrigger
                              key={tab.value}
                              className='w-full rounded-sm !shadow-none border !bg-muted/40 border-foreground/10 justify-start cursor-pointer data-[state=active]:!bg-cyan-700 data-[state=active]:!text-white !transition-none'
                              value={tab.value}>
                              {tab.label}
                           </TabsTrigger>
                        ))}
                  </TabsList>
                  {tabs
                     .filter((tab) => tab.isAllowed)
                     .map((tab) => (
                        <TabsContent key={tab.value} value={tab.value}>
                           {tab.component}
                        </TabsContent>
                     ))}
               </Tabs>
            </div>
         </DialogContent>
      </Dialog>
   );
}
