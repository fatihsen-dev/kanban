import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsModalProps {
   isOpen: boolean;
   onOpenChange: (isOpen: boolean) => void;
}

export default function SettingsModal({ isOpen, onOpenChange }: SettingsModalProps) {
   return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
         <DialogContent className='sm:max-w-2xl min-h-[500px]'>
            <div className='space-y-4 flex flex-col flex-1'>
               <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
               </DialogHeader>
               <Tabs defaultValue='project-info' className='w-full flex flex-row p-0 flex-1'>
                  <TabsList className='flex flex-col h-auto p-1 min-w-36 rounded-sm mb-auto'>
                     <TabsTrigger
                        className='w-full shadow-none! rounded-sm justify-start cursor-pointer'
                        value='project-info'>
                        Project Info
                     </TabsTrigger>
                     <TabsTrigger
                        className='w-full shadow-none! rounded-sm justify-start cursor-pointer'
                        value='manage-access'>
                        Manage Access
                     </TabsTrigger>
                  </TabsList>
                  <TabsContent className='bg-muted rounded-sm p-2' value='project-info'>
                     Make changes to your project here.
                  </TabsContent>
                  <TabsContent className='bg-muted rounded-sm p-2' value='manage-access'>
                     Manage access to your project here.
                  </TabsContent>
               </Tabs>
            </div>
         </DialogContent>
      </Dialog>
   );
}
