import Invitations from "@/components/invitations";
import Projects from "@/components/project/projects";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { Bell } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Home() {
   const { invitations } = useAuthStore();

   return (
      <>
         <Helmet>
            <title>Kanban</title>
         </Helmet>
         <div className='min-h-screen bg-background flex flex-col'>
            <header className='w-full p-4 border-b flex items-center justify-between bg-card/50'>
               <h1 className='text-2xl font-bold'>Kanban</h1>
               <div className='flex items-center gap-2'>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant='outline' size='icon' className='relative'>
                           <Bell className='h-[1.2rem] w-[1.2rem]' />
                           {invitations.length > 0 && (
                              <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                                 {invitations.length}
                              </span>
                           )}
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align='end' className='w-80'>
                        <div className='p-2'>
                           <h3 className='text-lg font-semibold mb-2 px-2'>Invitations</h3>
                           <Invitations />
                        </div>
                     </DropdownMenuContent>
                  </DropdownMenu>
                  <ThemeToggle />
               </div>
            </header>
            <main className='flex-1 py-8 px-4 md:px-8 flex flex-col items-center'>
               <div className='max-w-md w-full'>
                  <div className='mb-3'>
                     <h2 className='text-2xl font-bold text-foreground/90'>Projects</h2>
                  </div>
                  <Projects />
               </div>
            </main>
         </div>
      </>
   );
}
