import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export interface User {
   id: string;
   name: string;
   image?: string;
   status?: UserStatus;
}

interface AvatarGroupProps {
   users: User[];
   max?: number;
   size?: "sm" | "md" | "lg";
   className?: string;
}

export function AvatarGroup({ users, max = 3, size = "md", className }: AvatarGroupProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [displayUsers, setDisplayUsers] = useState<User[]>([]);
   const [remaining, setRemaining] = useState<number>(0);

   useEffect(() => {
      const sortedUsers = users.sort((a, b) => {
         if (a.status === "online" && b.status !== "online") return -1;
         if (a.status !== "online" && b.status === "online") return 1;
         return 0;
      });
      setDisplayUsers(sortedUsers.slice(0, max));
      setRemaining(sortedUsers.length - max);
   }, [users, max]);

   const sizeClasses = {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
   };

   const statusClasses: Record<UserStatus, string> = {
      online: "bg-green-500",
      offline: "bg-red-500",
   };

   return (
      <div className={cn("flex -space-x-2", className)}>
         {displayUsers.map((user) => (
            <TooltipProvider key={user.id}>
               <Tooltip>
                  <TooltipTrigger>
                     <div className='relative'>
                        <Avatar
                           title={user.name}
                           className={cn("border-2 border-background ring-0", sizeClasses[size])}>
                           {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
                           <AvatarFallback>
                              {user.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")
                                 .toUpperCase()
                                 .substring(0, 2)}
                           </AvatarFallback>
                        </Avatar>
                        {user.status && (
                           <div
                              className={cn(
                                 "absolute bottom-0 left-1 w-2 h-2 rounded-full",
                                 statusClasses[user.status]
                              )}
                           />
                        )}
                     </div>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>{user.name}</p>
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>
         ))}
         {remaining > 0 ? (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger className='relative z-10' asChild>
                  <div
                     className={cn(
                        "flex items-center cursor-pointer justify-center rounded-full bg-muted text-muted-foreground border-2 border-background",
                        sizeClasses[size]
                     )}>
                     +{remaining}
                  </div>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Users</DialogTitle>
                  </DialogHeader>
                  <div className='flex flex-col gap-2'>
                     {users.map((user) => (
                        <div
                           className='flex items-center justify-start gap-2 bg-gray-50 border border-gray-200 rounded-sm p-2'
                           key={user.id}>
                           <Avatar>
                              <AvatarImage src={""} />
                              <AvatarFallback className='bg-gray-200 text-gray-500'>
                                 {user.name.charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div className='flex flex-col leading-[1.2rem]'>
                              <span>{user.name}</span>
                              <span
                                 className={`text-xs text-gray-500 ${
                                    user.status === "online" ? "text-green-500" : "text-red-500"
                                 }`}>
                                 {user.status}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </DialogContent>
            </Dialog>
         ) : null}
      </div>
   );
}
