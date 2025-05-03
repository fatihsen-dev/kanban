import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
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
   const displayUsers = users.slice(0, max);
   const remaining = users.length - max;

   const sizeClasses = {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
   };

   const statusClasses: Record<UserStatus, string> = {
      online: "bg-green-500",
      offline: "bg-red-500",
      away: "bg-yellow-500",
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
            <div
               className={cn(
                  "flex items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-background",
                  sizeClasses[size]
               )}>
               +{remaining}
            </div>
         ) : null}
      </div>
   );
}
